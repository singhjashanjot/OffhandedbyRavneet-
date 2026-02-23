/* ========================================
   BOOKING SERVER ACTIONS
   Handles booking creation, payment
   processing, and slot management
======================================== */

"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface BookingInput {
  workshopId: string;
  tickets: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
}

export async function createBooking(input: BookingInput) {
  const supabase = createClient();

  // 1. Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to make a booking." };
  }

  // 2. Fetch workshop to validate
  const { data: workshop, error: workshopError } = await supabase
    .from("workshops")
    .select("id, title, price, available_slots, is_active")
    .eq("id", input.workshopId)
    .single();

  if (workshopError || !workshop) {
    return { error: "Workshop not found." };
  }

  if (!workshop.is_active) {
    return { error: "This workshop is no longer available." };
  }

  if (workshop.available_slots < input.tickets) {
    return { error: `Only ${workshop.available_slots} spots remaining.` };
  }

  // 3. Check for duplicate booking
  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("user_id", user.id)
    .eq("workshop_id", input.workshopId)
    .eq("status", "CONFIRMED")
    .single();

  if (existingBooking) {
    return { error: "You have already booked this workshop." };
  }

  const totalAmount = workshop.price * input.tickets;

  // 4. Create payment record
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      amount: totalAmount,
      currency: "INR",
      purpose: "WORKSHOP",
      reference_id: workshop.id,
      status: "CREATED",
    })
    .select()
    .single();

  if (paymentError || !payment) {
    return { error: "Failed to create payment record." };
  }

  // 5. Atomically deduct slots
  const { data: slotResult } = await supabase.rpc("decrement_workshop_slots", {
    p_workshop_id: input.workshopId,
    p_ticket_count: input.tickets,
  });

  if (!slotResult) {
    // Slots were taken — mark payment as failed
    await supabase
      .from("payments")
      .update({ status: "FAILED" })
      .eq("id", payment.id);
    return { error: "Sorry, these spots were just taken. Please refresh and try again." };
  }

  // 6. Create booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      workshop_id: input.workshopId,
      payment_id: payment.id,
      tickets: input.tickets,
      attendee_name: input.attendeeName,
      attendee_email: input.attendeeEmail,
      attendee_phone: input.attendeePhone || null,
      status: "CONFIRMED",
    })
    .select()
    .single();

  if (bookingError || !booking) {
    return { error: "Failed to create booking. Please contact support." };
  }

  // 7. Mark payment as success (in production, this would happen after gateway confirmation)
  await supabase
    .from("payments")
    .update({ status: "SUCCESS" })
    .eq("id", payment.id);

  return {
    success: true,
    bookingId: booking.id,
    paymentId: payment.id,
    workshopTitle: workshop.title,
    totalAmount,
  };
}

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
    console.error("Error fetching user bookings:", error);
    return [];
  }
  return data;
}
