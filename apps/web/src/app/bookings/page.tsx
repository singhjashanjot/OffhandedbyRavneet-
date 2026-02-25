import { Header, Footer } from "@/components";
import Link from "next/link";
import type { Metadata } from "next";
import { getUserBookings } from "@/lib/actions/bookings";
import { formatPrice, formatDate } from "@/data/workshops";

/* ========================================
   MY BOOKINGS PAGE
   Shows user's workshop bookings
   Protected route — requires authentication
======================================== */

export const metadata: Metadata = {
  title: "My Bookings | Offhanded",
  description: "View and manage your workshop bookings.",
};

export default async function BookingsPage() {
  const bookings = await getUserBookings();

  return (
    <>
      <Header />
      
      <main className="bg-neutral-50 min-h-screen pt-32 pb-24 max-w-screen-2xl mx-auto">
        <div className="container-custom max-w-4xl">
          <h1 className="text-heading-md font-display mb-8">My Bookings</h1>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-soft text-center">
              <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📋</span>
              </div>
              <h2 className="text-heading-sm font-display mb-3 text-neutral-700">No Bookings Yet</h2>
              <p className="text-neutral-500 mb-6">
                You haven&apos;t booked any workshops yet. Explore our upcoming sessions!
              </p>
              <Link href="/workshops" className="btn btn-primary">
                Browse Workshops
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Workshop Image */}
                    {booking.workshops?.image && (
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={booking.workshops.image}
                          alt={booking.workshops.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-xl text-neutral-900">
                          {booking.workshops?.title || "Workshop"}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-50 text-green-700"
                              : booking.status === "CANCELLED"
                              ? "bg-red-50 text-red-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-neutral-400 block">Date</span>
                          <span className="font-medium text-neutral-700">
                            {booking.workshops?.date
                              ? formatDate(booking.workshops.date)
                              : "TBD"}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Venue</span>
                          <span className="font-medium text-neutral-700">
                            {booking.workshops?.venue_name || "TBD"}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Tickets</span>
                          <span className="font-medium text-neutral-700">{booking.tickets}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Amount</span>
                          <span className="font-medium text-neutral-700">
                            {booking.payments?.amount
                              ? formatPrice(booking.payments.amount)
                              : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-400">
                          Booking ID: {booking.id.slice(0, 8)}...
                        </span>
                        <span className="text-xs text-neutral-400">
                          {new Date(booking.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
