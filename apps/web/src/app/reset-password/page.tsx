"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

/* ========================================
   RESET PASSWORD PAGE
   Allows authenticated users (via reset link)
   to set a new password
======================================== */

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

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
          <h2 className="text-2xl font-display font-light text-[#2c3627] mb-2">Password Updated!</h2>
          <p className="text-slate-600 mb-6">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-block w-full bg-[#92a08a] hover:bg-[#2c3627] text-white font-semibold py-3 rounded-xl transition-all"
          >
            Go to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffff1] flex flex-col relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-[0.15] pointer-events-none select-none hidden md:block">
        <svg className="w-[120px] h-[120px] text-[#92a08a]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <Link href="/" className="text-2xl font-bold tracking-tight text-[#2c3627] font-display">
              Offhanded
            </Link>
          </div>
          <h2 className="text-3xl font-display font-light text-slate-800 mb-2">
            Set New Password
          </h2>
          <p className="text-slate-500 mt-2">
            Enter your new password below
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

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2c3627]/80 ml-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-[#92a08a]/20 bg-white/50 focus:ring-2 focus:ring-[#92a08a]/40 focus:border-[#92a08a] outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#92a08a] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2c3627]/80 ml-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#92a08a]/20 bg-white/50 focus:ring-2 focus:ring-[#92a08a]/40 focus:border-[#92a08a] outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#92a08a] hover:bg-[#2c3627] text-white font-semibold py-4 rounded-xl shadow-lg shadow-[#92a08a]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
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
