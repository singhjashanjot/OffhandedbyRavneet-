/* ========================================
   ADMIN QUERY HELPERS
   Server-side functions for admin data access
======================================== */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { autoDeactivatePastWorkshops } from "./workshops";

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
  await autoDeactivatePastWorkshops();
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
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "*, workshops(title, date, start_time, venue_name, price, image), payments(id, amount, status, currency, provider_payment_id, provider_order_id)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching admin bookings:", error);
    return [];
  }

  if (bookings && bookings.length > 0) {
    // Fetch all workshop payments for the users in these bookings
    const userIds = bookings.map((b: any) => b.user_id);
    const workshopIds = bookings.map((b: any) => b.workshop_id);

    const { data: relatedPayments } = await supabase
      .from("payments")
      .select("id, user_id, reference_id, amount, status")
      .in("user_id", userIds)
      .in("reference_id", workshopIds)
      .eq("purpose", "WORKSHOP")
      .eq("status", "SUCCESS");

    const successPaymentMap = new Map<string, number>();
    if (relatedPayments) {
      relatedPayments.forEach((p: any) => {
        const key = `${p.user_id}_${p.reference_id}`;
        successPaymentMap.set(key, (successPaymentMap.get(key) || 0) + (p.amount || 0));
      });
    }

    bookings.forEach((booking: any) => {
      const key = `${booking.user_id}_${booking.workshop_id}`;
      const successSum = successPaymentMap.get(key) || 0;
      
      // If the main payment linked to the booking is not SUCCESS (e.g. PENDING or CREATED),
      // we should still count its amount as part of the total paid amount (online partial payment)
      let totalPaid = successSum;
      if (booking.payments && booking.payments.status !== "SUCCESS") {
        totalPaid += booking.payments.amount || 0;
      }
      
      booking.total_paid_amount = totalPaid;
    });
  }

  return bookings;
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

  // Fetch all user profiles first to map them manually
  const { data: users } = await supabase.from("users_profile").select("id, full_name, email");
  const userMap = new Map((users || []).map(u => [u.id, u]));

  // Fetch all payments
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (paymentsError) {
    console.error("Error fetching payments:", paymentsError);
    return { payments: [], bookings: [], orders: [] };
  }

  // Fetch bookings with workshop titles
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*, workshops(title, date), payments(amount, status, provider_order_id, provider_payment_id)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
  }

  // Fetch product orders with items
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, payments(amount, status), order_items(quantity, price_snapshot, products(name))")
    .order("created_at", { ascending: false })
    .limit(100);

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  // Map users to the records manually
  const mapUser = (record: any) => ({
    ...record,
    users_profile: userMap.get(record.user_id) || null
  });

  return {
    payments: (payments || []).map(mapUser),
    bookings: (bookings || []).map(mapUser),
    orders: (orders || []).map(mapUser),
  };
}

/** Get all products for admin management */
export async function getAdminProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
  return data;
}
