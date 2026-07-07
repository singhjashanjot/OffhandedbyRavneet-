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
import { createClient } from "@/lib/supabase/server";
import {
  sendBookingConfirmationToCustomer,
  sendNewBookingAlertToOwner,
  sendProductConfirmationToCustomer,
  sendProductAlertToOwner,
} from "@/lib/email";

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
      productId?: string;
      quantity?: number;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      return NextResponse.json(
        { error: "Missing required payment verification fields." },
        { status: 400 }
      );
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

    if (expectedSignature !== razorpay_signature) {
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
      .select("id, user_id, status, provider_order_id, purpose, reference_id, amount")
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
    if (payment.status === "SUCCESS") {
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
       6. Mark payment as SUCCESS with provider IDs
    -------------------------------------------------- */
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "SUCCESS",
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
      const ticketCount = Number(tickets) || 1;

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
          sendBookingConfirmationToCustomer({
            customerName: finalName,
            customerEmail: finalEmail,
            workshopTitle,
            workshopDate,
            workshopTime,
            workshopVenue,
            tickets: ticketCount,
            amountPaid: payment.amount,
            bookingId: booking.id,
          })
            .then((r) => console.log("[email] ✅ Customer confirmation sent:", r))
            .catch((e) => console.error("[email] ❌ Customer confirmation FAILED:", e));

          // Owner alert
          sendNewBookingAlertToOwner({
            customerName: finalName,
            customerEmail: finalEmail,
            customerPhone: attendeePhone,
            workshopTitle,
            workshopDate,
            workshopTime,
            tickets: ticketCount,
            amountPaid: payment.amount,
            bookingId: booking.id,
          })
            .then((r) => console.log("[email] ✅ Owner alert sent:", r))
            .catch((e) => console.error("[email] ❌ Owner alert FAILED:", e));
        } catch (e) {
          console.error("[email] Workshop fetch failed:", e);
        }
      };

      sendEmails();

    } else if (payment.purpose === "PRODUCT") {
      const qty = Number(quantity) || 1;

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

          sendProductConfirmationToCustomer({
            customerName: finalName,
            customerEmail: finalEmail,
            productName: product.name,
            quantity: qty,
            amountPaid: payment.amount,
            orderId: order.id,
          })
            .then((r) => console.log("[email] ✅ Product customer email sent:", r))
            .catch((e) => console.error("[email] ❌ Product customer email FAILED:", e));

          sendProductAlertToOwner({
            customerName: finalName,
            customerEmail: finalEmail,
            productName: product.name,
            quantity: qty,
            amountPaid: payment.amount,
            orderId: order.id,
          })
            .then((r) => console.log("[email] ✅ Product owner alert sent:", r))
            .catch((e) => console.error("[email] ❌ Product owner alert FAILED:", e));
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
