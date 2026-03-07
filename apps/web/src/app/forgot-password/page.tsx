"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

/* ========================================
   FORGOT PASSWORD PAGE
   Request password reset email
======================================== */

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fffff1] flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/40 backdrop-blur-sm p-8 rounded-xl border border-[#92a08a]/10 shadow-sm text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-light text-[#2c3627] mb-2">Check Your Email</h2>
          <p className="text-slate-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Link href="/login" className="inline-block w-full bg-[#92a08a] hover:bg-[#2c3627] text-white font-semibold py-3 rounded-xl transition-all">
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffff1] flex flex-col relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-[0.15] pointer-events-none select-none hidden md:block">
        <svg className="w-[120px] h-[120px] text-[#92a08a]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#92a08a]/20 rounded-xl flex items-center justify-center text-[#92a08a]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <Link href="/" className="text-2xl font-bold tracking-tight text-[#2c3627] font-display">
              Offhanded
            </Link>
          </div>
          <h2 className="text-3xl font-display font-light text-slate-800 mb-2">
            Reset Your Password
          </h2>
          <p className="text-slate-500 mt-2">
            Enter your email and we'll send you a reset link
          </p>
        </motion.div>

        {/* Reset Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[440px] bg-white/40 backdrop-blur-sm p-8 rounded-xl border border-[#92a08a]/10 shadow-sm"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2c3627]/80 ml-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#92a08a]/20 bg-white/50 focus:ring-2 focus:ring-[#92a08a]/40 focus:border-[#92a08a] outline-none transition-all placeholder:text-slate-400"
                  placeholder="artist@offhanded.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#92a08a] hover:bg-[#2c3627] text-white font-semibold py-4 rounded-xl shadow-lg shadow-[#92a08a]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center mt-6 text-slate-500 text-sm">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[#92a08a] font-semibold hover:underline decoration-2 underline-offset-4 ml-1"
            >
              Sign in
            </Link>
          </p>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-slate-400 text-xs flex gap-6"
        >
          <Link href="/privacy" className="hover:text-[#92a08a] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#92a08a] transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-[#92a08a] transition-colors">
            Contact Studio
          </Link>
        </motion.div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#92a08a]/20 to-transparent"></div>
    </div>
  );
}
