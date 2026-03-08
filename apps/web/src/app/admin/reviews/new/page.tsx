import ReviewForm from "@/components/admin/ReviewForm";
import type { Metadata } from "next";

/* ========================================
   ADMIN — ADD NEW VIDEO REVIEW
======================================== */

export const metadata: Metadata = {
  title: "Add Review | Offhanded Admin",
};

export default function NewReviewPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Add Video Review</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Add a video testimonial to display on the website
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <ReviewForm mode="create" />
      </div>
    </div>
  );
}
