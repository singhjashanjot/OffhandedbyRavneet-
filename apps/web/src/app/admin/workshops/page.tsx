import { getAdminWorkshops } from "@/lib/queries/admin";
import { formatPrice, formatDate } from "@/data/workshops";
import { WorkshopActions } from "@/components/admin/WorkshopActions";
import Link from "next/link";
import type { Metadata } from "next";

/* ========================================
   ADMIN — WORKSHOPS MANAGEMENT
======================================== */

export const metadata: Metadata = {
  title: "Manage Workshops | Offhanded Admin",
};

export default async function AdminWorkshopsPage() {
  const workshops = await getAdminWorkshops();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-neutral-900">Workshops</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {workshops.length} workshops total
          </p>
        </div>
        <Link
          href="/admin/workshops/new"
          className="px-5 py-2.5 bg-[#1B3022] text-white rounded-xl font-medium text-sm hover:bg-[#2a4a35] transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Workshop
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Workshop
              </th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Date
              </th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Price
              </th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Slots
              </th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Status
              </th>
              <th className="text-right px-6 py-4 font-medium text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {workshops.map((workshop: any) => (
              <tr
                key={workshop.id}
                className="hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {workshop.image && (
                      <img
                        src={workshop.image}
                        alt={workshop.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-neutral-900">
                        {workshop.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {workshop.venue_name || "No venue"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  {workshop.date ? formatDate(workshop.date) : "TBD"}
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  {formatPrice(workshop.price)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-medium ${
                      workshop.available_slots <= 5
                        ? "text-red-600"
                        : "text-neutral-700"
                    }`}
                  >
                    {workshop.available_slots} / {workshop.total_slots}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      workshop.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {workshop.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <WorkshopActions workshopId={workshop.id} />
                </td>
              </tr>
            ))}
            {workshops.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-neutral-400"
                >
                  No workshops yet.{" "}
                  <Link
                    href="/admin/workshops/new"
                    className="text-[#1B3022] underline"
                  >
                    Create your first workshop
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
