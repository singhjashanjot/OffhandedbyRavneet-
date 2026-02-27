import WorkshopForm from "@/components/admin/WorkshopForm";
import type { Metadata } from "next";

/* ========================================
   ADMIN — CREATE WORKSHOP
======================================== */

export const metadata: Metadata = {
  title: "Add Workshop | Offhanded Admin",
};

export default function NewWorkshopPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Add Workshop</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Create a new workshop. It will appear on the public site once saved.
        </p>
      </div>

      <WorkshopForm mode="create" />
    </div>
  );
}
