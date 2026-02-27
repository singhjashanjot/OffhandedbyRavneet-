import { getAdminStats } from "@/lib/queries/admin";
import type { Metadata } from "next";

/* ========================================
   ADMIN DASHBOARD
   Overview metrics and quick stats
======================================== */

export const metadata: Metadata = {
  title: "Admin Dashboard | Offhanded",
};

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    {
      label: "Total Workshops",
      value: stats.totalWorkshops,
      icon: "🎨",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Confirmed Bookings",
      value: stats.totalBookings,
      icon: "📋",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      label: "Registered Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: "💰",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Overview of your platform activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border p-6 ${card.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm mt-1 opacity-70">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <h2 className="text-lg font-medium text-neutral-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/workshops" className="p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition text-center">
            <span className="text-2xl block mb-2">🎨</span>
            <span className="text-sm font-medium text-neutral-700">Manage Workshops</span>
          </a>
          <a href="/admin/bookings" className="p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition text-center">
            <span className="text-2xl block mb-2">📋</span>
            <span className="text-sm font-medium text-neutral-700">View Bookings</span>
          </a>
          <a href="/admin/reviews" className="p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition text-center">
            <span className="text-2xl block mb-2">⭐</span>
            <span className="text-sm font-medium text-neutral-700">Moderate Reviews</span>
          </a>
          <a href="/admin/users" className="p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition text-center">
            <span className="text-2xl block mb-2">👥</span>
            <span className="text-sm font-medium text-neutral-700">View Users</span>
          </a>
        </div>
      </div>
    </div>
  );
}
