"use client";

/* ========================================
   WORKSHOP FORM — Client Component
   Used for both Create and Edit modes
======================================== */

import { useFormState, useFormStatus } from "react-dom";
import { createWorkshop, updateWorkshop } from "@/lib/actions/admin-workshops";
import { useState } from "react";
import Link from "next/link";

interface WorkshopData {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  workshop_type: string;
  price: number;
  date: string;
  start_time: string;
  end_time?: string;
  duration?: string;
  venue_name: string;
  venue_address?: string;
  location?: string;
  instructor?: string;
  level?: string;
  total_slots: number;
  available_slots: number;
  is_active: boolean;
  image?: string;
  workshop_images?: { image_url: string; sort_order: number }[];
}

interface WorkshopFormProps {
  mode: "create" | "edit";
  workshop?: WorkshopData;
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-[#1B3022] text-white rounded-xl font-medium text-sm hover:bg-[#2a4a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending
        ? mode === "create"
          ? "Creating…"
          : "Saving…"
        : mode === "create"
        ? "Create Workshop"
        : "Save Changes"}
    </button>
  );
}

const CATEGORIES = [
  "pottery",
  "canvas",
  "acrylic",
  "rope",
  "textured",
  "clay-mirror",
  "cake-painting",
  "bento-cake",
  "jute-bag",
  "punch-needle",
  "resin",
  "other",
];

export default function WorkshopForm({ mode, workshop }: WorkshopFormProps) {
  // Build bound action for edit mode
  const boundUpdate = workshop
    ? updateWorkshop.bind(null, workshop.id)
    : createWorkshop;

  const action = mode === "edit" ? boundUpdate : createWorkshop;
  const [state, formAction] = useFormState(action, null);

  // Image URL management
  const initialImages =
    workshop?.workshop_images?.map((img) => img.image_url) ||
    (workshop?.image ? [workshop.image] : []);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialImages.length > 0 ? initialImages : [""]
  );

  const addImageField = () => setImageUrls((prev) => [...prev, ""]);
  const removeImageField = (index: number) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  const updateImageUrl = (index: number, value: string) =>
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));

  const inputClass =
    "w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3022]/20 focus:border-[#1B3022] transition-all bg-white";
  const labelClass = "block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider";

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* ── Basic Info ─────────────────── */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <h2 className="text-lg font-serif text-neutral-900 border-b border-neutral-100 pb-3">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Title *</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={workshop?.title}
              placeholder="e.g. Introduction to Pottery Texture Art"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Short Description *</label>
            <textarea
              name="description"
              required
              rows={2}
              defaultValue={workshop?.description}
              placeholder="Brief workshop description (shown on cards)"
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Long Description</label>
            <textarea
              name="long_description"
              rows={4}
              defaultValue={workshop?.long_description || ""}
              placeholder="Detailed workshop description (shown on detail page)"
              className={inputClass + " resize-none"}
            />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select
              name="category"
              required
              defaultValue={workshop?.category || ""}
              className={inputClass}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Workshop Type *</label>
            <select
              name="workshop_type"
              required
              defaultValue={workshop?.workshop_type || "public"}
              className={inputClass}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Instructor</label>
            <input
              name="instructor"
              type="text"
              defaultValue={workshop?.instructor || ""}
              placeholder="e.g. Aditi S."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Level</label>
            <select
              name="level"
              defaultValue={workshop?.level || "Beginner Friendly"}
              className={inputClass}
            >
              <option value="Beginner Friendly">Beginner Friendly</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Schedule & Pricing ─────────── */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <h2 className="text-lg font-serif text-neutral-900 border-b border-neutral-100 pb-3">
          Schedule & Pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Date *</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={workshop?.date}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Start Time *</label>
            <input
              name="start_time"
              type="time"
              required
              defaultValue={workshop?.start_time}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>End Time</label>
            <input
              name="end_time"
              type="time"
              defaultValue={workshop?.end_time || ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Duration</label>
            <input
              name="duration"
              type="text"
              defaultValue={workshop?.duration || ""}
              placeholder="e.g. 2.5 Hours"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Price (₹) *</label>
            <input
              name="price"
              type="number"
              required
              min={1}
              defaultValue={workshop?.price}
              placeholder="1499"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ── Venue ──────────────────────── */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <h2 className="text-lg font-serif text-neutral-900 border-b border-neutral-100 pb-3">
          Venue
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Venue Name *</label>
            <input
              name="venue_name"
              type="text"
              required
              defaultValue={workshop?.venue_name}
              placeholder="e.g. Sanskriti Kendra, Delhi"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Venue Address</label>
            <input
              name="venue_address"
              type="text"
              defaultValue={workshop?.venue_address || ""}
              placeholder="Full address"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Location / City</label>
            <input
              name="location"
              type="text"
              defaultValue={workshop?.location || ""}
              placeholder="e.g. New Delhi"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ── Slots & Status ─────────────── */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <h2 className="text-lg font-serif text-neutral-900 border-b border-neutral-100 pb-3">
          Availability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Total Slots *</label>
            <input
              name="total_slots"
              type="number"
              required
              min={1}
              defaultValue={workshop?.total_slots || 20}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Available Slots *</label>
            <input
              name="available_slots"
              type="number"
              required
              min={0}
              defaultValue={
                workshop?.available_slots ?? workshop?.total_slots ?? 20
              }
              className={inputClass}
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="hidden"
                name="is_active"
                value="false"
              />
              <input
                type="checkbox"
                name="is_active"
                value="true"
                defaultChecked={workshop?.is_active ?? true}
                className="w-5 h-5 rounded border-neutral-300 text-[#1B3022] focus:ring-[#1B3022]"
                onChange={(e) => {
                  // Update the hidden field value based on checkbox
                  const hidden = e.target.previousElementSibling as HTMLInputElement;
                  if (hidden) hidden.disabled = e.target.checked;
                }}
              />
              <span className="text-sm font-medium text-neutral-700">
                Active (visible to public)
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* ── Images ─────────────────────── */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-lg font-serif text-neutral-900">Images</h2>
          <button
            type="button"
            onClick={addImageField}
            className="text-xs px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors font-medium"
          >
            + Add Image
          </button>
        </div>

        <div className="space-y-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  name={`image_url_${index}`}
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={inputClass}
                />
              </div>
              {url && (
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              )}
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="text-red-500 hover:text-red-700 text-lg mt-2"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-400">
          The first image will be used as the main workshop image.
        </p>
      </section>

      {/* ── Actions ────────────────────── */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/admin/workshops"
          className="px-5 py-2.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          ← Cancel
        </Link>
        <SubmitButton mode={mode} />
      </div>
    </form>
  );
}
