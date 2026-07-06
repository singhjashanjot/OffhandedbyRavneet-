"use client";

import React, { useState } from "react";
import { deleteProduct, toggleProductStatus } from "@/lib/actions/admin-products";
import Link from "next/link";

export function ProductActions({ 
  productId, 
  isActive 
}: { 
  productId: string,
  isActive: boolean 
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsDeleting(true);
      const res = await deleteProduct(productId);
      setIsDeleting(false);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    const res = await toggleProductStatus(productId, isActive);
    setIsToggling(false);
    if (!res.success) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={handleToggle}
        disabled={isToggling || isDeleting}
        className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-50"
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>
      <Link
        href={`/admin/products/${productId}/edit`}
        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting || isToggling}
        className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
