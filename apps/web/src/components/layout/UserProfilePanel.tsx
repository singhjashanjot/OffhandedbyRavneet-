"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getUserProfileData } from "@/lib/actions/user";
import { formatPrice } from "@/data/workshops";

interface UserProfilePanelProps {
  onSignOut: () => void;
  onClose: () => void;
  isOpen: boolean;
}

type TabType = "upcoming" | "past" | "orders" | "all";

export function UserProfilePanel({ onSignOut, onClose, isOpen }: UserProfilePanelProps) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [data, setData] = useState<any>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && !data) {
      setLoading(true);
      getUserProfileData().then((res) => {
        if (res.success) {
          setData(res);
        }
        setLoading(false);
      });
    }
  }, [isOpen, data]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setShowSignOutConfirm(false); // Reset confirmation state on close
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Process data
  const now = new Date();
  const upcomingBookings = data?.bookings?.filter((b: any) => new Date(b.workshops.date) >= now) || [];
  const pastBookings = data?.bookings?.filter((b: any) => new Date(b.workshops.date) < now) || [];
  const orders = data?.orders || [];
  
  // Combine all transactions for the "All Purchases" tab
  const allTransactions = [
    ...data?.bookings?.map((b: any) => ({
      id: b.id,
      date: new Date(b.created_at),
      type: "WORKSHOP",
      amount: b.payments?.amount || 0, // Note: backend doesn't fetch payment amount for bookings in current action, but let's assume it might or we just show "Paid"
      title: b.workshops.title,
    })) || [],
    ...orders.map((o: any) => ({
      id: o.id,
      date: new Date(o.created_at),
      type: "PRODUCT",
      amount: o.total_amount,
      title: `${o.order_items.length} Product${o.order_items.length > 1 ? 's' : ''}`,
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort newest first

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "upcoming", label: "My Upcoming Bookings", icon: "event_upcoming" },
    { id: "past", label: "Past Bookings", icon: "history" },
    { id: "orders", label: "Recent Orders (Products)", icon: "shopping_bag" },
    { id: "all", label: "My Purchases", icon: "receipt_long" },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#141514]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dashboard Modal */}
      <div 
        ref={panelRef}
        className="relative w-[900px] max-w-[95vw] h-[600px] max-h-[90vh] bg-[#F9F9E8] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in"
      >
        {/* Artistic Background SVGs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
          <svg viewBox="0 0 400 200" className="absolute -top-10 -right-20 w-1/2 text-[#B2C0AD]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M45.7,-76.3C58.8,-69.3,68.7,-55.8,77.5,-41.8C86.3,-27.8,93.9,-13.9,94.2,0.2C94.5,14.3,87.4,28.6,78.2,41.2C69,53.8,57.7,64.7,44.3,71.2C30.9,77.7,15.5,79.8,0.7,78.6C-14.1,77.5,-28.1,73,-41.5,66.1C-54.9,59.2,-67.6,49.8,-76.6,37.3C-85.6,24.8,-90.8,9.2,-89.9,-5.8C-89,-20.8,-81.9,-35.2,-72.2,-46.8C-62.5,-58.4,-50.2,-67.2,-37,-74C-23.8,-80.8,-11.9,-85.5,2.1,-89.1C16.1,-92.7,32.6,-83.3,45.7,-76.3Z" transform="translate(200 100) scale(1.2)" />
          </svg>
          <svg viewBox="0 0 400 200" className="absolute -bottom-20 -left-10 w-1/3 text-[#2D3E30] opacity-10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M41.7,-68.8C54.1,-60.5,64.2,-48.5,71.5,-34.9C78.8,-21.3,83.3,-6.1,80.7,7.8C78,21.7,68.1,34.4,56.7,44.4C45.3,54.4,32.4,61.7,18.7,66.1C5,70.5,-9.5,72,-23.4,68.7C-37.3,65.4,-50.6,57.3,-61.7,46C-72.8,34.7,-81.7,20.2,-83.4,4.7C-85.1,-10.8,-79.5,-27.3,-69.3,-40.1C-59.1,-52.9,-44.3,-62,-30.2,-69.5C-16.1,-77,-2.7,-82.9,10,-83.2C22.7,-83.5,35.4,-78.2,41.7,-68.8Z" transform="translate(100 100) scale(1.1)" />
          </svg>
        </div>

        {/* ── Close Button ── */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-neutral-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* ── Sidebar (Left) ── */}
        <div className="w-full md:w-[280px] bg-[#1B3022] text-white flex flex-col relative z-10 shrink-0">
          <div className="p-8 pb-4">
            <h2 className="font-serif text-3xl mb-1 text-[#fffff1]">
              {loading ? "Loading..." : `Hi, ${data?.user?.name.split(" ")[0]}!`}
            </h2>
            {!loading && (
              <p className="text-[#B2C0AD] text-xs font-medium">
                Member since {new Date(data?.user?.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </p>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-1 px-4 py-4 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id 
                    ? "bg-[#fffff1] text-[#1B3022]" 
                    : "text-[#B2C0AD] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 mt-auto">
            {data?.user && data.user.email === "Offhandedbyravneet@gmail.com" && (
              <Link href="/admin" onClick={onClose} className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-2 bg-[#B2C0AD]/20 text-white rounded-xl text-xs font-bold tracking-wide uppercase hover:bg-[#B2C0AD]/30 transition-colors">
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                Admin Panel
              </Link>
            )}

            {/* Sign Out Logic */}
            {!showSignOutConfirm ? (
              <button 
                onClick={() => setShowSignOutConfirm(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-white/10 text-white rounded-xl text-xs font-bold tracking-wide uppercase hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 animate-fade-in">
                <p className="text-xs text-red-200 text-center font-medium mb-3">Are you sure you want to sign out?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowSignOutConfirm(false)}
                    className="flex-1 py-2 text-xs font-semibold bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={onSignOut}
                    className="flex-1 py-2 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Content (Right) ── */}
        <div className="flex-1 relative z-10 flex flex-col bg-white/40 overflow-hidden">
          <div className="p-8 pb-4">
            <h3 className="font-serif text-2xl text-[#1B3022]">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
          </div>

          <div className="flex-1 p-8 pt-0 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-neutral-200/50 rounded-2xl w-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                
                {/* UPCOMING BOOKINGS */}
                {activeTab === "upcoming" && (
                  upcomingBookings.length > 0 ? upcomingBookings.map((b: any) => (
                    <div key={b.id} className="p-5 bg-white rounded-2xl border border-[#141514]/5 shadow-sm hover:shadow-md transition-all flex gap-5 items-center">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#B2C0AD]/20 flex-shrink-0">
                        {b.workshops.image ? (
                          <img src={b.workshops.image} alt={b.workshops.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#1B3022]">🎨</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#B2C0AD] font-bold tracking-widest uppercase mb-1">
                          {new Date(b.workshops.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })} • {b.workshops.start_time}
                        </p>
                        <h4 className="font-serif text-xl text-[#1B3022] leading-tight mb-1">{b.workshops.title}</h4>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Confirmed
                        </span>
                      </div>
                    </div>
                  )) : (
                    <EmptyState icon="calendar_month" title="No upcoming workshops" text="You haven't booked any future workshops yet. Check out our upcoming schedule!" />
                  )
                )}

                {/* PAST BOOKINGS */}
                {activeTab === "past" && (
                  pastBookings.length > 0 ? pastBookings.map((b: any) => (
                    <div key={b.id} className="p-5 bg-white/70 rounded-2xl border border-[#141514]/5 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 grayscale">
                        {b.workshops.image ? (
                          <img src={b.workshops.image} alt={b.workshops.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#B2C0AD]/30 flex items-center justify-center text-[#1B3022]">🎨</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#141514]/40 font-bold tracking-widest uppercase mb-1">
                          {new Date(b.workshops.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <h4 className="font-serif text-lg text-[#1B3022] leading-tight opacity-80">{b.workshops.title}</h4>
                      </div>
                      <a 
                        href={`mailto:hello@offhandedbyravneet.com?subject=Review for ${b.workshops.title}`}
                        className="flex-shrink-0 px-4 py-2 bg-white border border-[#1B3022]/20 text-[#1B3022] text-xs font-semibold rounded-lg hover:bg-[#1B3022] hover:text-white transition-colors"
                      >
                        Write a Review
                      </a>
                    </div>
                  )) : (
                    <EmptyState icon="history" title="No past workshops" text="Your attended workshops will appear here." />
                  )
                )}

                {/* PRODUCT ORDERS */}
                {activeTab === "orders" && (
                  orders.length > 0 ? orders.map((o: any) => (
                    <div key={o.id} className="p-5 bg-white rounded-2xl border border-[#141514]/5 shadow-sm">
                      <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-100">
                        <div>
                          <p className="text-xs text-[#141514]/40 font-bold tracking-widest uppercase mb-1">
                            {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                          <p className="text-sm font-mono text-[#1B3022]">Order #{o.id.slice(0,8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-lg font-bold text-[#1B3022]">
                            {formatPrice(o.total_amount)}
                          </span>
                          <span className="inline-flex px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#B2C0AD]/20 text-[#1B3022]">
                            {o.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        {o.order_items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm text-[#141514]/80 items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center overflow-hidden">
                                {item.products?.images?.[0] ? (
                                  <img src={item.products.images[0]} alt="Product" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-neutral-400 text-xs">📦</span>
                                )}
                              </div>
                              <span className="font-medium">{item.products?.name || "Product"}</span>
                            </div>
                            <span className="text-neutral-500 font-mono text-xs">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2">
                        <a 
                          href="mailto:hello@offhandedbyravneet.com?subject=Review for Order"
                          className="px-4 py-2 bg-white border border-[#1B3022]/20 text-[#1B3022] text-xs font-semibold rounded-lg hover:bg-[#1B3022] hover:text-white transition-colors"
                        >
                          Write a Review
                        </a>
                      </div>
                    </div>
                  )) : (
                    <EmptyState icon="shopping_bag" title="No recent orders" text="You haven't ordered any physical products yet." />
                  )
                )}

                {/* ALL TRANSACTIONS */}
                {activeTab === "all" && (
                  allTransactions.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-[#141514]/5 shadow-sm overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50/80 text-xs text-[#141514]/50 uppercase tracking-wider font-bold">
                          <tr>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Type</th>
                            <th className="px-5 py-3">Details</th>
                            <th className="px-5 py-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {allTransactions.map((tx: any) => (
                            <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                              <td className="px-5 py-4 whitespace-nowrap text-[#141514]/70">
                                {tx.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                                  tx.type === "WORKSHOP" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                                }`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-[#1B3022] font-medium">
                                {tx.title}
                              </td>
                              <td className="px-5 py-4 text-right font-mono font-bold text-[#1B3022]">
                                {tx.amount ? formatPrice(tx.amount) : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState icon="receipt_long" title="No transactions" text="You don't have any purchase history yet." />
                  )
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function EmptyState({ icon, title, text }: { icon: string, title: string, text: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/50 rounded-2xl border border-dashed border-neutral-300">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-[#B2C0AD]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 32" }}>
          {icon}
        </span>
      </div>
      <h4 className="font-serif text-xl text-[#1B3022] mb-2">{title}</h4>
      <p className="text-sm text-[#141514]/60 max-w-xs">{text}</p>
    </div>
  );
}
