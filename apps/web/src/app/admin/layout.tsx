import Link from "next/link";
import { requireAdmin } from "@/lib/queries/admin";

/* ========================================
   ADMIN LAYOUT
   Sidebar navigation + role verification
======================================== */

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Workshops", href: "/admin/workshops", icon: "🎨" },
  { name: "Bookings", href: "/admin/bookings", icon: "📋" },
  { name: "Purchases", href: "/admin/purchases", icon: "💰" },
  { name: "Reviews", href: "/admin/reviews", icon: "⭐" },
  { name: "Users", href: "/admin/users", icon: "👥" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side admin verification — redirects non-admins
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B3022] text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-serif italic tracking-tight">Offhanded</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
