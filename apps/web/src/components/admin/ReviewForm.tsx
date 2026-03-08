"use client";

/* ========================================
   REVIEW FORM — Client Component
   Used for both Create and Edit modes
======================================== */

import { useFormState, useFormStatus } from "react-dom";
import {
  createVideoReview,
  updateVideoReview,
  type ReviewActionState,
} from "@/lib/actions/admin-reviews";
import { useState } from "react";
import Link from "next/link";

interface ReviewData {
  id: string;
  author_name: string;
  workshop_type?: string;
  video_url?: string;
  comment?: string;
  rating: number;
  is_approved: boolean;
  featured: boolean;
}

interface ReviewFormProps {
  mode: "create" | "edit";
  review?: ReviewData;
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 rounded-xl bg-offhanded-deep text-white font-medium text-sm transition-all hover:bg-offhanded-deep/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending
        ? mode === "create"
          ? "Creating…"
          : "Saving…"
        : mode === "create"
        ? "Add Review"
        : "Save Changes"}
    </button>
  );
}

export default function ReviewForm({ mode, review }: ReviewFormProps) {
  const action = mode === "create" ? createVideoReview : updateVideoReview;
  const [state, formAction] = useFormState<ReviewActionState, FormData>(action, {});
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [isApproved, setIsApproved] = useState(review?.is_approved ?? true);
  const [isFeatured, setIsFeatured] = useState(review?.featured ?? true);

  return (
    <form action={formAction} className="space-y-8 max-w-2xl">
      {/* Hidden ID for edit mode */}
      {mode === "edit" && review && (
        <input type="hidden" name="id" value={review.id} />
      )}

      {/* Error banner */}
      {state.error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Author Name */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Author Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="author_name"
          required
          defaultValue={review?.author_name ?? ""}
          placeholder="e.g. Priya Sharma"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-offhanded-deep focus:ring-1 focus:ring-offhanded-deep/20 outline-none transition-all"
        />
      </div>

      {/* Workshop Type */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Workshop Type
        </label>
        <input
          type="text"
          name="workshop_type"
          defaultValue={review?.workshop_type ?? ""}
          placeholder="e.g. Pottery Texture Art, Canvas Art, Resin Art"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-offhanded-deep focus:ring-1 focus:ring-offhanded-deep/20 outline-none transition-all"
        />
        <p className="mt-1.5 text-xs text-neutral-400">
          Type of workshop the reviewer attended
        </p>
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Video URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          name="video_url"
          required
          defaultValue={review?.video_url ?? ""}
          placeholder="https://example.com/video.mp4"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-offhanded-deep focus:ring-1 focus:ring-offhanded-deep/20 outline-none transition-all"
        />
        <p className="mt-1.5 text-xs text-neutral-400">
          Direct link to video file (.mp4) — supports Pexels, Supabase storage, and other CDNs
        </p>
      </div>

      {/* Comment / Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Comment / Description
        </label>
        <textarea
          name="comment"
          rows={3}
          defaultValue={review?.comment ?? ""}
          placeholder="What the reviewer said about the workshop…"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-offhanded-deep focus:ring-1 focus:ring-offhanded-deep/20 outline-none transition-all resize-none"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Rating
        </label>
        <input type="hidden" name="rating" value={rating} />
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-colors ${
                star <= rating ? "text-amber-400" : "text-neutral-200"
              } hover:text-amber-300`}
            >
              ★
            </button>
          ))}
          <span className="ml-3 text-sm text-neutral-500">{rating}/5</span>
        </div>
      </div>

      {/* Toggles row */}
      <div className="flex flex-wrap gap-6">
        {/* Approved toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="hidden" name="is_approved" value="false" />
          <input
            type="checkbox"
            name="is_approved"
            value="true"
            checked={isApproved}
            onChange={(e) => setIsApproved(e.target.checked)}
            className="w-5 h-5 rounded border-neutral-300 text-offhanded-deep focus:ring-offhanded-deep/20"
          />
          <div>
            <span className="text-sm font-medium text-neutral-700">Approved</span>
            <p className="text-xs text-neutral-400">Show on website</p>
          </div>
        </label>

        {/* Featured toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="hidden" name="featured" value="false" />
          <input
            type="checkbox"
            name="featured"
            value="true"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-5 h-5 rounded border-neutral-300 text-offhanded-deep focus:ring-offhanded-deep/20"
          />
          <div>
            <span className="text-sm font-medium text-neutral-700">Featured</span>
            <p className="text-xs text-neutral-400">Show in homepage marquee</p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <SubmitButton mode={mode} />
        <Link
          href="/admin/reviews"
          className="px-6 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-all"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
