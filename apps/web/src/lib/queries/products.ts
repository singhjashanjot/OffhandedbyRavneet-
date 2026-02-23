/* ========================================
   PRODUCT QUERIES
   Server-side data fetching for products
======================================== */

import { createClient } from "@/lib/supabase/server";

export async function getActiveProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

export async function getProductById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}
