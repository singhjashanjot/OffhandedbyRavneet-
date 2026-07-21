
"use client";

/* ========================================
   WORKSHOP FORM — Client Component
   Used for both Create and Edit modes
======================================== */

import { useFormState, useFormStatus } from "react-dom";
import { createWorkshop, updateWorkshop } from "@/lib/actions/admin-workshops";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { uploadWorkshopImage } from "@/lib/storage";

interface WhatToExpectItem {
  icon: string;
  title: string;
  description: string;
}

interface WorkshopData {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  workshop_type: string;
  price: number;
  price_for_two?: number;
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
  card_image?: string;
  coupon_code?: string;
  coupon_discount_percent?: number;
  what_to_expect?: WhatToExpectItem[];
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

/** Properly handles the hidden+checkbox pattern for is_active */
function IsActiveToggle({ defaultChecked }: { defaultChecked: boolean }) {
  const hiddenRef = useRef<HTMLInputElement>(null);

  // Disable the hidden "false" field on mount when checkbox starts checked
  useEffect(() => {
    if (defaultChecked && hiddenRef.current) {
      hiddenRef.current.disabled = true;
    }
  }, [defaultChecked]);

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        ref={hiddenRef}
        type="hidden"
        name="is_active"
        value="false"
      />
      <input
        type="checkbox"
        name="is_active"
        value="true"
        defaultChecked={defaultChecked}
        className="w-5 h-5 rounded border-neutral-300 text-[#1B3022] focus:ring-[#1B3022]"
        onChange={(e) => {
          if (hiddenRef.current) {
            hiddenRef.current.disabled = e.target.checked;
          }
        }}
      />
      <span className="text-sm font-medium text-neutral-700">
        Active (visible to public)
      </span>
    </label>
  );
}

function TimeInput12h({
  label,
  name,
  defaultValue,
  required = false
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const initial = (() => {
    if (!defaultValue) return { hour: "", minute: "", ampm: "PM" };
    const parts = defaultValue.split(":");
    const h = parseInt(parts[0] || "0", 10);
    const m = parts[1] || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return { hour: String(displayH), minute: m.slice(0, 2), ampm };
  })();

  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [ampm, setAmpm] = useState(initial.ampm);
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    if (!hour && !minute) {
      setValue("");
      return;
    }
    const h = hour || "12";
    const m = minute || "00";
    let hNum = parseInt(h, 10);
    if (isNaN(hNum)) hNum = 12;
    if (hNum < 1) hNum = 1;
    if (hNum > 12) hNum = 12;

    if (ampm === "PM" && hNum < 12) hNum += 12;
    if (ampm === "AM" && hNum === 12) hNum = 0;

    const hStr = String(hNum).padStart(2, "0");
    const mStr = String(parseInt(m, 10) || 0).padStart(2, "0");
    setValue(`${hStr}:${mStr}`);
  }, [hour, minute, ampm]);

  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">{label}</label>
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={1}
          max={12}
          placeholder="HH"
          value={hour}
          required={required}
          onChange={(e) => setHour(e.target.value)}
          className="w-16 px-3 py-2 border border-neutral-200 rounded-xl text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3022]/20 focus:border-[#1B3022] bg-white text-neutral-800"
        />
        <span className="text-neutral-400 font-bold">:</span>
        <input
          type="number"
          min={0}
          max={59}
          placeholder="MM"
          value={minute}
          required={required}
          onChange={(e) => {
            let val = e.target.value;
            if (val.length > 2) val = val.slice(0, 2);
            setMinute(val);
          }}
          className="w-16 px-3 py-2 border border-neutral-200 rounded-xl text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3022]/20 focus:border-[#1B3022] bg-white text-neutral-800"
        />
        <select
          value={ampm}
          onChange={(e) => setAmpm(e.target.value)}
          className="px-3 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3022]/20 focus:border-[#1B3022] bg-white text-neutral-800 cursor-pointer"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

const ICON_OPTIONS = [
  { value: "leaf",       label: "🌿 Mindfulness / Nature" },
  { value: "scissors",   label: "✂️ Materials / Craft" },
  { value: "coffee",     label: "☕ Refreshments" },
  { value: "group",      label: "👥 Small Group" },
  { value: "star",       label: "⭐ Highlight" },
  { value: "palette",    label: "🎨 Art / Painting" },
  { value: "camera",     label: "📸 Photography" },
  { value: "music",      label: "🎵 Music" },
  { value: "book",       label: "📚 Learning" },
  { value: "heart",      label: "❤️ Wellness" },
  { value: "gift",       label: "🎁 Takeaway / Gift" },
  { value: "award",      label: "🏆 Certificate" },
  { value: "clock",      label: "🕐 Time" },
  { value: "map",        label: "📍 Location" },
];

const DEFAULT_EXPECT_ITEMS: WhatToExpectItem[] = [
  { icon: "leaf",      title: "Mindfulness Focus",  description: "Guided breathing & centering techniques." },
  { icon: "scissors",  title: "All Materials",      description: "Tools, materials, and supplies included." },
  { icon: "coffee",    title: "Refreshments",       description: "Herbal tea and light organic snacks." },
  { icon: "group",     title: "Small Group",        description: "Limited seats for personal attention." },
];

export default function WorkshopForm({ mode, workshop }: WorkshopFormProps) {
  // Build bound action for edit mode
  const boundUpdate = workshop
    ? updateWorkshop.bind(null, workshop.id)
    : createWorkshop;

  const action = mode === "edit" ? boundUpdate : createWorkshop;
  const [state, formAction] = useFormState(action, null);

  const [imageUrl, setImageUrl] = useState<string>(workshop?.image || "");
  const [cardImageUrl, setCardImageUrl] = useState<string>(workshop?.card_image || "");
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [uploadingCardImage, setUploadingCardImage] = useState<boolean>(false);

  const [expectItems, setExpectItems] = useState<WhatToExpectItem[]>(
    workshop?.what_to_expect && workshop.what_to_expect.length === 4
      ? workshop.what_to_expect
      : DEFAULT_EXPECT_ITEMS
  );

  const updateExpectItem = (index: number, field: keyof WhatToExpectItem, value: string) => {
    setExpectItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isCard: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isCard) setUploadingCardImage(true);
    else setUploadingImage(true);
    
    try {
      const folderId = workshop?.id || `new-workshop-${Date.now()}`;
      const { url, error } = await uploadWorkshopImage(folderId, file);
      if (error) {
        alert("Upload failed: " + error);
      } else if (url) {
        if (isCard) setCardImageUrl(url);
        else setImageUrl(url);
      }
    } catch (err: any) {
      alert("Error uploading file: " + err.message);
    } finally {
      if (isCard) setUploadingCardImage(false);
      else setUploadingImage(false);
    }
  };

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

          <TimeInput12h
            label="Start Time *"
            name="start_time"
            required
            defaultValue={workshop?.start_time}
          />

          <TimeInput12h
            label="End Time"
            name="end_time"
            defaultValue={workshop?.end_time || ""}
          />

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
            <label className={labelClass}>Price for 1 (₹) *</label>
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

          <div>
            <label className={labelClass}>Price for 2 (₹)</label>
            <input
              name="price_for_two"
              type="number"
              min={1}
              defaultValue={workshop?.price_for_two}
              placeholder="2799 (Discounted)"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ── Promotions & Coupons ─────────── */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <h2 className="text-lg font-serif text-neutral-900 border-b border-neutral-100 pb-3">
          Promotions & Coupons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Coupon Code</label>
            <input
              name="coupon_code"
              type="text"
              defaultValue={workshop?.coupon_code || ""}
              placeholder="e.g. ARTSTART20"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Discount Percent (%)</label>
            <input
              name="coupon_discount_percent"
              type="number"
              min={0}
              max={100}
              step="0.01"
              defaultValue={workshop?.coupon_discount_percent ?? ""}
              placeholder="e.g. 20 or 99.99"
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
            <IsActiveToggle defaultChecked={workshop?.is_active ?? true} />
          </div>
        </div>
      </section>

      {/* ── Images ─────────────────────── */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <h2 className="text-lg font-serif text-neutral-900 border-b border-neutral-100 pb-3">Images</h2>

        <div className="space-y-6">
          {/* Main Cover Image */}
          <div className="flex flex-col md:flex-row gap-4 items-start p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
            <div className="flex-1 w-full space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Picture for Home Page & Workshop Detail Page
                </label>
                <input
                  name="image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">Or</span>
                <label className="relative cursor-pointer px-3 py-1.5 bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-semibold text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploadingImage ? "Uploading..." : "Upload from Device"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(e) => handleImageChange(e, false)}
                  />
                </label>
              </div>
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Main Preview"
                className="w-24 h-24 rounded-lg object-cover border border-neutral-200 bg-white"
              />
            )}
          </div>

          {/* Card Image */}
          <div className="flex flex-col md:flex-row gap-4 items-start p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
            <div className="flex-1 w-full space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Picture for Workshop Page (Cards)
                </label>
                <input
                  name="card_image"
                  type="url"
                  value={cardImageUrl}
                  onChange={(e) => setCardImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">Or</span>
                <label className="relative cursor-pointer px-3 py-1.5 bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-semibold text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploadingCardImage ? "Uploading..." : "Upload from Device"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingCardImage}
                    onChange={(e) => handleImageChange(e, true)}
                  />
                </label>
              </div>
            </div>
            {cardImageUrl && (
              <img
                src={cardImageUrl}
                alt="Card Preview"
                className="w-24 h-24 rounded-lg object-cover border border-neutral-200 bg-white"
              />
            )}
          </div>
        </div>
      </section>

      {/* ── What to Expect ─────────────── */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <div className="border-b border-neutral-100 pb-3">
          <h2 className="text-lg font-serif text-neutral-900">What to Expect</h2>
          <p className="text-xs text-neutral-500 mt-1">These 4 highlights are shown on the workshop detail page. Customise each item's icon, title, and description.</p>
        </div>

        {/* Hidden JSON field */}
        <input type="hidden" name="what_to_expect" value={JSON.stringify(expectItems)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {expectItems.map((item, idx) => (
            <div key={idx} className="border border-neutral-100 rounded-xl p-4 bg-neutral-50/40 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Item {idx + 1}</span>
              </div>

              {/* Icon picker */}
              <div>
                <label className={labelClass}>Icon</label>
                <select
                  value={item.icon}
                  onChange={(e) => updateExpectItem(idx, "icon", e.target.value)}
                  className={inputClass}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateExpectItem(idx, "title", e.target.value)}
                  placeholder="e.g. All Materials Included"
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateExpectItem(idx, "description", e.target.value)}
                  placeholder="e.g. Tools, materials, and supplies included."
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
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
