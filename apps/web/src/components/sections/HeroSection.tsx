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
      <section className="relative w-full p-2 lg:p-4">
        <div className="relative flex min-h-[calc(100dvh-1rem)] lg:min-h-[calc(100dvh-2rem)] flex-col gap-6 overflow-hidden rounded-[2rem] items-center justify-center p-8 lg:p-24 text-center bg-[#b7c4b0]">
          <div className="relative z-10 flex flex-col items-center max-w-4xl">
            <span className="mb-6 inline-flex items-center rounded-full bg-primary/5 px-5 py-2 text-[10px] font-bold text-[#2D3E30] uppercase tracking-[0.2em] border border-primary/10">
              Mindful Creativity
            </span>
            <h1 className=" text-5xl md:text-7xl lg:text-8xl font-light text-[#2D3E30] tracking-tight mb-8 leading-[1.1]">
              Art for the <br /><span className="font-serif italic font-medium text-[#2D3E30]">Mindful Soul</span>
            </h1>
            <p className="text-primary/80 text-lg md:text-xl font-light max-w-xl mb-12 leading-relaxed">
              Reconnect with your creativity through guided, serene workshops designed to calm the mind and awaken the senses.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link
                href="/workshops" 
                className="flex items-center justify-center rounded-full h-14 px-10 bg-[#2D3E30] hover:bg-primary/80 text-[#fffff1] text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-primary/10 transform hover:-translate-y-0.5"
              >
                Explore Workshops
              </Link>
              <button className="flex items-center justify-center rounded-full h-14 px-10 bg-transparent hover:bg-primary/5 text-primary text-sm font-bold uppercase tracking-widest transition-all duration-300 border border-primary/20">
                <span className="material-symbols-outlined mr-2 text-2xl">play_circle</span>
                Watch Film
              </button>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHWVlxO2WUrpawZsC7CdTLGLxxHsaPoYG67cHjI22ySuSAX17nPeq1vfexMa-yBmyi0zBlVuvhhAeYyfCRPehD1ehOWAqCNi366Uu-in_sp8s63bQc75qV_Gm5TPqJCQLycKO9mxVBJKyZc4qn-M_z2aEwNN9VUXQP0skHI28bE9i12Cux0N86HGdJDRWOGjt2fZ48jfM7XOLgOvVTdSu0Zuv8jctjVLqTZtzdKpXunqpyosfW4hGmhnqwmUTYGP0VfNUMQqR7sFTG')" }}></div>
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
