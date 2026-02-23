"use server";

/* ========================================
   ADMIN WORKSHOP SERVER ACTIONS
   Create, Update, Delete workshops
======================================== */

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── Helpers ──────────────────────────────

async function verifyAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("users_profile")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") throw new Error("Not authorized");

  return { supabase, user };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Validation ───────────────────────────

interface WorkshopInput {
  title: string;
  description: string;
  category: string;
  workshop_type: string;
  price: number;
  date: string;
  start_time: string;
  end_time: string;
  venue_name: string;
  venue_address: string;
  total_slots: number;
  available_slots: number;
  is_active: boolean;
  image_urls: string[];
  long_description?: string;
  duration?: string;
  instructor?: string;
  level?: string;
  location?: string;
}

function validateWorkshop(input: WorkshopInput): string[] {
  const errors: string[] = [];

  if (!input.title.trim()) errors.push("Title is required");
  if (!input.description.trim()) errors.push("Description is required");
  if (!input.category.trim()) errors.push("Category is required");
  if (!["public", "private", "corporate"].includes(input.workshop_type))
    errors.push("Invalid workshop type");
  if (!input.price || input.price <= 0) errors.push("Price must be positive");
  if (!input.date) errors.push("Date is required");
  if (!input.start_time) errors.push("Start time is required");
  if (!input.venue_name.trim()) errors.push("Venue name is required");
  if (input.total_slots < 1) errors.push("Total slots must be at least 1");
  if (input.available_slots < 0)
    errors.push("Available slots cannot be negative");
  if (input.available_slots > input.total_slots)
    errors.push("Available slots cannot exceed total slots");

  return errors;
}

function parseFormData(formData: FormData): WorkshopInput {
  const imageUrls: string[] = [];
  const entries = Array.from(formData.entries());
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    if (key.startsWith("image_url_") && typeof value === "string" && value.trim()) {
      imageUrls.push(value.trim());
    }
  }

  return {
    title: (formData.get("title") as string) || "",
    description: (formData.get("description") as string) || "",
    long_description: (formData.get("long_description") as string) || "",
    category: (formData.get("category") as string) || "",
    workshop_type: (formData.get("workshop_type") as string) || "public",
    price: parseInt((formData.get("price") as string) || "0", 10),
    date: (formData.get("date") as string) || "",
    start_time: (formData.get("start_time") as string) || "",
    end_time: (formData.get("end_time") as string) || "",
    venue_name: (formData.get("venue_name") as string) || "",
    venue_address: (formData.get("venue_address") as string) || "",
    total_slots: parseInt((formData.get("total_slots") as string) || "20", 10),
    available_slots: parseInt(
      (formData.get("available_slots") as string) || (formData.get("total_slots") as string) || "20",
      10
    ),
    is_active: formData.get("is_active") === "true",
    duration: (formData.get("duration") as string) || "",
    instructor: (formData.get("instructor") as string) || "",
    level: (formData.get("level") as string) || "Beginner Friendly",
    location: (formData.get("location") as string) || "",
    image_urls: imageUrls,
  };
}

// ── CREATE ────────────────────────────────

export async function createWorkshop(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { supabase } = await verifyAdmin();
    const input = parseFormData(formData);
    const errors = validateWorkshop(input);

    if (errors.length > 0) {
      return { error: errors.join(". ") };
    }

    const slug = generateSlug(input.title);

    const { data: workshop, error: insertError } = await supabase
      .from("workshops")
      .insert({
        title: input.title,
        description: input.description,
        long_description: input.long_description || null,
        category: input.category,
        slug,
        workshop_type: input.workshop_type,
        price: input.price,
        date: input.date,
        start_time: input.start_time,
        end_time: input.end_time || null,
        duration: input.duration || null,
        venue_name: input.venue_name,
        venue_address: input.venue_address || null,
        location: input.location || null,
        instructor: input.instructor || null,
        level: input.level || "Beginner Friendly",
        total_slots: input.total_slots,
        available_slots: input.available_slots,
        is_active: input.is_active,
        image: input.image_urls[0] || null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Workshop insert error:", insertError);
      return { error: `Failed to create workshop: ${insertError.message}` };
    }

    // Insert workshop images
    if (input.image_urls.length > 0 && workshop) {
      const imageRows = input.image_urls.map((url, i) => ({
        workshop_id: workshop.id,
        image_url: url,
        sort_order: i,
      }));

      const { error: imgError } = await supabase
        .from("workshop_images")
        .insert(imageRows);

      if (imgError) {
        console.error("Workshop images insert error:", imgError);
      }
    }

    revalidatePath("/workshops");
    revalidatePath("/admin/workshops");
    revalidatePath("/");
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }

  redirect("/admin/workshops");
}

// ── UPDATE ────────────────────────────────

export async function updateWorkshop(
  workshopId: string,
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { supabase } = await verifyAdmin();
    const input = parseFormData(formData);
    const errors = validateWorkshop(input);

    if (errors.length > 0) {
      return { error: errors.join(". ") };
    }

    const { error: updateError } = await supabase
      .from("workshops")
      .update({
        title: input.title,
        description: input.description,
        long_description: input.long_description || null,
        category: input.category,
        workshop_type: input.workshop_type,
        price: input.price,
        date: input.date,
        start_time: input.start_time,
        end_time: input.end_time || null,
        duration: input.duration || null,
        venue_name: input.venue_name,
        venue_address: input.venue_address || null,
        location: input.location || null,
        instructor: input.instructor || null,
        level: input.level || "Beginner Friendly",
        total_slots: input.total_slots,
        available_slots: input.available_slots,
        is_active: input.is_active,
        image: input.image_urls[0] || null,
      })
      .eq("id", workshopId);

    if (updateError) {
      console.error("Workshop update error:", updateError);
      return { error: `Failed to update workshop: ${updateError.message}` };
    }

    // Replace all images: delete old, insert new
    await supabase
      .from("workshop_images")
      .delete()
      .eq("workshop_id", workshopId);

    if (input.image_urls.length > 0) {
      const imageRows = input.image_urls.map((url, i) => ({
        workshop_id: workshopId,
        image_url: url,
        sort_order: i,
      }));

      const { error: imgError } = await supabase
        .from("workshop_images")
        .insert(imageRows);

      if (imgError) {
        console.error("Workshop images update error:", imgError);
      }
    }

    revalidatePath("/workshops");
    revalidatePath("/admin/workshops");
    revalidatePath("/");
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }

  redirect("/admin/workshops");
}

// ── DELETE (soft) ─────────────────────────

export async function deleteWorkshop(
  workshopId: string
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { supabase } = await verifyAdmin();

    // Check for existing bookings
    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("workshop_id", workshopId)
      .eq("status", "CONFIRMED");

    if (count && count > 0) {
      // Soft-delete only: deactivate workshop, preserve booking data
      const { error } = await supabase
        .from("workshops")
        .update({ is_active: false })
        .eq("id", workshopId);

      if (error) {
        return { error: `Failed to deactivate workshop: ${error.message}` };
      }
    } else {
      // No bookings: safe to hard delete
      await supabase
        .from("workshop_images")
        .delete()
        .eq("workshop_id", workshopId);

      const { error } = await supabase
        .from("workshops")
        .delete()
        .eq("id", workshopId);

      if (error) {
        return { error: `Failed to delete workshop: ${error.message}` };
      }
    }

    revalidatePath("/workshops");
    revalidatePath("/admin/workshops");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }
}
