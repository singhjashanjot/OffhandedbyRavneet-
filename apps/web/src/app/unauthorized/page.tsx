"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

/* ========================================
   UNAUTHORIZED / ACCESS DENIED PAGE
   Premium glassmorphism layout for admin access failure
   Provides switch-account or return-home options
======================================== */

export default function UnauthorizedPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOutAndSwitch = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push("/login?redirectTo=/admin");
    } catch (error) {
      console.error("Sign out failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffff1] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 opacity-[0.1] pointer-events-none select-none hidden md:block">
        <svg className="w-[120px] h-[120px] text-[#92a08a]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 opacity-[0.1] pointer-events-none select-none hidden md:block">
        <svg className="w-[120px] h-[120px] text-[#92a08a]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-[#e05353]/10 rounded-full flex items-center justify-center text-[#e05353] border border-[#e05353]/20 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-display font-light text-[#2c3627] mb-2 tracking-tight">
            Administrator Access Required
          </h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto font-light leading-relaxed">
            This area of the studio is reserved for administrators. Your current account does not have authorization to view this panel.
          </p>
        </motion.div>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[460px] bg-white/40 backdrop-blur-sm p-8 rounded-xl border border-[#92a08a]/10 shadow-sm text-center"
        >
          {user && (
            <div className="mb-6 p-4 rounded-xl bg-white/60 border border-[#92a08a]/10">
              <span className="text-[10px] text-slate-400 block uppercase tracking-[0.2em] font-semibold mb-1">Logged In As</span>
              <span className="text-sm font-medium text-slate-700">{user.email}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleSignOutAndSwitch}
              disabled={loading}
              className="w-full bg-[#92a08a] hover:bg-[#2c3627] text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Signing out..." : "Sign Out & Switch Account"}
            </button>

            <Link
              href="/"
              className="block w-full border border-[#92a08a]/20 bg-white/50 hover:bg-white text-[#2c3627] font-medium py-3.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99]"
            >
              Go to Homepage
            </Link>
          </div>
        </motion.div>

        {/* Support Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-slate-400 text-xs"
        >
          If you believe this is an error, please contact the lead designer or developer.
        </motion.div>
      </div>

      {/* Footer Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#92a08a]/20 to-transparent"></div>
    </div>
  );
}
