"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";

/* ========================================
   SIGNUP PAGE
   User registration with Supabase
======================================== */

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error, session } = await signUpWithEmail(email, password, {
      full_name: fullName,
      phone_number: phone,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (session) {
      // Auto-confirmed — user is signed in, redirect to home
      router.push("/");
      router.refresh();
    } else {
      // Email verification required
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-heading-lg text-neutral-900 mb-2">Check Your Email</h2>
          <p className="text-body-md text-neutral-500 mb-6">
            We&apos;ve sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <Link href="/login" className="btn-primary inline-block">
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

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

        {/* Signup Card */}
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-heading-lg text-neutral-900 mb-2">
              Join Our Community
            </h1>
            <p className="text-body-md text-neutral-500">
              Create an account to book workshops and track orders
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-body-sm">
              {error}
            </div>
          )}

          {/* Social Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-full btn bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 mb-4 flex items-center justify-center gap-3"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-body-sm">
              <span className="px-4 bg-white text-neutral-400">or sign up with email</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-caption text-neutral-400 mt-1">
                At least 8 characters with numbers and symbols
              </p>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="terms" className="text-body-sm text-neutral-600">
                I agree to the{" "}
                <Link href="/terms" className="text-brand-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-body-md text-neutral-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign in
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
