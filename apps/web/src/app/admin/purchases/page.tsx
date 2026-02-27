import { getAdminPurchases } from "@/lib/queries/admin";
import { formatPrice } from "@/data/workshops";
import type { Metadata } from "next";

/* ========================================
   ADMIN — PURCHASES DASHBOARD
   All payments, bookings, and orders
======================================== */

export const metadata: Metadata = {
  title: "Purchases | Offhanded Admin",
};

export default async function AdminPurchasesPage() {
  const { payments, bookings, orders } = await getAdminPurchases();

  const totalRevenue = payments
    .filter((p: any) => p.status === "SUCCESS")
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Purchases</h1>
        <p className="text-sm text-neutral-500 mt-1">
          All payments, bookings, and product orders
        </p>
      </div>

      {/* ── Summary Cards ────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          label="Total Payments"
          value={String(payments.length)}
          icon="💳"
        />
        <SummaryCard
          label="Workshop Bookings"
          value={String(bookings.length)}
          icon="🎨"
        />
        <SummaryCard
          label="Product Orders"
          value={String(orders.length)}
          icon="📦"
        />
        <SummaryCard
          label="Revenue"
          value={formatPrice(totalRevenue)}
          icon="💰"
          highlight
        />
      </div>

      {/* ── Workshop Bookings ─────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-serif text-neutral-900 mb-4">
          Workshop Bookings
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Customer
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Workshop
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Tickets
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Amount
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {bookings.map((b: any) => (
                <tr
                  key={b.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-900">
                      {b.attendee_name || b.users_profile?.full_name || "—"}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {b.attendee_email || b.users_profile?.email || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {b.workshops?.title || "—"}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 text-center">
                    {b.tickets}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {b.payments?.amount
                      ? formatPrice(b.payments.amount)
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4 text-neutral-400 text-xs">
                    {new Date(b.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-neutral-400"
                  >
                    No workshop bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Product Orders ────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-serif text-neutral-900 mb-4">
          Product Orders
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Customer
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Items
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Total
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Payment
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((o: any) => (
                <tr
                  key={o.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-900">
                      {o.users_profile?.full_name || "—"}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {o.users_profile?.email || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {o.order_items?.map((item: any, i: number) => (
                      <div key={i} className="text-neutral-600">
                        {item.products?.name || "Product"} × {item.quantity}
                        <span className="text-neutral-400 ml-1">
                          ({formatPrice(item.price_snapshot)})
                        </span>
                      </div>
                    )) || "—"}
                  </td>
                  <td className="px-6 py-4 text-neutral-700 font-medium">
                    {formatPrice(o.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={o.payments?.status || o.status} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-4 text-neutral-400 text-xs">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-neutral-400"
                  >
                    No product orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── All Payments Log ──────────── */}
      <section>
        <h2 className="text-lg font-serif text-neutral-900 mb-4">
          Payment Log
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Customer
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Amount
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Purpose
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Provider ID
                </th>
                <th className="text-left px-6 py-4 font-medium text-neutral-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {payments.map((p: any) => (
                <tr
                  key={p.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-900">
                      {p.users_profile?.full_name || "—"}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {p.users_profile?.email || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-neutral-700 font-medium">
                    {formatPrice(p.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.purpose === "WORKSHOP"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {p.purpose}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-400 font-mono">
                    {p.provider_payment_id || p.provider_order_id || "—"}
                  </td>
                  <td className="px-6 py-4 text-neutral-400 text-xs">
                    {new Date(p.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-neutral-400"
                  >
                    No payments recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ── Helper Components ─────────────────── */

function SummaryCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "bg-[#1B3022] text-white border-[#1B3022]"
          : "bg-white border-neutral-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <p
        className={`text-2xl font-serif font-bold ${
          highlight ? "text-white" : "text-neutral-900"
        }`}
      >
        {value}
      </p>
      <p
        className={`text-xs mt-1 ${
          highlight ? "text-white/70" : "text-neutral-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUCCESS: "bg-green-50 text-green-700",
    CONFIRMED: "bg-green-50 text-green-700",
    PAID: "bg-green-50 text-green-700",
    CREATED: "bg-yellow-50 text-yellow-700",
    PENDING: "bg-yellow-50 text-yellow-700",
    FAILED: "bg-red-50 text-red-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-neutral-100 text-neutral-500"
      }`}
    >
      {status || "—"}
    </span>
  );
}
