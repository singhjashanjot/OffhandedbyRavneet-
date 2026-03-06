"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { PhoneInput } from "@/components/ui";

/* ========================================
   SIGNUP PAGE
   User registration with Supabase
   Redesigned with glassmorphism aesthetic
======================================== */

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    // Prepare metadata
    const metadata: Record<string, string> = {
      full_name: fullName,
    };
    
    // Add phone only if provided
    if (phone.trim()) {
      metadata.phone_number = `${countryCode}${phone}`;
    }

    const { error, session } = await signUpWithEmail(email, password, metadata);

    if (error) {
      // Handle specific error cases
      let errorMessage = error.message;
      
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("Password")) {
        errorMessage = "Password must be at least 8 characters with numbers and symbols.";
      }
      
      setError(errorMessage);
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
      <div className="min-h-screen bg-[#fffff1] flex items-center justify-center p-4">
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
          <p className="text-slate-600 mb-4">
            We&apos;ve sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Note: If you don&apos;t see the email, check your spam folder or contact support.
          </p>
          <Link href="/login" className="inline-block w-full bg-[#92a08a] hover:bg-[#2c3627] text-white font-semibold py-3 rounded-xl transition-all">
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffff1] flex flex-col relative overflow-hidden">
      {/* Decorative Corner Illustrations */}
      <div className="absolute top-10 right-10 opacity-[0.15] pointer-events-none select-none hidden md:block">
        <svg className="w-[120px] h-[120px] text-[#92a08a]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      </div>
      <div className="absolute bottom-10 left-10 opacity-[0.15] pointer-events-none select-none hidden md:block">
        <svg className="w-[120px] h-[120px] text-[#92a08a]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96a.996.996 0 000-1.41z"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Logo/Header */}
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
            Join the creative community
          </h2>
          <p className="text-slate-500 mt-2 font-light">
            Create an account to book workshops and share your journey
          </p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[480px] bg-white/40 backdrop-blur-sm p-8 rounded-xl border border-[#92a08a]/10 shadow-sm"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Social Signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full border border-[#92a08a]/20 bg-white/50 hover:bg-white text-slate-700 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 mb-6"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-[#92a08a]/10"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase tracking-widest font-medium">
              Or sign up with email
            </span>
            <div className="flex-grow border-t border-[#92a08a]/10"></div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2c3627]/80 ml-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#92a08a]/20 bg-white/50 focus:ring-2 focus:ring-[#92a08a]/40 focus:border-[#92a08a] outline-none transition-all placeholder:text-slate-400"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#92a08a]/20 bg-white/50 focus:ring-2 focus:ring-[#92a08a]/40 focus:border-[#92a08a] outline-none transition-all placeholder:text-slate-400"
                  placeholder="artist@offhanded.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2c3627]/80 ml-1">
                Phone Number <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                placeholder="98765 43210"
                required={false}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2c3627]/80 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-[#92a08a]/20 bg-white/50 focus:ring-2 focus:ring-[#92a08a]/40 focus:border-[#92a08a] outline-none transition-all placeholder:text-slate-400"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
              <p className="text-xs text-slate-400 ml-1">
                At least 8 characters with numbers and symbols
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#92a08a]/30 text-[#92a08a] focus:ring-[#92a08a]/40"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{" "}
                <Link href="/terms" className="text-[#92a08a] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#92a08a] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#92a08a] hover:bg-[#2c3627] text-white font-semibold py-4 rounded-xl shadow-lg shadow-[#92a08a]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-8 text-slate-500 text-sm">
            Already have an account?{" "}
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
