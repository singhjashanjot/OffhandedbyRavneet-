/* ========================================
   API: POST /api/payment/verify
   Verifies Razorpay payment signature and
   confirms the booking/order in the database.

   Security guarantees:
   - User must be authenticated
   - HMAC SHA256 signature verified server-side using Key Secret
   - Payment record ownership checked (user_id must match)
   - Idempotent — duplicate calls are safe (replay attack prevention)
   - Booking/order created ONLY after signature verification
   - Failed payments never create confirmed records
======================================== */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";
import {
  sendBookingConfirmationToCustomer,
  sendNewBookingAlertToOwner,
  sendProductConfirmationToCustomer,
  sendProductAlertToOwner,
} from "@/lib/email";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key_for_build",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret_for_build",
});

export async function POST(request: NextRequest) {
  try {
    /* --------------------------------------------------
       1. Authenticate — every endpoint must verify identity
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
       2. Parse request body
    -------------------------------------------------- */
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId, // Our internal DB payment record ID
      // Workshop-specific
      workshopId,
      tickets,
      attendeeName,
      attendeeEmail,
      attendeePhone,
      couponCode,
      // Product-specific
      productId,
      quantity,
    } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      paymentId?: string;
      workshopId?: string;
      tickets?: number;
      attendeeName?: string;
      attendeeEmail?: string;
      attendeePhone?: string;
      couponCode?: string;
      productId?: string;
      quantity?: number;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      return NextResponse.json(
        { error: "Missing required payment verification fields." },
        { status: 400 }
      );
    }

    // Validate optional attendee fields to prevent email header/HTML injection
    if (attendeeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail)) {
      return NextResponse.json({ error: "Invalid attendee email." }, { status: 400 });
    }
    if (attendeePhone && attendeePhone.length > 20) {
      return NextResponse.json({ error: "Phone number is too long." }, { status: 400 });
    }

    /* --------------------------------------------------
       3. Verify HMAC SHA256 signature
         This is the critical security step.
         The signature is: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
         If this check fails, the payment is rejected — no exceptions.
    -------------------------------------------------- */
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("[verify] RAZORPAY_KEY_SECRET is not configured.");
      return NextResponse.json(
        { error: "Payment service is not configured." },
        { status: 503 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const sigBuf = Buffer.from(expectedSignature, "hex");
    const recvBuf = Buffer.from(razorpay_signature, "hex");
    if (sigBuf.length !== recvBuf.length || !crypto.timingSafeEqual(sigBuf, recvBuf)) {
      // Signature mismatch — potential tampered request
      console.warn(
        `[verify] Signature mismatch for user ${user.id}, order ${razorpay_order_id}`
      );
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    /* --------------------------------------------------
       4. Fetch our payment record and verify ownership
         Prevents IDOR: user can only confirm their own payment
    -------------------------------------------------- */
    const { data: payment, error: paymentFetchError } = await supabase
      .from("payments")
      .select("id, user_id, status, provider_order_id, purpose, reference_id, amount, provider_payment_id")
      .eq("id", paymentId)
      .single();

    if (paymentFetchError || !payment) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    // Ownership check
    if (payment.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorised." },
        { status: 403 }
      );
    }

    // Ensure this payment record belongs to the claimed Razorpay order
    if (payment.provider_order_id !== razorpay_order_id) {
      return NextResponse.json(
        { error: "Order ID mismatch." },
        { status: 400 }
      );
    }

    /* --------------------------------------------------
       5. Idempotency check — prevent replay attacks
         If already verified, return the existing result safely.
    -------------------------------------------------- */
    if (payment.status === "SUCCESS" || (payment.status === "PENDING" && payment.provider_payment_id)) {
      // Already confirmed — return existing booking if available
      if (payment.purpose === "WORKSHOP") {
        const { data: existingBooking } = await supabase
          .from("bookings")
          .select("id")
          .eq("payment_id", paymentId)
          .maybeSingle();

        return NextResponse.json({
          success: true,
          alreadyVerified: true,
          bookingId: existingBooking?.id,
        });
      }
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    if (payment.status === "FAILED") {
      return NextResponse.json(
        { error: "This payment has already been marked as failed." },
        { status: 409 }
      );
    }

    /* --------------------------------------------------
       5b. Fetch authoritative ticket count from Razorpay order notes
         NEVER trust client-supplied ticket/quantity counts —
         use the value stored during create-order instead.
    -------------------------------------------------- */
    let serverTicketCount = 1;
    let serverQuantity = 1;

    try {
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
      const notes = razorpayOrder.notes || {};
      if (payment.purpose === "WORKSHOP") {
        serverTicketCount = parseInt(String(notes.ticket_count), 10) || 1;
        if (!Number.isInteger(serverTicketCount) || serverTicketCount < 1 || serverTicketCount > 10) {
          return NextResponse.json(
            { error: "Invalid ticket count in order." },
            { status: 400 }
          );
        }
      } else if (payment.purpose === "PRODUCT") {
        serverQuantity = parseInt(String(notes.quantity), 10) || 1;
        if (!Number.isInteger(serverQuantity) || serverQuantity < 1 || serverQuantity > 100) {
          return NextResponse.json(
            { error: "Invalid quantity in order." },
            { status: 400 }
          );
        }
      }
    } catch (orderErr) {
      console.error("[verify] Failed to fetch Razorpay order for ticket validation:", orderErr);
      return NextResponse.json(
        { error: "Could not verify order details. Please contact support." },
        { status: 500 }
      );
    }

    /* --------------------------------------------------
       6. Mark payment with provider IDs (PENDING if partial, SUCCESS if full)
    -------------------------------------------------- */
    let isPartial = false;
    let appliedCouponCode = null;
    let appliedDiscountPercent = null;
    let discountAmount = null;

    if (payment.purpose === "WORKSHOP") {
      const { data: workshop } = await supabase
        .from("workshops")
        .select("price, coupon_code, coupon_discount_percent")
        .eq("id", payment.reference_id)
        .single();
      if (workshop) {
        const ticketCount = serverTicketCount;
        let totalExpected = workshop.price * ticketCount;

        if (couponCode && workshop.coupon_code && couponCode.toUpperCase() === workshop.coupon_code.toUpperCase()) {
          appliedCouponCode = workshop.coupon_code;
          appliedDiscountPercent = workshop.coupon_discount_percent || 0;
          discountAmount = Math.round(totalExpected * (appliedDiscountPercent / 100));
          totalExpected = Math.max(0, totalExpected - discountAmount);
        }

        isPartial = payment.amount < totalExpected;
      }
    }

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: isPartial ? "PENDING" : "SUCCESS",
        provider_payment_id: razorpay_payment_id,
        provider_signature: razorpay_signature,
      })
      .eq("id", paymentId)
      .eq("status", "CREATED"); // Extra guard: only update if still CREATED

    if (updateError) {
      console.error("[verify] Failed to update payment status:", updateError);
      return NextResponse.json(
        { error: "Failed to record payment. Please contact support." },
        { status: 500 }
      );
    }

    /* --------------------------------------------------
       7. Create booking / order record
    -------------------------------------------------- */
    let bookingId: string | undefined;

    if (payment.purpose === "WORKSHOP") {
      const ticketCount = serverTicketCount;

      // Atomically deduct slots
      const { data: slotResult } = await supabase.rpc("decrement_workshop_slots", {
        p_workshop_id: payment.reference_id,
        p_ticket_count: ticketCount,
      });

      if (!slotResult) {
        // Slots exhausted — refund would need to happen via Razorpay dashboard
        await supabase
          .from("payments")
          .update({ status: "FAILED" })
          .eq("id", paymentId);

        return NextResponse.json(
          {
            error:
              "Sorry, these spots were just taken. Please contact support for a refund.",
          },
          { status: 409 }
        );
      }

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          workshop_id: payment.reference_id,
          payment_id: paymentId,
          tickets: ticketCount,
          attendee_name: attendeeName || user.user_metadata?.full_name || "Guest",
          attendee_email: attendeeEmail || user.email || "",
          attendee_phone: attendeePhone || null,
          status: "CONFIRMED",
          coupon_code: appliedCouponCode,
          coupon_discount_percent: appliedDiscountPercent,
          discount_amount: discountAmount,
        })
        .select("id")
        .single();

      if (bookingError || !booking) {
        console.error("[verify] Failed to create booking:", bookingError);
        return NextResponse.json(
          { error: "Payment received but booking creation failed. Please contact support." },
          { status: 500 }
        );
      }

      bookingId = booking.id;

      /* --------------------------------------------------
         Send emails — fire and forget but with visible logs
      -------------------------------------------------- */
      const finalName = attendeeName || user.user_metadata?.full_name || "Guest";
      const finalEmail = attendeeEmail || user.email || "";

      console.log(`[email] Attempting to send emails for booking ${booking.id} to ${finalEmail}`);

      // Fetch workshop details then send both emails
      const sendEmails = async () => {
        try {
          const { data: ws, error: wsErr } = await supabase
            .from("workshops")
            .select("title, date, start_time, end_time, venue_name")
            .eq("id", payment.reference_id)
            .single();

          if (wsErr) {
            console.error("[email] Failed to fetch workshop details:", wsErr);
          }

          const workshopDate = ws?.date
            ? new Date(ws.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Kolkata",
              })
            : "";
          const workshopTime = ws?.start_time
            ? `${ws.start_time}${ws.end_time ? ` – ${ws.end_time}` : ""}`
            : "";
          const workshopTitle = ws?.title || "Workshop";
          const workshopVenue = ws?.venue_name || "";

          console.log(`[email] Workshop fetched: "${workshopTitle}", sending to customer: ${finalEmail}`);

          // Customer confirmation
          const customerRes = await sendBookingConfirmationToCustomer({
            customerName: finalName,
            customerEmail: finalEmail,
            workshopTitle,
            workshopDate,
            workshopTime,
            workshopVenue,
            tickets: ticketCount,
            amountPaid: payment.amount,
            bookingId: booking.id,
          });

          if (customerRes?.error) {
            console.error("[email] ❌ Customer confirmation FAILED:", customerRes.error);
          } else {
            console.log("[email] ✅ Customer confirmation sent:", customerRes?.data);
          }

          // Introduce a 500ms delay to respect Resend 2 requests/sec limit
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Owner alert
          const ownerRes = await sendNewBookingAlertToOwner({
            customerName: finalName,
            customerEmail: finalEmail,
            customerPhone: attendeePhone,
            workshopTitle,
            workshopDate,
            workshopTime,
            tickets: ticketCount,
            amountPaid: payment.amount,
            bookingId: booking.id,
          });

          if (ownerRes?.error) {
            console.error("[email] ❌ Owner alert FAILED:", ownerRes.error);
          } else {
            console.log("[email] ✅ Owner alert sent:", ownerRes?.data);
          }
        } catch (e) {
          console.error("[email] Workshop fetch or send failed:", e);
        }
      };

      await sendEmails();

    } else if (payment.purpose === "PRODUCT") {
      const qty = serverQuantity;

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          payment_id: paymentId,
          status: "PENDING",
          total_amount: payment.amount,
        })
        .select("id")
        .single();

      if (orderError) {
        console.error("[verify] orderError creating product order:", orderError);
      }

      if (!orderError && order) {
        // Create order item
        const { data: product } = await supabase
          .from("products")
          .select("id, price, name")
          .eq("id", payment.reference_id)
          .single();

        if (product) {
          await supabase.from("order_items").insert({
            order_id: order.id,
            product_id: product.id,
            quantity: qty,
            price_snapshot: product.price,
          });

          // Send product emails
          const finalName = user.user_metadata?.full_name || "Guest";
          const finalEmail = user.email || "";
          console.log(`[email] Sending product emails for order ${order.id} to ${finalEmail}`);

          const customerRes = await sendProductConfirmationToCustomer({
            customerName: finalName,
            customerEmail: finalEmail,
            productName: product.name,
            quantity: qty,
            amountPaid: payment.amount,
            orderId: order.id,
          });

          if (customerRes?.error) {
            console.error("[email] ❌ Product customer email FAILED:", customerRes.error);
          } else {
            console.log("[email] ✅ Product customer email sent:", customerRes?.data);
          }

          // Introduce a 500ms delay to respect Resend 2 requests/sec limit
          await new Promise((resolve) => setTimeout(resolve, 500));

          const ownerRes = await sendProductAlertToOwner({
            customerName: finalName,
            customerEmail: finalEmail,
            productName: product.name,
            quantity: qty,
            amountPaid: payment.amount,
            orderId: order.id,
          });

          if (ownerRes?.error) {
            console.error("[email] ❌ Product owner alert FAILED:", ownerRes.error);
          } else {
            console.log("[email] ✅ Product owner alert sent:", ownerRes?.data);
          }
        }
        bookingId = order.id;
      }
    }

    return NextResponse.json({
      success: true,
      bookingId,
      amount: payment.amount,
    });
  } catch (err) {
    console.error("[verify] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please contact support." },
      { status: 500 }
    );
  }
}
