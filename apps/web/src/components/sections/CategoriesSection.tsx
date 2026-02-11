"use client";

import React from "react";
import Link from "next/link"; 

/* ========================================
   CATEGORIES SECTION
   Redesigned "Explore our Art Experiences" section
   Note: Pure clone of the provided design reference. 
   Content is hardcoded to match the visual reference exactly as requested.
======================================== */

export function CategoriesSection() {
  return (
    <section className="px-4 py-24 lg:px-12 max-w-screen-2xl mx-auto w-full " id="categories"  >
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-5xl font-display font-light tracking-tight mb-4 text-text-main light:text-dark">
            Explore our Art Experiences
          </h2>
          <p className="text-text-muted dark:text-stone-400 text-lg font-light">
            Curated disciplines designed to anchor you in the present.
          </p>
        </div>
        <Link
          className="hidden md:flex items-center text-primary font-medium hover:text-primary-dark transition-all gap-2 group"
          href="/allcategories"
        >
          <span className="text-sm uppercase tracking-widest">View all categories</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-base">
            east
          </span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-[300px]">
        {/* Card 1: Pottery Art Texture - Tall on LG */}
        <Link href="/experience/pottery-texture" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark cursor-pointer lg:row-span-2 lg:col-span-1 border border-stone-100 dark:border-stone-800 block">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuKVNovUVJnEUUHB18B1Ypi73XvB9b7xYe_e2eNn7tqGYVhzWHsxqOY7rkikKNJ_0HvpkWyRJ0sMc2glVBu7Pd_RBau-XlUO_1hnWmVC3rHpmBqYS5JHtPaZ7HVSF4qcdc5_qoKHMP4DBUNp5YG-2gzA_0gaqH5TXyylejQ7d2i4DuC9o__DOn10FqwBBndF_zNccccIavt5avRccPSS46zY9B_id2Z8y1MYSUkS6sDSRNaNDHyeQxRyw8nH-SyMWoIid2oMiDqDAR")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
              Tactile Harmony
            </span>
            <h3 className="text-white text-2xl font-display font-light mb-2">
              Pottery Art Texture
            </h3>
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs transition-opacity group-hover:text-white/80">
              Shape earth with your hands, finding rhythm in the circular motion of the wheel.
            </p>
          </div>
        </Link>

        {/* Card 2: Canvas Painting - Wide on LG */}
        <Link href="/experience/canvas-painting" className="group relative overflow-hidden rounded-2xl bg-[#e8ede5] dark:bg-stone-800 cursor-pointer lg:col-span-2 border border-stone-100 dark:border-stone-800 block">
          <div
            className="absolute right-0 bottom-0 w-1/2 h-full bg-cover bg-center opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:translate-x-4"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSCFiZ8evmlz60E4OO6fY8FnCR-OQudvyZbPYjpSah2k_lTA8cFYgdxesyUASWGp0Dv8lpUydzZBoWSAYXcISXxYiNHNPjKwciJCRtyXGBZAzHG1z1u0ytxk9vUWC6OXnTarFw6mQ21LliNGxfER68CodfVLC9HumlIy04xIZc9_seMpIqtCGvBwASCzZ-IofWyJ9hNN353dXQP68-ii-rgGkYwh9vhyX5Cs0N-S4c_1ZG_yJAX5MZlHZ011TOx9lIvOJoZaBYZcVQ")',
            }}
          ></div>
          <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl font-light">
              brush
            </span>
            <h3 className="text-text-main dark:text-white text-3xl font-display font-light mb-3">
              Canvas Painting
            </h3>
            <p className="text-text-muted dark:text-stone-400 text-sm font-light max-w-xs leading-relaxed">
              The freedom of white space. Express your inner landscape through pigment and movement.
            </p>
          </div>
          <div className="absolute top-8 right-8 opacity-20 pointer-events-none">
            <svg
              fill="none"
              height="120"
              viewBox="0 0 100 100"
              width="120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="text-primary"
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="0.5"
              ></circle>
              <path
                className="text-primary"
                d="M20 50 Q50 20 80 50"
                stroke="currentColor"
                strokeWidth="0.5"
              ></path>
            </svg>
          </div>
        </Link>

        {/* Card 3: Clay Mirror Painting - Small */}
        <Link href="/experience/clay-mirror-painting" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark cursor-pointer border border-stone-100 dark:border-stone-800 block">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1522775559573-2f63d04af08f?w=800&q=80")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
              Molding Patience
            </span>
            <h3 className="text-white text-2xl font-display font-light mb-2">
              Clay Mirror Painting
            </h3>
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs transition-opacity group-hover:text-white/80">
              Create intricate cultural designs with clay and mirrors.
            </p>
          </div>
        </Link>
        
        {/* New Card: Punch Needle - Small */}
        <Link href="/experience/punch-needle" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark cursor-pointer border border-stone-100 dark:border-stone-800 block">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
              Textured Threads
            </span>
            <h3 className="text-white text-2xl font-display font-light mb-2">
              Punch Needle
            </h3>
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs transition-opacity group-hover:text-white/80">
              Learn the meditative craft of punch needle embroidery.
            </p>
          </div>
        </Link>

        {/* Card 4: Textured Art - Wide on LG */}
        <Link href="/experience/textured-art" className="group relative overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-900 cursor-pointer lg:col-span-2 border border-stone-100 dark:border-stone-800 block">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAw3b1f7a6lWfdbEgo5tdd_p0R3MrUTulESqHaGtyEps371KiGZiZAHx9v1CQfM_erChYIYj1odYN9NrcODXjFsVllVze91aV9xIKDmPDpZr4saUDlSoYA284Z2ibXwY0CezSugydv3u74HHXlOEwnAXCl5tUAijnm1wdPvzwiczkxoiJfZMGWdz0MEUy89nOmVxb3QN89YfvKWyvTqNjQwO8Y24nX_CRMvE3csMS-wh-dF7lNTTtUR6tvQ1vc7SXISU98pCN9fuiTV")',
            }}
          ></div>
          <div className="absolute inset-0 bg-accent/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-8 lg:p-12">
            <h3 className="text-white text-3xl font-display font-light mb-2">
              Textured Art
            </h3>
            <p className="text-white/60 text-sm font-light max-w-xs leading-relaxed">
              Layering light and shadow through the delicate medium of handmade papers.
            </p>
          </div>
        </Link>
        
         {/* Card 6: Jute Bag Painting */}
         <Link href="/experience/jute-bag-painting" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark cursor-pointer border border-stone-100 dark:border-stone-800 block hidden lg:block">
           <div
             className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
             style={{
               backgroundImage:
                 'url("https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800&q=80")',
             }}
           ></div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
           <div className="absolute inset-0 flex flex-col justify-end p-8">
             <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
               Sustainable Style
             </span>
             <h3 className="text-white text-2xl font-display font-light mb-2">
               Jute Bag Painting
             </h3>
             <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs transition-opacity group-hover:text-white/80">
               Customize eco-friendly jute bags with your own hand-painted designs.
             </p>
           </div>
         </Link>

      </div>
    </section>
  );
}
