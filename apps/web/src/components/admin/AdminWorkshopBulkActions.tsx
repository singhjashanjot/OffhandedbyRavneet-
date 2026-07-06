"use client";

import React, { useState } from "react";
import { deactivateAllWorkshops, deleteAllWorkshops } from "@/lib/actions/admin-workshops-bulk";

export function AdminWorkshopBulkActions() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivateAll = async () => {
    if (window.confirm("Are you sure you want to deactivate ALL workshops? They will no longer be visible to customers.")) {
      setIsDeactivating(true);
      const res = await deactivateAllWorkshops();
      setIsDeactivating(false);
      if (!res.success) {
        alert("Failed to deactivate: " + res.error);
      } else {
        alert("All workshops have been deactivated.");
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("WARNING: Are you absolutely sure you want to delete ALL workshops? This action CANNOT be undone and will permanently remove all workshop data!")) {
      setIsDeleting(true);
      const res = await deleteAllWorkshops();
      setIsDeleting(false);
      if (!res.success) {
        alert("Failed to delete (Note: workshops with existing bookings cannot be deleted safely): " + res.error);
      } else {
        alert("All workshops have been deleted.");
      }
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDeactivateAll}
        disabled={isDeactivating}
        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl font-medium text-sm hover:bg-amber-200 transition-colors disabled:opacity-50"
      >
        {isDeactivating ? "Deactivating..." : "Deactivate All"}
      </button>
      <button
        onClick={handleDeleteAll}
        disabled={isDeleting}
        className="px-4 py-2 bg-red-100 text-red-800 rounded-xl font-medium text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete All"}
      </button>
    </div>
  );
}
