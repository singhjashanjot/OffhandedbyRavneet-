"use client";

import React, { useState } from "react";
import { createProduct, updateProduct } from "@/lib/actions/admin-products";
import { useRouter } from "next/navigation";

export function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    // Explicitly add checkbox value if not checked
    if (!formData.has("is_active")) {
      formData.append("is_active", "false");
    }

    const res = product 
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    setIsSubmitting(false);

    if (res.success) {
      router.push("/admin/products");
    } else {
      setError(res.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 p-8 max-w-2xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            defaultValue={product?.name || ""}
            required
            className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3022] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
          <textarea
            name="description"
            defaultValue={product?.description || ""}
            rows={4}
            className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3022] focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Price (₹) *</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              defaultValue={product?.price || ""}
              required
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3022] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Stock Quantity *</label>
            <input
              type="number"
              name="stock_quantity"
              min="0"
              defaultValue={product?.stock_quantity ?? 0}
              required
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3022] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Category *</label>
          <input
            type="text"
            name="category"
            defaultValue={product?.category || "Art Supplies"}
            required
            className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3022] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Image URL</label>
          <input
            type="url"
            name="image"
            defaultValue={product?.image || ""}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3022] focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={product ? product.is_active : true}
            className="w-5 h-5 text-[#1B3022] rounded border-neutral-300 focus:ring-[#1B3022]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-neutral-700">
            Active (Visible on website)
          </label>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#1B3022] text-white rounded-xl text-sm font-medium hover:bg-[#2a4a35] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
