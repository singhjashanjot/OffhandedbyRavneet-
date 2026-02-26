"use client";

/* ========================================
   WORKSHOP ACTIONS — Delete with confirm
======================================== */

import { deleteWorkshop } from "@/lib/actions/admin-workshops";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

export function WorkshopActions({ workshopId }: { workshopId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteWorkshop(workshopId);
      if (result.error) {
        setError(result.error);
        setShowConfirm(false);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/workshops/${workshopId}/edit`}
        className="px-3 py-1.5 text-xs font-medium text-[#1B3022] bg-[#1B3022]/5 hover:bg-[#1B3022]/10 rounded-lg transition-colors"
      >
        Edit
      </Link>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          Delete
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "…" : "Confirm"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <span className="text-xs text-red-600 ml-2">{error}</span>
      )}
    </div>
  );
}
