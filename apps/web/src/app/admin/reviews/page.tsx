import { getAdminReviews } from "@/lib/queries/admin";
import type { Metadata } from "next";
import Link from "next/link";
import { ReviewActions } from "./ReviewActions";

/* ========================================
   ADMIN — REVIEWS MODERATION
======================================== */

export const metadata: Metadata = {
  title: "Reviews | Offhanded Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-neutral-900">Reviews</h1>
          <p className="text-sm text-neutral-500 mt-1">{reviews.length} reviews total</p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-offhanded-deep text-white text-sm font-medium hover:bg-offhanded-deep/90 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Video Review
        </Link>
      </div>

      <div className="grid gap-4">
        {reviews.map((review: any) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-neutral-200 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                {/* Video thumbnail */}
                {review.video_url && (
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <video
                      src={review.video_url}
                      muted
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                <div>
                  <p className="font-medium text-neutral-900">
                    {review.author_name || review.reviewer_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {review.workshop_type || review.event_type || "General"} •{" "}
                    {new Date(review.created_at).toLocaleDateString("en-IN")}
                  </p>
                  {review.comment && (
                    <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed line-clamp-2">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Rating Stars */}
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={i < (review.rating || 0) ? "text-amber-400" : "text-neutral-200"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {/* Status badges */}
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    review.is_approved
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {review.is_approved ? "Approved" : "Pending"}
                </span>
                {review.featured && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <ReviewActions
              id={review.id}
              isApproved={review.is_approved}
              isFeatured={review.featured}
            />
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <p className="text-neutral-400 mb-4">No reviews yet</p>
            <Link
              href="/admin/reviews/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-offhanded-deep text-white text-sm font-medium hover:bg-offhanded-deep/90 transition-all"
            >
              Add your first video review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
