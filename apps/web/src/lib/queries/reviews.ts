/* ========================================
   REVIEW QUERIES
   Server-side data fetching for reviews
======================================== */

import { createClient } from "@/lib/supabase/server";

export async function getApprovedReviews() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
  return data;
}

export async function getFeaturedReviews() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured reviews:", error);
    return [];
  }
  return data;
}
