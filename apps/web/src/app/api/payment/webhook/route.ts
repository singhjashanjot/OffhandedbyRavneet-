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
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key_for_build",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret_for_build",
});

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

    // Razorpay posts this endpoint server-to-server: no user cookies, so the
    // session client cannot read/write payments under RLS. Use the service
    // role when configured; otherwise log loudly instead of failing silently.
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = serviceKey
      ? createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceKey,
          { auth: { persistSession: false } }
        )
      : createClient();
    if (!serviceKey) {
      console.warn(
        "[webhook] SUPABASE_SERVICE_ROLE_KEY not set — webhook cannot repair missed payments (RLS blocks anon writes)."
      );
    }

    /* --------------------------------------------------
       3. Handle event types
    -------------------------------------------------- */
    if (eventType === "payment.captured") {
      const paymentEntity = (payload?.payment as Record<string, unknown>)
        ?.entity as Record<string, unknown>;

      const razorpayOrderId = paymentEntity?.order_id as string;
      const razorpayPaymentId = paymentEntity?.id as string;

      if (razorpayOrderId && razorpayPaymentId && serviceKey) {
        // Find our payment record by provider_order_id
        const { data: payment } = await supabase
          .from("payments")
          .select("id, status, purpose, user_id, reference_id")
          .eq("provider_order_id", razorpayOrderId)
          .maybeSingle();

        if (payment && payment.status === "CREATED") {
          if (payment.purpose === "WORKSHOP") {
            // Safety net for users who paid but never hit /verify (closed
            // browser). Run the SAME atomic RPC: it is idempotent, re-checks
            // the captured amount vs expected, and self-heals missing
            // profiles. 'CAPTURED' is not a valid payments.status — the RPC
            // writes SUCCESS / PENDING per payments_status_check.
            let ticketCount = 1;
            try {
              const order = await razorpay.orders.fetch(razorpayOrderId);
              ticketCount = parseInt(String(order.notes?.ticket_count), 10) || 1;
            } catch (e) {
              console.error("[webhook] Could not fetch order notes, defaulting to 1 ticket:", e);
            }

            const { data: profile } = await supabase
              .from("users_profile")
              .select("full_name, email")
              .eq("id", payment.user_id)
              .maybeSingle();

            const { data: confirmResult, error: confirmError } = await supabase.rpc(
              "confirm_workshop_booking",
              {
                p_payment_id: payment.id,
                p_ticket_count: ticketCount,
                p_attendee_name: profile?.full_name || "Guest",
                p_attendee_email: profile?.email || "",
                p_attendee_phone: null,
                p_coupon_code: null,
                p_provider_payment_id: razorpayPaymentId,
              }
            );

            console.log(
              `[webhook] Workshop payment ${payment.id} auto-confirm via RPC:`,
              confirmError ? `ERROR ${confirmError.message}` : JSON.stringify(confirmResult)
            );
            // NOTE: notification emails are NOT sent from the webhook path;
            // the verify route owns them. Review admin dashboard for
            // bookings confirmed here without emails.
          } else {
            // Non-workshop (product) capture: record the provider id only.
            // Status semantics for orders are handled in the verify route.
            await supabase
              .from("payments")
              .update({ provider_payment_id: razorpayPaymentId })
              .eq("id", payment.id);
            console.log(
              `[webhook] Payment ${payment.id} captured but purpose=${payment.purpose}; provider id recorded. Manual review may be needed.`
            );
          }
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
