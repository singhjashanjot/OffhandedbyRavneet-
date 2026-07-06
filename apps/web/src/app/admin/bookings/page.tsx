import { getAdminBookings } from "@/lib/queries/admin";
import { formatPrice, formatDate } from "@/data/workshops";
import type { Metadata } from "next";

/* ========================================
   ADMIN — BOOKINGS MANAGEMENT
   Shows all customer details per booking
======================================== */

export const metadata: Metadata = {
  title: "Bookings | Offhanded Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  const confirmed = bookings.filter((b: any) => b.status === "CONFIRMED").length;
  const cancelled = bookings.filter((b: any) => b.status === "CANCELLED").length;
  const pending = bookings.length - confirmed - cancelled;

  return (
    <div>
      {/* Header + Stats */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-light text-neutral-900">
            Bookings
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {bookings.length} total bookings
          </p>
        </div>
        <div className="flex gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
            {confirmed} Confirmed
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            {pending} Pending
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
            {cancelled} Cancelled
          </span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <p className="text-neutral-400">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-soft transition-shadow"
            >
              {/* Top row: status badge + booking date */}
              <div className="flex items-center justify-between px-6 py-3 bg-neutral-50 border-b border-neutral-100">
                <div className="flex items-center gap-3">
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
                  <span className="text-xs text-neutral-400">
                    Booking ID: {booking.id.slice(0, 8)}...
                  </span>
                </div>
                <span className="text-xs text-neutral-400">
                  {new Date(booking.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="px-6 py-5">
                {/* Customer Details */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left: Customer info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">
                      {booking.attendee_name || "—"}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                      <DetailRow label="Email" value={booking.attendee_email} />
                      <DetailRow
                        label="Phone"
                        value={booking.attendee_phone}
                      />
                      <DetailRow
                        label="Tickets"
                        value={`${booking.tickets} ticket${booking.tickets > 1 ? "s" : ""}`}
                      />
                      <DetailRow
                        label="Amount Paid"
                        value={
                          booking.payments?.amount
                            ? formatPrice(booking.payments.amount)
                            : "—"
                        }
                      />
                      <DetailRow
                        label="Payment Status"
                        value={booking.payments?.status || "—"}
                      />
                      <DetailRow
                        label="Payment Mode"
                        value={booking.payments?.provider_payment_id ? `Razorpay (Netbanking/UPI)` : "—"}
                      />
                      <DetailRow
                        label="Payment ID"
                        value={booking.payments?.provider_payment_id || "—"}
                      />
                      <DetailRow
                        label="Remarks / Info"
                        value={booking.remarks || booking.special_requests || booking.notes || booking.attendee_notes}
                        fallback="No remarks provided by user"
                      />
                      <DetailRow
                        label="Age / Age Group"
                        value={booking.age || booking.age_group}
                        fallback="Not provided"
                      />
                    </div>
                  </div>

                  {/* Right: Workshop info */}
                  <div className="lg:w-72 flex-shrink-0 bg-neutral-50 rounded-xl p-4">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-2">
                      Workshop
                    </p>
                    <p className="font-medium text-neutral-900 text-sm">
                      {booking.workshops?.title || "—"}
                    </p>
                    <div className="mt-3 space-y-1.5 text-xs text-neutral-500">
                      {booking.workshops?.date && (
                        <p>
                          <span className="text-neutral-400">Date: </span>
                          {formatDate(booking.workshops.date)}
                        </p>
                      )}
                      {booking.workshops?.start_time && (
                        <p>
                          <span className="text-neutral-400">Time: </span>
                          {booking.workshops.start_time}
                        </p>
                      )}
                      {booking.workshops?.venue_name && (
                        <p>
                          <span className="text-neutral-400">Venue: </span>
                          {booking.workshops.venue_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  fallback = "—",
}: {
  label: string;
  value?: string | number | null;
  fallback?: string;
}) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="text-neutral-400 shrink-0 w-28">{label}</span>
      <span className="text-neutral-700 truncate">
        {value || fallback}
      </span>
    </div>
  );
}
