/* ========================================
   API: POST /api/payment/create-order
   Creates a Razorpay order on the backend.

   Security guarantees:
   - User must be authenticated (JWT verified server-side)
   - Price is always fetched from DB — never trusted from client
   - Order ID ties the DB payment record to the Razorpay order
   - Returns only public-safe data to the frontend
======================================== */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key_for_build",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret_for_build",
});

export async function POST(request: NextRequest) {
  try {
    /* --------------------------------------------------
       1. Authenticate the user — never trust client claims
    -------------------------------------------------- */
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    /* --------------------------------------------------
       2. Parse and validate request body
    -------------------------------------------------- */
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { workshopId, tickets, productId, quantity, paymentOption, couponCode } = body as {
      workshopId?: string;
      tickets?: number;
      productId?: string;
      quantity?: number;
      paymentOption?: "full" | "partial";
      couponCode?: string;
    };

    const isWorkshop = !!workshopId;
    const isProduct = !!productId;

    if (!isWorkshop && !isProduct) {
      return NextResponse.json(
        { error: "Either workshopId or productId is required." },
        { status: 400 }
      );
    }

    /* --------------------------------------------------
       3. Fetch price from DB — never from request body
    -------------------------------------------------- */
    let amountInPaise: number;
    let purpose: string;
    let referenceId: string;
    let description: string;

    if (isWorkshop) {
      const ticketCount = Number(tickets) || 1;
      if (!Number.isInteger(ticketCount) || ticketCount < 1 || ticketCount > 10) {
        return NextResponse.json({ error: "Invalid ticket count." }, { status: 400 });
      }

      const { data: workshop, error: workshopError } = await supabase
        .from("workshops")
        .select("id, title, price, price_for_two, available_slots, is_active, coupon_code, coupon_discount_percent")
        .eq("id", workshopId)
        .single();

      if (workshopError || !workshop) {
        return NextResponse.json({ error: "Workshop not found." }, { status: 404 });
      }
      if (!workshop.is_active) {
        return NextResponse.json(
          { error: "This workshop is no longer available." },
          { status: 400 }
        );
      }
      if (workshop.available_slots < ticketCount) {
        return NextResponse.json(
          { error: `Only ${workshop.available_slots} spot(s) remaining.` },
          { status: 400 }
        );
      }

      // Check for duplicate confirmed booking
      const { data: existingBooking } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", user.id)
        .eq("workshop_id", workshopId)
        .eq("status", "CONFIRMED")
        .maybeSingle();

      if (existingBooking) {
        return NextResponse.json(
          { error: "You have already booked this workshop." },
          { status: 409 }
        );
      }

      let baseAmount = 0;
      if (workshop.price_for_two && ticketCount >= 2) {
        const pairs = Math.floor(ticketCount / 2);
        const remainder = ticketCount % 2;
        baseAmount = (pairs * workshop.price_for_two) + (remainder * workshop.price);
      } else {
        baseAmount = workshop.price * ticketCount;
      }

      if (couponCode) {
        if (workshop.coupon_code && couponCode.toUpperCase() === workshop.coupon_code.toUpperCase()) {
          const discountPercent = workshop.coupon_discount_percent || 0;
          const discountAmount = Math.round(baseAmount * (discountPercent / 100));
          baseAmount = Math.max(0, baseAmount - discountAmount);
        } else {
          return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
        }
      }

      const isPartial = paymentOption === "partial";
      const finalAmount = isPartial ? Math.round(baseAmount * 0.60) : baseAmount;
      amountInPaise = Math.round(finalAmount * 100); // Razorpay uses smallest currency unit
      purpose = "WORKSHOP";
      referenceId = workshop.id;
      description = `${workshop.title} — ${ticketCount} ticket(s)${isPartial ? " (60% Partial)" : ""}${couponCode ? ` (Coupon: ${couponCode})` : ""}`;
    } else {
      // Product checkout
      const qty = Number(quantity) || 1;
      if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
        return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
      }

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, name, price, is_active")
        .eq("id", productId)
        .single();

      if (productError || !product) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
      }
      if (!product.is_active) {
        return NextResponse.json(
          { error: "This product is no longer available." },
          { status: 400 }
        );
      }

      const baseAmount = product.price * qty;
      amountInPaise = Math.round(baseAmount * 100);
      purpose = "PRODUCT";
      referenceId = product.id;
      description = `${product.name} × ${qty}`;
    }

    /* --------------------------------------------------
       4. Create Razorpay order (server-side call)
    -------------------------------------------------- */
    const orderNotes: Record<string, string> = {
      user_id: user.id,
      purpose,
      reference_id: referenceId,
    };
    if (isWorkshop) {
      orderNotes.ticket_count = String(Number(tickets) || 1);
    } else if (isProduct) {
      orderNotes.quantity = String(Number(quantity) || 1);
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      notes: orderNotes,
    });

    /* --------------------------------------------------
       5. Persist payment record in DB (status: CREATED)
         This is the source of truth — links our DB record
         to the Razorpay order before any payment happens.
    -------------------------------------------------- */
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount: amountInPaise / 100, // Store in rupees
        currency: "INR",
        purpose,
        reference_id: referenceId,
        status: "CREATED",
        provider_order_id: razorpayOrder.id,
      })
      .select("id")
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "Failed to initialise payment. Please try again." },
        { status: 500 }
      );
    }

    /* --------------------------------------------------
       6. Return only what the frontend needs.
         Key Secret is NEVER sent to the frontend.
    -------------------------------------------------- */
    return NextResponse.json({
      orderId: razorpayOrder.id,      // Razorpay order ID
      paymentId: payment.id,          // Our DB payment record ID
      amount: amountInPaise,          // In paise
      currency: "INR",
      description,
      keyId: process.env.RAZORPAY_KEY_ID, // Public key only
      prefill: {
        name: user.user_metadata?.full_name || "",
        email: user.email || "",
        contact: user.user_metadata?.phone_number || "",
      },
    });
  } catch (err) {
    // Never expose internal error details
    console.error("[create-order] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
