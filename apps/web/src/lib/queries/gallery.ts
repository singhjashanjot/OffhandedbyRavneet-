/* ========================================
   GALLERY QUERIES
   Server-side data fetching for gallery
======================================== */

import { createClient } from "@/lib/supabase/server";

export async function getGalleryItems() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
  return data;
}

export async function getGalleryByCategory(category: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery by category:", error);
    return [];
  }
  return data;
}
