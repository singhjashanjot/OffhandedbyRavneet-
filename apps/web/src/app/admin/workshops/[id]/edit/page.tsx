import WorkshopForm from "@/components/admin/WorkshopForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ========================================
   ADMIN — EDIT WORKSHOP
======================================== */

export const metadata: Metadata = {
  title: "Edit Workshop | Offhanded Admin",
};

export default async function EditWorkshopPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: workshop, error } = await supabase
    .from("workshops")
    .select("*, workshop_images(image_url, sort_order)")
    .eq("id", params.id)
    .single();

  if (error || !workshop) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Edit Workshop</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Editing: <span className="font-medium text-neutral-700">{workshop.title}</span>
        </p>
      </div>

      <WorkshopForm mode="edit" workshop={workshop} />
    </div>
  );
}
