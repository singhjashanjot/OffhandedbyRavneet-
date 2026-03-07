"use server";

/* ========================================
   ADMIN VIDEO REVIEW SERVER ACTIONS
   Create, Update, Delete video reviews
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

// ── Types ────────────────────────────────

export type ReviewActionState = {
  error?: string;
  success?: boolean;
};

// ── Create Review ────────────────────────

export async function createVideoReview(
  _prev: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  try {
    const { supabase, user } = await verifyAdmin();

    const author_name = formData.get("author_name") as string;
    const workshop_type = formData.get("workshop_type") as string;
    const video_url = formData.get("video_url") as string;
    const comment = formData.get("comment") as string;
    const rating = parseInt(formData.get("rating") as string) || 5;
    const is_approved = formData.getAll("is_approved").includes("true");
    const featured = formData.getAll("featured").includes("true");

    // Validation
    if (!author_name?.trim()) {
      return { error: "Author name is required" };
    }
    if (!video_url?.trim()) {
      return { error: "Video URL is required" };
    }

    const insertData: Record<string, any> = {
      author_name: author_name.trim(),
      workshop_type: workshop_type?.trim() || "Art Workshop",
      video_url: video_url.trim(),
      comment: comment?.trim() || null,
      rating,
      is_approved,
      featured,
      user_id: user.id,
    };

    const { error } = await supabase.from("reviews").insert(insertData);

    if (error) {
      console.error("Error creating review:", error);
      // If video_url column doesn't exist, try without it
      if (error.message?.includes("video_url")) {
        const { video_url: _, ...withoutVideo } = insertData;
        const { error: retryError } = await supabase
          .from("reviews")
          .insert(withoutVideo);
        if (retryError) {
          return { error: retryError.message };
        }
      } else {
        return { error: error.message };
      }
    }
  } catch (err: any) {
    return { error: err.message || "Failed to create review" };
  }

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

// ── Update Review ────────────────────────

export async function updateVideoReview(
  _prev: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  try {
    const { supabase } = await verifyAdmin();

    const id = formData.get("id") as string;
    const author_name = formData.get("author_name") as string;
    const workshop_type = formData.get("workshop_type") as string;
    const video_url = formData.get("video_url") as string;
    const comment = formData.get("comment") as string;
    const rating = parseInt(formData.get("rating") as string) || 5;
    const is_approved = formData.getAll("is_approved").includes("true");
    const featured = formData.getAll("featured").includes("true");

    if (!id) return { error: "Review ID is required" };
    if (!author_name?.trim()) return { error: "Author name is required" };

    const updateData: Record<string, any> = {
      author_name: author_name.trim(),
      workshop_type: workshop_type?.trim() || "Art Workshop",
      comment: comment?.trim() || null,
      rating,
      is_approved,
      featured,
    };

    if (video_url?.trim()) {
      updateData.video_url = video_url.trim();
    }

    const { error } = await supabase
      .from("reviews")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating review:", error);
      // If video_url column doesn't exist, try without it
      if (error.message?.includes("video_url")) {
        const { video_url: _, ...withoutVideo } = updateData;
        const { error: retryError } = await supabase
          .from("reviews")
          .update(withoutVideo)
          .eq("id", id);
        if (retryError) return { error: retryError.message };
      } else {
        return { error: error.message };
      }
    }
  } catch (err: any) {
    return { error: err.message || "Failed to update review" };
  }

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

// ── Toggle Approval ──────────────────────

export async function toggleReviewApproval(id: string, currentStatus: boolean) {
  try {
    const { supabase } = await verifyAdmin();

    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling approval:", error);
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

// ── Toggle Featured ──────────────────────

export async function toggleReviewFeatured(id: string, currentStatus: boolean) {
  try {
    const { supabase } = await verifyAdmin();

    const { error } = await supabase
      .from("reviews")
      .update({ featured: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling featured:", error);
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

// ── Delete Review ────────────────────────

export async function deleteReview(id: string) {
  try {
    const { supabase } = await verifyAdmin();

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      console.error("Error deleting review:", error);
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
