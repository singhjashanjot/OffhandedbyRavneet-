import { getAdminBookings } from "@/lib/queries/admin";
import { formatPrice, formatDate } from "@/data/workshops";
import type { Metadata } from "next";

/* ========================================
   ADMIN — BOOKINGS MANAGEMENT
======================================== */

export const metadata: Metadata = {
  title: "Bookings | Offhanded Admin",
};

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Bookings</h1>
        <p className="text-sm text-neutral-500 mt-1">Recent workshop bookings</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Attendee</th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Workshop</th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Tickets</th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Amount</th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Status</th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {bookings.map((booking: any) => (
              <tr key={booking.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-neutral-900">{booking.attendee_name}</p>
                  <p className="text-xs text-neutral-400">{booking.attendee_email}</p>
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  {booking.workshops?.title || "—"}
                </td>
                <td className="px-6 py-4 text-neutral-600 text-center">
                  {booking.tickets}
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  {booking.payments?.amount ? formatPrice(booking.payments.amount) : "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-50 text-green-700"
                        : booking.status === "CANCELLED"
                        ? "bg-red-50 text-red-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400 text-xs">
                  {new Date(booking.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                  No bookings yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
