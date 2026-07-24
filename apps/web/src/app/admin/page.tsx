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
      color: "bg-white text-primary border-brand-200 shadow-soft",
    },
    {
      label: "Confirmed Bookings",
      value: stats.totalBookings,
      icon: "📋",
      color: "bg-white text-primary border-brand-200 shadow-soft",
    },
    {
      label: "Registered Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-white text-primary border-brand-200 shadow-soft",
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-primary tracking-tight">Dashboard</h1>
        <p className="text-base text-brand-600 mt-2">Overview of your platform activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-soft-lg ${card.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
            </div>
            <p className="text-4xl font-display font-medium">{card.value}</p>
            <p className="text-sm font-medium mt-2 text-brand-600 uppercase tracking-wider">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-brand-200 p-8 shadow-soft">
        <h2 className="text-xl font-serif text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/workshops" className="p-6 rounded-2xl bg-brand-50 hover:bg-brand-100 transition-colors text-center border border-transparent hover:border-brand-200">
            <span className="text-3xl block mb-3">🎨</span>
            <span className="text-sm font-medium text-primary">Manage Workshops</span>
          </a>
          <a href="/admin/bookings" className="p-6 rounded-2xl bg-brand-50 hover:bg-brand-100 transition-colors text-center border border-transparent hover:border-brand-200">
            <span className="text-3xl block mb-3">📋</span>
            <span className="text-sm font-medium text-primary">View Bookings</span>
          </a>
          <a href="/admin/reviews" className="p-6 rounded-2xl bg-brand-50 hover:bg-brand-100 transition-colors text-center border border-transparent hover:border-brand-200">
            <span className="text-3xl block mb-3">⭐</span>
            <span className="text-sm font-medium text-primary">Moderate Reviews</span>
          </a>
          <a href="/admin/users" className="p-6 rounded-2xl bg-brand-50 hover:bg-brand-100 transition-colors text-center border border-transparent hover:border-brand-200">
            <span className="text-3xl block mb-3">👥</span>
            <span className="text-sm font-medium text-primary">View Users</span>
          </a>
        </div>
      </div>
    </div>
  );
}
