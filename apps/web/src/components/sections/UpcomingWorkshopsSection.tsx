"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components";
import { ActionPill } from "@/components/ui/action-pill";
import { upcomingWorkshops as staticWorkshops, formatDate } from "@/data";
import type { Workshop } from "@/data";

const AUTO_PLAY_INTERVAL = 6000; // 6 seconds

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -600 : 600,
    opacity: 0,
    scale: 0.95,
  }),
};

interface UpcomingWorkshopsSectionProps {
  workshops?: Workshop[];
}

export function UpcomingWorkshopsSection({ workshops }: UpcomingWorkshopsSectionProps) {
  const hasWorkshops = workshops && workshops.length > 0;
  const allWorkshops = hasWorkshops ? workshops : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward (right-to-left), -1 = backward
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentWorkshop = allWorkshops[activeIndex];

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (allWorkshops.length > 1) {
      timerRef.current = setInterval(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % allWorkshops.length);
      }, AUTO_PLAY_INTERVAL);
    }
  }, [allWorkshops.length]);

  // Auto-play
  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = useCallback((index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    resetTimer(); // reset timer on manual navigation
  }, [activeIndex, resetTimer]);

  if (!hasWorkshops) {
    return (
      <section className="py-20 md:py-28 bg-[#fffff1] max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div>
          <SectionHeader
            title="Upcoming Workshops"
            subtitle="Join us for an immersive art experience. No prior experience needed."
          />

          <div className="relative mt-8 md:mt-12 bg-white/40 border border-[#2B3B2E]/10 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto overflow-hidden shadow-sm">
            {/* Animated Pottery Wheel */}
            <div className="mb-8 relative">
              <svg viewBox="0 0 200 200" className="w-44 h-44 md:w-52 md:h-52 mx-auto drop-shadow-md">
                {/* Rotating Pottery Wheel/Base */}
                <ellipse cx="100" cy="150" rx="60" ry="15" fill="#E5D4C0" stroke="#C68B59" strokeWidth="2" />
                <ellipse cx="100" cy="147" rx="55" ry="12" fill="#D2B48C" />
                
                {/* Pottery clay structure (Rotating & Morphing animation) */}
                <g className="animate-spin origin-[100px_110px]" style={{ animationDuration: "8s" }}>
                  {/* Clay pot being formed */}
                  <path d="M 75,145 Q 60,110 80,90 Q 100,80 120,90 Q 140,110 125,145 Z" fill="#C59B76" opacity="0.9" />
                  {/* Wet highlight */}
                  <path d="M 85,100 Q 100,92 115,100" stroke="#FAF7F2" strokeWidth="2" fill="none" opacity="0.6" />
                </g>

                {/* Hands holding the clay (Gentle movement) */}
                <g className="animate-pulse" style={{ animationDuration: "3s" }}>
                  {/* Left hand helper */}
                  <path d="M 40,130 Q 65,120 72,135" stroke="#E8E1D5" strokeWidth="6" strokeLinecap="round" fill="none" />
                  {/* Right hand helper */}
                  <path d="M 160,130 Q 135,120 128,135" stroke="#E8E1D5" strokeWidth="6" strokeLinecap="round" fill="none" />
                </g>

                {/* Sparkles / Studio magic */}
                <circle cx="50" cy="70" r="3" fill="#D97706" className="animate-ping" style={{ animationDuration: "2s" }} />
                <circle cx="150" cy="65" r="2.5" fill="#7D8F82" className="animate-ping" style={{ animationDelay: "1s", animationDuration: "2.5s" }} />
                <circle cx="100" cy="50" r="2" fill="#C68B59" className="animate-pulse" />
              </svg>
            </div>

            <span className="text-[#7D8F82] font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Studio Curations</span>
            <h3 className="text-2xl md:text-3xl font-display font-light text-neutral-800 mb-4 leading-tight">
              New Art Workshops Coming Up Very Soon
            </h3>
            <p className="text-neutral-500 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed mb-6">
              We are currently behind the scenes preparing new immersive art experiences, clay shaping, and painting sessions. Ravneet is designing the next series of workshops right now!
            </p>
            <div className="inline-flex items-center gap-2 text-[#C68B59] font-medium text-sm">
              <span className="uppercase tracking-widest font-semibold">Curating at the Back... Stay Tuned</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentWorkshop) return null;

  return (
    <section className="py-20 md:py-28 bg-[#fffff1] max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div>
        <SectionHeader
          title="Upcoming Workshops"
          subtitle="Join us for an immersive art experience. No prior experience needed."
        />

        {/* Workshop Cover Card — outer wrapper for overflow clip */}
        <div className="relative w-full  mx-auto overflow-hidden mb-8 h-[440px] md:h-[580px]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentWorkshop.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 30, mass: 1 },
                opacity: { duration: 0.4, ease: "easeInOut" },
                scale: { duration: 0.4, ease: "easeInOut" },
              }}
              className="absolute inset-0 rounded-2xl shadow-soft overflow-hidden will-change-transform"
              style={{ transform: "translateZ(0)" }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0 bg-[#FFFFF5]">
                <Image
                  src={currentWorkshop.image}
                  alt={currentWorkshop.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover opacity-100"
                  priority
                />
                {/* Subtle top & bottom gradients for text readability while leaving the center clear */}
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </div>

              {/* Content: stacked top / center / bottom */}
              <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-10">
                {/* ── Top Row: Date (left) & Venue (right, offset) ── */}
                <div className="flex justify-between items-start w-full text-white">
                  <div className="space-y-0.5">
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] font-sans font-medium text-white/70">
                      Date
                    </p>
                    <p className="text-base md:text-lg font-display font-medium">
                      {formatDate(currentWorkshop.date)}
                    </p>
                  </div>
                  <div className="text-right mt-8 md:mt-0">
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] font-sans font-medium text-white/70">
                      Venue
                    </p>
                    <p className="text-sm md:text-base font-display font-medium">
                      {currentWorkshop.venue}
                    </p>
                  </div>
                </div>

                {/* ── Center: Title & Description (Removed as requested to show full image cleanly) ── */}
                <div className="text-center my-auto py-6" />

                {/* ── Bottom Row: Time, CTA, Decorative ── */}
                <div className="relative flex flex-col md:flex-row justify-between items-end w-full text-white">
                  {/* Timing (bottom-left) */}
                  <div className="hidden md:block mb-4 md:mb-0">
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] font-sans font-medium text-white/70">
                      Timing
                    </p>
                    <p className="text-sm font-display font-medium">
                      {currentWorkshop.time} {currentWorkshop.endTime ? `— ${currentWorkshop.endTime}` : `— ${currentWorkshop.duration}`}
                    </p>
                  </div>

                  {/* CTA (bottom-center) */}
                  <div className="w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-0 flex justify-center mb-[-10px] md:mb-0">
                    <Link
                      href={`/events/${currentWorkshop.slug || currentWorkshop.id}`}
                      className="group flex items-center gap-2 text-white uppercase tracking-[0.3em] text-[0.65rem] font-sans font-bold py-3 px-6 border border-white/20 rounded-xl backdrop-blur-sm bg-white/10 hover:bg-white hover:text-neutral-900 transition-all duration-300 shadow-sm"
                    >
                      View Details
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </div>

                  {/* Decorative series label (bottom-right, vertical) */}
                  <div
                    className="hidden lg:block text-white/60 text-[0.5rem] font-sans tracking-widest uppercase"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    Workshop Series No.{" "}
                    {String(activeIndex + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Indicators */}
        <nav
          aria-label="Workshop pagination"
          className="flex justify-center items-center gap-6"
        >
          {allWorkshops.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-current={index === activeIndex ? "page" : undefined}
              aria-label={`Go to workshop ${index + 1}`}
              className={`h-[1px] w-12 transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? "bg-offhanded-deep"
                  : "bg-offhanded-accent/40 hover:bg-offhanded-deep"
              }`}
            />
          ))}
        </nav>

        {/* View All */}
        <div className="text-center mt-3 flex justify-center">
          <ActionPill href="/workshops">
            View All Workshops
          </ActionPill>
        </div>
      </div>
    </section>
  );
}
