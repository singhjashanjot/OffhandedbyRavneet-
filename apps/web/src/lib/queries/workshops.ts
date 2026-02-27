/* ========================================
   WORKSHOP QUERIES
   Server-side data fetching for workshops
======================================== */

import { createClient } from "@/lib/supabase/server";

export async function getActiveWorkshops() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("workshops")
      .select("*, workshop_images(*)")
      .eq("is_active", true)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching workshops:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching workshops:", error);
    return [];
  }
}

export async function getWorkshopById(id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("workshops")
      .select("*, workshop_images(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching workshop:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching workshop:", error);
    return null;
  }
}

export async function getWorkshopBySlug(slug: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("workshops")
      .select("*, workshop_images(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching workshop by slug:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching workshop by slug:", error);
    return null;
  }
}

export async function getWorkshopsByCategory(category: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("workshops")
      .select("*, workshop_images(*)")
      .eq("category", category)
      .eq("is_active", true)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching workshops by category:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching workshops by category:", error);
    return [];
  }
}

export async function getUpcomingWorkshops(limit = 6) {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("workshops")
      .select("*, workshop_images(*)")
      .eq("is_active", true)
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching upcoming workshops:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching upcoming workshops:", error);
    return [];
  }
}
