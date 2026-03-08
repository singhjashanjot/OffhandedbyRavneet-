"use client";

/* ========================================
   REVIEW ACTIONS — Client Component
   Approve / Feature / Delete buttons for admin review list
======================================== */

import { useTransition } from "react";
import {
  toggleReviewApproval,
  toggleReviewFeatured,
  deleteReview,
} from "@/lib/actions/admin-reviews";
import Link from "next/link";

interface ReviewActionsProps {
  id: string;
  isApproved: boolean;
  isFeatured: boolean;
}

export function ReviewActions({ id, isApproved, isFeatured }: ReviewActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(() => {
      toggleReviewApproval(id, isApproved);
    });
  };

  const handleFeature = () => {
    startTransition(() => {
      toggleReviewFeatured(id, isFeatured);
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    startTransition(() => {
      deleteReview(id);
    });
  };

  return (
    <div className="flex items-center gap-2 pt-3 border-t border-neutral-100 mt-3">
      <button
        onClick={handleApprove}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
          isApproved
            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "bg-green-50 text-green-700 hover:bg-green-100"
        }`}
      >
        {isApproved ? "Unapprove" : "Approve"}
      </button>

      <button
        onClick={handleFeature}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
          isFeatured
            ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
        }`}
      >
        {isFeatured ? "Unfeature" : "Feature"}
      </button>

      <Link
        href={`/admin/reviews/${id}/edit`}
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"
      >
        Edit
      </Link>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-50 ml-auto"
      >
        Delete
      </button>
    </div>
  );
}
