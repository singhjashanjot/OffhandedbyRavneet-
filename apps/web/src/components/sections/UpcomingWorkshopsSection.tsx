"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components";
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
  const allWorkshops = workshops && workshops.length > 0 ? workshops : staticWorkshops;
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

  if (!currentWorkshop) return null;

  return (
    <section className="py-24 bg-[#fffff1] max-w-screen-2xl mx-auto">
      <div className="container-custom">
        <SectionHeader
          title="Upcoming Workshops"
          subtitle="Join us for an immersive art experience. No prior experience needed."
        />

        {/* Workshop Cover Card — outer wrapper for overflow clip */}
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden mb-10 h-[650px] md:h-[680px]">
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
              <div className="absolute inset-0 z-0">
                <Image
                  src={currentWorkshop.image}
                  alt={currentWorkshop.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover grayscale-[20%] opacity-90"
                  priority
                />
                {/* Overlay gradient for text legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(45, 62, 48, 0.2), rgba(45, 62, 48, 0.4))",
                  }}
                />
              </div>

              {/* Content: stacked top / center / bottom */}
              <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-10">
                {/* ── Top Row: Date (left) & Venue (right, offset) ── */}
                <div className="flex justify-between items-start w-full text-white mix-blend-difference">
                  <div className="space-y-0.5">
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] font-sans font-medium opacity-70">
                      Date
                    </p>
                    <p className="text-base md:text-lg font-display">
                      {formatDate(currentWorkshop.date)}
                    </p>
                  </div>
                  <div className="text-right mt-8 md:mt-0">
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] font-sans font-medium opacity-70">
                      Venue
                    </p>
                    <p className="text-sm md:text-base font-display">
                      {currentWorkshop.venue}
                    </p>
                  </div>
                </div>

                {/* ── Center: Title & Description ── */}
                <div className="text-center my-auto py-6">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-white leading-tight drop-shadow-lg">
                    {currentWorkshop.title}
                  </h2>
                  {currentWorkshop.description && (
                    <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base font-sans text-white/80 leading-relaxed line-clamp-2 drop-shadow">
                      {currentWorkshop.description}
                    </p>
                  )}
                </div>

                {/* ── Bottom Row: Time, CTA, Decorative ── */}
                <div className="relative flex flex-col md:flex-row justify-between items-end w-full text-white">
                  {/* Timing (bottom-left) */}
                  <div className="hidden md:block mb-4 md:mb-0">
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] font-sans font-medium opacity-70">
                      Timing
                    </p>
                    <p className="text-sm font-display">
                      {currentWorkshop.time} — {currentWorkshop.duration}
                    </p>
                  </div>

                  {/* CTA (bottom-center) */}
                  <div className="w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-0 flex justify-center mb-[-10px] md:mb-0">
                    <Link
                      href={`/events/${currentWorkshop.slug || currentWorkshop.id}`}
                      className="group flex items-center gap-2 text-white uppercase tracking-[0.3em] text-[0.65rem] font-sans font-semibold py-3 px-6 border border-white/30 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white hover:text-offhanded-deep transition-all duration-300"
                    >
                      View Details
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </div>

                  {/* Decorative series label (bottom-right, vertical) */}
                  <div
                    className="hidden lg:block opacity-60 text-[0.5rem] font-sans tracking-widest uppercase"
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
        <div className="text-center mt-12">
          <Link href="/workshops" className="bg-[#fffff5] btn-secondary">
            View All Workshops
          </Link>
        </div>
      </div>
    </section>
  );
}
