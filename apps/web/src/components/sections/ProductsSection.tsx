"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ========================================
   PRODUCTS SECTION — CURATION REVEAL
   Parallax slide-up reveal + Curation state.
 ======================================== */

function CurationCard() {
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
    <div className="relative mt-8 md:mt-12 bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

      {/* Floating Art Icons Animation */}
      <div className="relative flex justify-center mb-8">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Animated pulsing outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-2 rounded-full border border-white/5 animate-ping" style={{ animationDuration: "3s" }} />
          
          {/* Paintbrush Container */}
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shadow-inner relative z-10 hover:rotate-12 transition-transform duration-500">
            <span className="material-symbols-outlined text-white/70 text-3xl animate-bounce" style={{ animationDuration: "3s" }}>palette</span>
          </div>
          
          {/* Floating paintbrush */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shadow-lg border border-white/20">
            <span className="material-symbols-outlined text-white text-base">brush</span>
          </div>
        </div>
      </div>

      <span className="text-white/30 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Studio Curations</span>
      <h3 className="text-2xl md:text-3xl font-display font-light text-white mb-4 leading-tight">
        Handcrafted Ceramics & Fine Art Tools
      </h3>
      <p className="text-white/60 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed mb-8">
        We are currently curating and handcrafting a select range of our finest art supplies, signature sketchbooks, and artisan ceramics directly in our studio. Keep an eye out — beautiful things are in the making!
      </p>

      {/* Form / Success state */}
      <div className="max-w-md mx-auto relative z-10">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email for launch updates"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/35 transition-all"
            />
            <button
              type="submit"
              className="bg-white text-[#2B3B2E] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-100 active:scale-95 transition-all shadow-md uppercase tracking-wider text-[11px]"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-green-400 text-sm font-semibold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              You are on the list!
            </p>
            <p className="text-white/50 text-xs mt-1.5 font-light">
              We'll send you an exclusive invite the moment our studio curations launch.
            </p>
          </div>
        )}
      </div>

      {/* Footer Features */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-12 pt-8 border-t border-white/5 text-white/40 text-[10px] uppercase tracking-widest font-semibold">
        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-white/50">brush</span> Custom Orders</span>
        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-white/50">verified</span> Ceramic Art</span>
        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-white/50">schedule</span> Launching Soon</span>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [useParallax, setUseParallax] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setUseParallax(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax: translateY slides the section up from below
  const y = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], ["80vh", "0vh", "0vh", "-20vh"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.7, 1], [0, 1, 1, 0.8, 0]);

  if (!useParallax) {
    return (
      <div ref={sectionRef} className="relative h-auto bg-[#2B3B2E]">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
          {/* Decorative blur circles */}
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
          <div className="absolute bottom-16 left-8 w-64 h-64 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
            <div className="max-w-lg">
              <span className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Volume 01 — Permanent Collection</span>
              <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight text-white">Our Products</h2>
              <p className="text-white/50 text-base font-light mt-1">Curated art supplies for your creative journey.</p>
            </div>
          </div>

          {/* Curation Card */}
          <CurationCard />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sectionRef} 
      className="relative h-[100vh]"
    >
      {/* Sticky green section */}
      <motion.div
        style={{ y }}
        className="sticky top-0 w-full bg-[#2B3B2E]"
      >
        <motion.div
          style={{ opacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-28 pb-16 md:pb-24"
        >
          {/* Decorative blur circles */}
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
          <div className="absolute bottom-16 left-8 w-64 h-64 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
            <div className="max-w-lg">
              <span className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Volume 01 — Permanent Collection</span>
              <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight text-white">Our Products</h2>
              <p className="text-white/50 text-base font-light mt-1">Curated art supplies for your creative journey.</p>
            </div>
          </div>

          {/* Curation Card */}
          <CurationCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
