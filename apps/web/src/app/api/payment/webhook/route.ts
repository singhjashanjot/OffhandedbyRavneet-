/* ========================================
   API: POST /api/payment/webhook
   Razorpay Webhook Handler

   This is a secondary verification layer.
   Razorpay calls this endpoint directly after
   payment events, independent of the frontend.

   Use cases:
   - payment.captured: confirm missed verifications
   - payment.failed: mark payments as failed
   - order.paid: redundant success confirmation

   Security:
   - Webhook signature verified using RAZORPAY_WEBHOOK_SECRET
   - Raw body must be used for signature (not parsed JSON)
   - Returns 200 quickly to prevent Razorpay retry storms
======================================== */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // If webhook secret is not configured, skip webhook processing
    if (!webhookSecret) {
      console.warn("[webhook] RAZORPAY_WEBHOOK_SECRET not configured — skipping.");
      return NextResponse.json({ received: true });
    }

    /* --------------------------------------------------
       1. Verify webhook signature using raw body
    -------------------------------------------------- */
    const rawBody = await request.text();
    const receivedSignature = request.headers.get("x-razorpay-signature");

    if (!receivedSignature) {
      return NextResponse.json({ error: "Missing signature." }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const sigBuf = Buffer.from(expectedSignature, "hex");
    const recvBuf = Buffer.from(receivedSignature, "hex");
    if (sigBuf.length !== recvBuf.length || !crypto.timingSafeEqual(sigBuf, recvBuf)) {
      console.warn("[webhook] Invalid webhook signature received.");
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    /* --------------------------------------------------
       2. Parse event
    -------------------------------------------------- */
    let event: Record<string, unknown>;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const eventType = event.event as string;
    const payload = event.payload as Record<string, unknown>;

    const supabase = createClient();

    /* --------------------------------------------------
       3. Handle event types
    -------------------------------------------------- */
    if (eventType === "payment.captured") {
      const paymentEntity = (payload?.payment as Record<string, unknown>)
        ?.entity as Record<string, unknown>;

      const razorpayOrderId = paymentEntity?.order_id as string;
      const razorpayPaymentId = paymentEntity?.id as string;

      if (razorpayOrderId && razorpayPaymentId) {
        // Find our payment record by provider_order_id
        const { data: payment } = await supabase
          .from("payments")
          .select("id, status")
          .eq("provider_order_id", razorpayOrderId)
          .maybeSingle();

        if (payment && payment.status === "CREATED") {
          // Payment captured but verify endpoint wasn't called (e.g., user closed browser)
          // Mark payment captured — admin can review and manually confirm booking
          await supabase
            .from("payments")
            .update({
              status: "CAPTURED",
              provider_payment_id: razorpayPaymentId,
            })
            .eq("id", payment.id);

          console.log(
            `[webhook] Payment ${payment.id} marked CAPTURED via webhook. Manual review may be needed.`
          );
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = (payload?.payment as Record<string, unknown>)
        ?.entity as Record<string, unknown>;

      const razorpayOrderId = paymentEntity?.order_id as string;

      if (razorpayOrderId) {
        await supabase
          .from("payments")
          .update({ status: "FAILED" })
          .eq("provider_order_id", razorpayOrderId)
          .eq("status", "CREATED"); // Only update if still in CREATED state
      }
    }

    // Always return 200 to prevent Razorpay from retrying
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] Unexpected error:", err);
    // Still return 200 to prevent retry storms — log for investigation
    return NextResponse.json({ received: true });
  }
}
