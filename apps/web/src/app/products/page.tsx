"use client";

import { Header, Footer } from "@/components";
import Link from "next/link";
import { useState } from "react";

/* ========================================
   PRODUCTS PAGE — LAUNCH PREVIEW
   Features a beautiful animated SVG easel
   and a direct launch notification form.
 ======================================== */

export default function ProductsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <>
      <title>Art Shop | Offhanded Studio</title>
      <Header />

      <main className="min-h-screen bg-[#FAF7F2] pt-24 flex items-center justify-center relative overflow-hidden">
        {/* Self-contained custom keyframe animations */}
        <style>{`
          @keyframes paint {
            0%, 100% { transform: translate(0, 0) rotate(-5deg); }
            50% { transform: translate(-15px, -15px) rotate(15deg); }
          }
          @keyframes drawLine {
            0% { stroke-dashoffset: 200; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -200; }
          }
          .animate-paint {
            animation: paint 4s ease-in-out infinite;
          }
          .animate-draw {
            stroke-dasharray: 200;
            animation: drawLine 6s ease-in-out infinite;
          }
        `}</style>

        {/* Subtle background canvas texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Soft studio mood lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#E8E1D5] opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#E5D4C0] opacity-40 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20 text-center relative z-10 flex flex-col items-center">
          
          {/* Animated Art Easel SVG */}
          <div className="mb-8 relative">
            <svg viewBox="0 0 200 200" className="w-44 h-44 md:w-56 md:h-56 mx-auto drop-shadow-xl">
              {/* Easel Stand Legs */}
              <line x1="100" y1="20" x2="40" y2="180" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="20" x2="160" y2="180" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="20" x2="100" y2="185" stroke="#704823" strokeWidth="4" strokeLinecap="round" />
              
              {/* Support Shelf */}
              <rect x="30" y="115" width="140" height="8" rx="2" fill="#8B5A2B" />
              <rect x="40" y="112" width="120" height="3" rx="1" fill="#704823" />
              
              {/* Canvas */}
              <g transform="rotate(-2, 100, 85)">
                <rect x="50" y="50" width="100" height="70" rx="3" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
                {/* Artwork on Canvas (Painting in progress) */}
                <path d="M 60,95 C 80,70 100,110 120,80 C 130,70 140,90 140,90" fill="none" stroke="#C68B59" strokeWidth="4" strokeLinecap="round" className="animate-draw" />
                <path d="M 70,80 C 90,60 110,95 130,70" fill="none" stroke="#7D8F82" strokeWidth="3" strokeLinecap="round" className="animate-draw" style={{ animationDelay: "1.5s" }} />
                <circle cx="80" cy="75" r="5" fill="#C68B59" opacity="0.8" className="animate-pulse" />
                <circle cx="120" cy="85" r="4" fill="#7D8F82" opacity="0.8" className="animate-pulse" style={{ animationDelay: "1s" }} />
              </g>

              {/* Paintbrush (Animated) */}
              <g className="animate-paint origin-[100px_90px]">
                {/* Brush handle */}
                <line x1="120" y1="130" x2="95" y2="95" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round" />
                {/* Metal ferrule */}
                <line x1="95" y1="95" x2="90" y2="88" stroke="#9CA3AF" strokeWidth="5" strokeLinecap="round" />
                {/* Bristles */}
                <path d="M 90,88 C 88,85 85,80 87,77 C 89,75 92,79 94,82 L 90,88" fill="#1E293B" />
                {/* Wet paint tip */}
                <path d="M 87,77 C 86,75 84,73 86,71 C 87,70 89,72 90,74 L 87,77" fill="#C68B59" />
              </g>
            </svg>
          </div>

          {/* Heading */}
          <span className="font-sans text-[#7D8F82] font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
            Offhanded Studio Shop
          </span>
          <h1 className="font-display text-neutral-900 text-3xl md:text-5xl font-light leading-[1.2] tracking-tighter max-w-xl mb-6">
            Curating Something <br />
            <span className="font-serif italic font-normal text-[#C68B59]">Beautiful</span> for You
          </h1>
          <p className="font-sans text-neutral-500 text-sm md:text-base font-light leading-relaxed max-w-lg mb-10">
            We are currently in the studio selecting premium artist tools, custom canvas pieces, and artisan ceramics. Each item is crafted or selected to bring peace and inspiration to your creative journey.
          </p>

          {/* Notify Form */}
          <div className="w-full max-w-md bg-white/40 border border-white/60 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-lg mb-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/70 border border-neutral-200 rounded-xl px-5 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#7D8F82] transition-all"
                />
                <button
                  type="submit"
                  className="bg-[#2B3B2E] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#1B291E] active:scale-95 transition-all shadow-md uppercase tracking-wider text-[11px]"
                >
                  Notify Me
                </button>
              </form>
            ) : (
              <div className="text-center py-2">
                <p className="text-[#7D8F82] text-sm font-semibold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  You're on the list!
                </p>
                <p className="text-neutral-500 text-xs mt-1.5 font-light">
                  We'll send you an exclusive invite the moment our studio collection launches.
                </p>
              </div>
            )}
          </div>

          {/* Navigation links */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/"
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 font-semibold transition-colors py-2 px-4"
            >
              Back to Home
            </Link>
            <Link
              href="/workshops"
              className="bg-[#C68B59]/10 text-[#C68B59] hover:bg-[#C68B59]/20 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
            >
              Explore Art Workshops
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
