/* ========================================
   BOOKING SERVER ACTIONS
   Read-only helpers for fetching booking data.

   NOTE: Booking CREATION now happens exclusively
   in /api/payment/verify after Razorpay signature
   verification. This prevents any booking from
   being created without a real payment.
======================================== */

"use server";

import { createClient } from "@/lib/supabase/server";

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
