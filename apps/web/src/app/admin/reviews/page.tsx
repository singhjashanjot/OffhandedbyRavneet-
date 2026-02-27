import { getAdminReviews } from "@/lib/queries/admin";
import type { Metadata } from "next";

/* ========================================
   ADMIN — REVIEWS MODERATION
======================================== */

export const metadata: Metadata = {
  title: "Reviews | Offhanded Admin",
};

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Reviews</h1>
        <p className="text-sm text-neutral-500 mt-1">{reviews.length} reviews total</p>
      </div>

      <div className="grid gap-4">
        {reviews.map((review: any) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-neutral-200 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-neutral-900">{review.reviewer_name}</p>
                <p className="text-xs text-neutral-400">
                  {review.event_type || "General"} • {new Date(review.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                {review.is_featured && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                    Featured
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400">
            No reviews yet
          </div>
        )}
      </div>
    </div>
  );
}
