"use client";

import { motion } from "framer-motion";

/* ========================================
   CTA SECTION
   Call-to-action banner for conversions
======================================== */

interface CTASectionProps {
  className?: string;
}

export function CTASection({ className = "" }: CTASectionProps) {
  return (
    <section
      className={`relative overflow-hidden py-24 md:py-32 flex items-center justify-center min-h-[60vh] bg-[#fffff1] ${className}`}
    >
      {/* Top Left Brush Stroke */}
      <div className="absolute -top-10 -left-10 w-64 h-64 opacity-15 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40,160 C80,140 120,40 160,40"
            fill="none"
            stroke="#2D3E30"
            strokeLinecap="round"
            strokeWidth="0.5"
          />
          <path
            d="M45,165 C85,145 125,45 165,45"
            fill="none"
            opacity="0.5"
            stroke="#2D3E30"
            strokeLinecap="round"
            strokeWidth="0.3"
          />
        </svg>
      </div>

      {/* Bottom Right Pencil/Needle Shape */}
      <div className="absolute -bottom-12 -right-12 w-80 h-80 opacity-15 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <line stroke="#2D3E30" strokeWidth="0.5" x1="20" x2="180" y1="180" y2="20" />
          <circle cx="180" cy="20" fill="#2D3E30" r="1.5" />
          <path
            d="M20,180 Q100,100 180,20"
            fill="none"
            opacity="0.4"
            stroke="#2D3E30"
            strokeWidth="0.2"
          />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="container mx-auto px-6 relative z-10 text-center max-w-4xl"
      >
        {/* Brand Identifier */}
        <div className="mb-8 flex items-center justify-center">
          <div className="w-10 h-[1px] bg-[#2D3E30]/40" />
          <span className="mx-4 text-[#2D3E30]/60 font-sans tracking-[0.3em] text-[10px] uppercase">
            Offhanded
          </span>
          <div className="w-10 h-[1px] bg-[#2D3E30]/40" />
        </div>

        {/* Headline */}
        <h2 className="font-display font-light text-[#2D3E30] text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight tracking-[-0.02em]">
          Ready to Start Your <br className="hidden md:block" />{" "}
          <span className="font-normal">Creative Journey?</span>
        </h2>

        {/* Sub-headline */}
        <p className="font-sans text-[#2D3E30]/80 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Drop your idea or the kind of workshop you want us to host below
        </p>

        {/* Input Box */}
        <div className="max-w-lg mx-auto mt-12 w-full relative">
          <div className="bg-[#fffff1] rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-neutral-200/60 p-4 pb-5">
            <textarea
              rows={3}
              className="w-full bg-transparent text-[#2D3E30] font-sans text-base placeholder:text-neutral-400 resize-none border-0 focus:outline-none focus:ring-0 p-0"
              placeholder="what's on your mind..."
            />
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#2D3E30] text-white flex items-center justify-center hover:bg-[#2D3E30]/90 transition-colors"
                aria-label="Send"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" />
                  <path d="m5 12 7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
