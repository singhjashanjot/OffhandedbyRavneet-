/* ========================================
   ADMIN QUERY HELPERS
   Server-side functions for admin data access
======================================== */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Verify current user is admin, redirect to home if not */
export async function requireAdmin() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  const { data: profile } = await supabase
    .from("users_profile")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return user;
}

/** Get admin dashboard stats */
export async function getAdminStats() {
  const supabase = createClient();

  const [workshopsRes, bookingsRes, usersRes, revenueRes] = await Promise.all([
    supabase.from("workshops").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "CONFIRMED"),
    supabase.from("users_profile").select("id", { count: "exact", head: true }),
    supabase.from("payments").select("amount").eq("status", "SUCCESS"),
  ]);

  const totalRevenue = (revenueRes.data || []).reduce(
    (sum: number, p: any) => sum + (p.amount || 0),
    0
  );

  return {
    totalWorkshops: workshopsRes.count || 0,
    totalBookings: bookingsRes.count || 0,
    totalUsers: usersRes.count || 0,
    totalRevenue,
  };
}

/** Get all workshops for admin management */
export async function getAdminWorkshops() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workshops")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching admin workshops:", error);
    return [];
  }
  return data;
}

/** Get all bookings for admin management */
export async function getAdminBookings() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, workshops(title, date), payments(amount, status)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching admin bookings:", error);
    return [];
  }
  return data;
}

/** Get all reviews for admin moderation */
export async function getAdminReviews() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin reviews:", error);
    return [];
  }
  return data;
}

/** Get recent users */
export async function getAdminUsers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users_profile")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
  return data;
}

/** Get all payments/purchases for admin dashboard */
export async function getAdminPurchases() {
  const supabase = createClient();

  // Fetch all payments with related user profiles
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("*, users_profile:user_id(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (paymentsError) {
    console.error("Error fetching payments:", paymentsError);
    return { payments: [], bookings: [], orders: [] };
  }

  // Fetch bookings with workshop titles
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*, workshops(title, date), users_profile:user_id(full_name, email), payments(amount, status, provider_order_id, provider_payment_id)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
  }

  // Fetch product orders with items
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, users_profile:user_id(full_name, email), payments(amount, status), order_items(quantity, price_snapshot, products(name))")
    .order("created_at", { ascending: false })
    .limit(100);

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  return {
    payments: payments || [],
    bookings: bookings || [],
    orders: orders || [],
  };
}
