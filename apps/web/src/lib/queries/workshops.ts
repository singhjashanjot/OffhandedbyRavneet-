/* ========================================
   WORKSHOP QUERIES
   Server-side data fetching for workshops
======================================== */

import { createClient } from "@/lib/supabase/server";

export async function autoDeactivatePastWorkshops() {
  try {
    const supabase = createClient();
    
    // Get current date string in Asia/Kolkata timezone (YYYY-MM-DD)
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const today = formatter.format(new Date());

    // Update active workshops where date < today to is_active = false
    const { error } = await supabase
      .from("workshops")
      .update({ is_active: false })
      .lt("date", today)
      .eq("is_active", true);

    if (error) {
      console.error("Error in autoDeactivatePastWorkshops:", error);
    }
  } catch (err) {
    console.error("Unexpected error in autoDeactivatePastWorkshops:", err);
  }
}

export async function getActiveWorkshops() {
  try {
    await autoDeactivatePastWorkshops();
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
    await autoDeactivatePastWorkshops();
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
    await autoDeactivatePastWorkshops();
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
    await autoDeactivatePastWorkshops();
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
    await autoDeactivatePastWorkshops();
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
