"use client";

import React, { useState } from "react";
import { deactivateAllWorkshops, deleteAllWorkshops, resetAllTestData } from "@/lib/actions/admin-workshops-bulk";

export function AdminWorkshopBulkActions() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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
        alert("Failed to delete workshops: " + res.error);
      } else {
        const deleted = res.deletedCount ?? 0;
        const deactivated = res.deactivatedCount ?? 0;
        const skipped = res.skippedCount ?? 0;
        alert(`Bulk action complete!\n- Deleted: ${deleted} workshops (no bookings)\n- Deactivated: ${deactivated} past workshops (had existing bookings)\n- Skipped: ${skipped} upcoming workshops (had bookings, left active)`);
      }
    }
  };

  const handleResetDatabase = async () => {
    const confirm1 = window.confirm(
      "DANGER: You are about to RESET the database! This will permanently delete:\n- ALL bookings\n- ALL payment records\n- ALL orders and order items\n- ALL workshops and workshop images\n\nThis action CANNOT be undone. Are you sure you want to proceed?"
    );
    if (!confirm1) return;

    const confirm2 = window.confirm(
      "Are you ABSOLUTELY sure? All transactional and customer booking data will be permanently wiped out."
    );
    if (!confirm2) return;

    const typedConfirmation = window.prompt(
      "To confirm this action, please type 'RESET' below:"
    );

    if (typedConfirmation !== "RESET") {
      alert("Reset cancelled. Confirmation text did not match.");
      return;
    }

    setIsResetting(true);
    const res = await resetAllTestData();
    setIsResetting(false);

    if (!res.success) {
      alert("Failed to reset database: " + res.error);
    } else {
      alert("Success! The database has been cleared and you are ready to start fresh.");
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
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
      <button
        onClick={handleResetDatabase}
        disabled={isResetting}
        className="px-4 py-2 bg-rose-600 text-white rounded-xl font-medium text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-sm"
      >
        {isResetting ? "Resetting Database..." : "Reset Database (Start Fresh)"}
      </button>
    </div>
  );
}
