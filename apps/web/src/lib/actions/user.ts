"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserProfileData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not logged in" };
  }

  // Fetch user profile (for join date)
  const { data: profile } = await supabase
    .from("users_profile")
    .select("created_at, full_name, email")
    .eq("id", user.id)
    .single();

  // Fetch bookings (only successful ones)
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      created_at,
      status,
      workshops (
        id,
        title,
        date,
        start_time,
        image
      ),
      payments (
        amount
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "CONFIRMED")
    .order("created_at", { ascending: false });

  // Fetch product orders (only successful/pending/paid ones)
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      total_amount,
      order_items (
        quantity,
        price_snapshot,
        products (
          id,
          name,
          images
        )
      )
    `)
    .eq("user_id", user.id)
    .in("status", ["PENDING", "PAID", "SUCCESS", "CONFIRMED", "SHIPPED", "DELIVERED"])
    .order("created_at", { ascending: false });

  return {
    success: true,
    user: {
      id: user.id,
      name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      email: profile?.email || user.email,
      joinedAt: profile?.created_at || user.created_at,
    },
    bookings: bookings || [],
    orders: orders || [],
  };
}
