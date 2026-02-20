"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Metadata } from "next";

/* ========================================
   LOGIN PAGE
   User authentication
======================================== */

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4 max-w-screen-2xl mx-auto">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-display text-3xl font-semibold text-neutral-900 tracking-tight"
          >
            Offhanded
          </Link>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-heading-lg text-neutral-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-body-md text-neutral-500">
              Sign in to access your workshops and orders
            </p>
          </div>

          {/* Social Login */}
          <button className="w-full btn bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 mb-4 flex items-center justify-center gap-3">
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-body-sm">
              <span className="px-4 bg-white text-neutral-400">or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-body-sm font-medium text-neutral-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-body-sm text-brand-600 hover:text-brand-700">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-6">
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-body-md text-neutral-500 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-body-sm text-neutral-500 hover:text-neutral-700">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
