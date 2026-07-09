/* ========================================
   BOOKING SERVER ACTIONS
   Read and write helpers for booking data.
======================================== */

"use server";

import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmationToCustomer, sendNewBookingAlertToOwner } from "@/lib/email";
import { requireAdmin } from "@/lib/queries/admin";
import { revalidatePath } from "next/cache";

/** Get the current user's bookings (authenticated) */
export async function getUserBookings() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*, workshops(title, date, start_time, venue_name, image), payments(amount, status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }
  return data;
}

/** Create an offline booking where customer chooses to pay at the workshop */
export async function createOfflineBooking(params: {
  workshopId: string;
  tickets: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  age?: string;
  remarks?: string;
  couponCode?: string;
}) {
  try {
    const supabase = createClient();
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Authentication required." };
    }

    const { workshopId, tickets, attendeeName, attendeeEmail, attendeePhone, age, remarks, couponCode } = params;

    // 2. Fetch workshop price and details from DB
    const { data: workshop, error: workshopError } = await supabase
      .from("workshops")
      .select("id, title, price, available_slots, is_active, date, start_time, end_time, venue_name, coupon_code, coupon_discount_percent")
      .eq("id", workshopId)
      .single();

    if (workshopError || !workshop) {
      return { success: false, error: "Workshop not found." };
    }

    if (!workshop.is_active) {
      return { success: false, error: "This workshop is no longer available." };
    }

    if (workshop.available_slots < tickets) {
      return { success: false, error: `Only ${workshop.available_slots} spot(s) remaining.` };
    }

    // 3. Check for duplicate confirmed booking
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("user_id", user.id)
      .eq("workshop_id", workshopId)
      .eq("status", "CONFIRMED")
      .maybeSingle();

    if (existingBooking) {
      return { success: false, error: "You have already booked this workshop." };
    }

    // 4. Atomically deduct slots
    const { data: slotResult, error: slotErr } = await supabase.rpc("decrement_workshop_slots", {
      p_workshop_id: workshopId,
      p_ticket_count: tickets,
    });

    if (slotErr || !slotResult) {
      return { success: false, error: "Sorry, these spots were just taken." };
    }

    // Calculate total amount in rupees
    let baseAmount = workshop.price * tickets;
    let appliedCouponCode = null;
    let appliedDiscountPercent = null;
    let discountAmount = 0;

    if (couponCode) {
      if (workshop.coupon_code && couponCode.toUpperCase() === workshop.coupon_code.toUpperCase()) {
        appliedCouponCode = workshop.coupon_code;
        appliedDiscountPercent = workshop.coupon_discount_percent || 0;
        discountAmount = Math.round(baseAmount * (appliedDiscountPercent / 100));
        baseAmount = Math.max(0, baseAmount - discountAmount);
      } else {
        return { success: false, error: "Invalid coupon code." };
      }
    }

    const grandTotal = baseAmount;

    // 5. Create payment record with PENDING status
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount: grandTotal,
        currency: "INR",
        purpose: "WORKSHOP",
        reference_id: workshopId,
        status: "PENDING",
        provider_order_id: "OFFLINE_PAYMENT",
      })
      .select("id")
      .single();

    if (paymentError || !payment) {
      // Revert slots manually
      const { data: wsData } = await supabase
        .from("workshops")
        .select("available_slots")
        .eq("id", workshopId)
        .single();
      if (wsData) {
        await supabase
          .from("workshops")
          .update({ available_slots: wsData.available_slots + tickets })
          .eq("id", workshopId);
      }
      return { success: false, error: "Failed to record payment initialization." };
    }

    // 6. Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        workshop_id: workshopId,
        payment_id: payment.id,
        tickets: tickets,
        attendee_name: attendeeName || user.user_metadata?.full_name || "Guest",
        attendee_email: attendeeEmail || user.email || "",
        attendee_phone: attendeePhone || null,
        age: age || null,
        remarks: remarks || null,
        status: "CONFIRMED",
        coupon_code: appliedCouponCode,
        coupon_discount_percent: appliedDiscountPercent,
        discount_amount: discountAmount,
      })
      .select("id")
      .single();

    if (bookingError || !booking) {
      // Revert slots manually
      const { data: wsData } = await supabase
        .from("workshops")
        .select("available_slots")
        .eq("id", workshopId)
        .single();
      if (wsData) {
        await supabase
          .from("workshops")
          .update({ available_slots: wsData.available_slots + tickets })
          .eq("id", workshopId);
      }
      await supabase.from("payments").delete().eq("id", payment.id);
      return { success: false, error: "Booking creation failed." };
    }

    // 7. Send confirmation emails (fire and forget)
    const finalName = attendeeName || user.user_metadata?.full_name || "Guest";
    const finalEmail = attendeeEmail || user.email || "";

    const workshopDateFormatted = workshop.date
      ? new Date(workshop.date).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })
      : "";
    const workshopTimeFormatted = workshop.start_time
      ? `${workshop.start_time}${workshop.end_time ? ` – ${workshop.end_time}` : ""}`
      : "";
    const workshopTitleFormatted = workshop.title || "Workshop";
    const workshopVenueFormatted = workshop.venue_name || "";

    // Send emails using async execution
    const sendEmails = async () => {
      try {
        const customerRes = await sendBookingConfirmationToCustomer({
          customerName: finalName,
          customerEmail: finalEmail,
          workshopTitle: workshopTitleFormatted,
          workshopDate: workshopDateFormatted,
          workshopTime: workshopTimeFormatted,
          workshopVenue: workshopVenueFormatted,
          tickets: tickets,
          amountPaid: grandTotal,
          bookingId: booking.id,
        });

        if (customerRes?.error) {
          console.error("Resend error sending offline customer email:", customerRes.error);
        } else {
          console.log("Offline customer email sent successfully:", customerRes?.data);
        }

        // Introduce a 500ms delay to respect Resend 2 requests/sec limit
        await new Promise((resolve) => setTimeout(resolve, 500));

        const ownerRes = await sendNewBookingAlertToOwner({
          customerName: finalName,
          customerEmail: finalEmail,
          customerPhone: attendeePhone,
          workshopTitle: workshopTitleFormatted,
          workshopDate: workshopDateFormatted,
          workshopTime: workshopTimeFormatted,
          tickets: tickets,
          amountPaid: grandTotal,
          bookingId: booking.id,
        });

        if (ownerRes?.error) {
          console.error("Resend error sending offline owner alert:", ownerRes.error);
        } else {
          console.log("Offline owner alert sent successfully:", ownerRes?.data);
        }
      } catch (err) {
        console.error("Error sending offline booking emails:", err);
      }
    };
    await sendEmails();

    revalidatePath("/");
    revalidatePath("/bookings");
    revalidatePath("/admin/bookings");

    return {
      success: true,
      bookingId: booking.id,
      grandTotal,
    };
  } catch (error: any) {
    console.error("Error in createOfflineBooking:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

/** Mark a pending payment as SUCCESS (offline cash/UPI payment received) */
export async function markPaymentAsDone(paymentId: string) {
  try {
    // 1. Verify user is admin
    await requireAdmin();

    const supabase = createClient();

    // 2. Fetch the payment record to check if it's PENDING
    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("id, status, purpose, reference_id, amount, user_id, bookings(tickets, workshops(price))")
      .eq("id", paymentId)
      .single();

    if (fetchError || !payment) {
      return { success: false, error: "Payment record not found." };
    }

    if (payment.status === "SUCCESS") {
      return { success: true, message: "Payment is already marked as done." };
    }

    let isPartial = false;
    let leftoverAmount = 0;
    let targetAmount = payment.amount;

    if (payment.purpose === "WORKSHOP" && payment.bookings && Array.isArray(payment.bookings) && payment.bookings.length > 0) {
      const b = payment.bookings[0] as any;
      if (b.workshops?.price) {
        const totalExpected = b.workshops.price * b.tickets;
        targetAmount = totalExpected;
        if (payment.amount < totalExpected) {
          isPartial = true;
          leftoverAmount = totalExpected - payment.amount;
        }
      }
    }

    if (isPartial && leftoverAmount > 0) {
      // 3a. Update original payment status to SUCCESS, keeping original amount
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "SUCCESS",
          provider_payment_id: "OFFLINE_CONFIRMED_" + new Date().getTime(),
        })
        .eq("id", paymentId);

      if (updateError) {
        console.error("Error marking original payment as done:", updateError);
        return { success: false, error: updateError.message };
      }

      // 3b. Create a NEW payment record for the leftover amount
      const { error: leftoverError } = await supabase
        .from("payments")
        .insert({
          user_id: payment.user_id,
          amount: leftoverAmount,
          currency: "INR",
          purpose: "WORKSHOP",
          reference_id: payment.reference_id,
          status: "SUCCESS",
          provider_payment_id: "OFFLINE_LEFTOVER_" + new Date().getTime(),
          provider_order_id: "OFFLINE_PAYMENT",
        });

      if (leftoverError) {
        console.error("Error inserting leftover payment record:", leftoverError);
      }
    } else {
      // 3c. Update original payment to SUCCESS, updating amount to targetAmount
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "SUCCESS",
          amount: targetAmount,
          provider_payment_id: "OFFLINE_CONFIRMED_" + new Date().getTime(),
        })
        .eq("id", paymentId);

      if (updateError) {
        console.error("Error marking payment as done:", updateError);
        return { success: false, error: updateError.message };
      }
    }

    revalidatePath("/bookings");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/purchases");

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in markPaymentAsDone:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
