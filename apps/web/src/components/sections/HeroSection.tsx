"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ========================================
   HERO SECTION
   Main landing section with brand intro
======================================== */



export function HeroSection() {
  return (
    <>
      <section className="relative w-full p-1 lg:p-2">
        <div className="relative flex min-h-[calc(90dvh-0.5rem)] lg:min-h-[calc(100dvh-1rem)] flex-col gap-4 overflow-hidden rounded-[10px] items-center justify-center p-6 lg:p-16 text-center bg-[#b7c4b0]">
          <div className="relative z-10 flex flex-col items-center max-w-3xl">
            <span className="mb-4 inline-flex items-center rounded-full bg-primary/5 px-4 py-1.5 text-[10px] font-bold text-[#2D3E30] uppercase tracking-[0.2em] border border-primary/10">
              Mindful Creativity
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-[#2D3E30] tracking-tight mb-5 leading-[1.1]">
            An experience for  <br /><span className="font-display font-light text-[#2D3E30]">Wandering souls</span>
            </h1>
            <p className="text-primary/80 text-base md:text-lg font-light max-w-lg mb-8 leading-relaxed">
Slow down, explore, and rediscover the joy of creating in a calm, supportive space.            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/workshops" 
                className="flex items-center justify-center rounded-full h-11 px-8 bg-[#2D3E30] hover:bg-primary/80 text-[#fffff1] text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-primary/10 transform hover:-translate-y-0.5"
              >
                Explore Workshops
              </Link>
              <button className="flex items-center justify-center rounded-full h-11 px-8 bg-transparent hover:bg-primary/5 text-primary text-sm font-bold uppercase tracking-widest transition-all duration-300 border border-primary/20">
                <span className="material-symbols-outlined mr-2 text-xl">play_circle</span>
                Workshop Visuals
              </button>
            </div>
          </div>
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url('https://res.cloudinary.com/daoho0jwj/image/upload/v1772198382/WhatsApp_Image_2026-02-20_at_5.55.13_PM_1_oijwzm.jpg')" }}></div>
        </div>
      </section>
    </>
  );
}

/* Trust Item Component */
function TrustItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-body-sm font-medium">{text}</span>
    </div>
  );
}
