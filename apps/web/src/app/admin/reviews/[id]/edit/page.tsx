import ReviewForm from "@/components/admin/ReviewForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ========================================
   ADMIN — EDIT VIDEO REVIEW
======================================== */

export const metadata: Metadata = {
  title: "Edit Review | Offhanded Admin",
};

export const dynamic = "force-dynamic";

async function getReview(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function EditReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const review = await getReview(params.id);

  if (!review) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Edit Review</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Update review details
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <ReviewForm
          mode="edit"
          review={{
            id: review.id,
            author_name: review.author_name || review.reviewer_name || "",
            workshop_type: review.workshop_type || review.event_type || "",
            video_url: review.video_url || "",
            comment: review.comment || "",
            rating: review.rating || 5,
            is_approved: review.is_approved ?? false,
            featured: review.featured ?? false,
          }}
        />
      </div>
    </div>
  );
}
