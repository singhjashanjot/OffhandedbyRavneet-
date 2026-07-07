"use client";

import React from "react";
import Link from "next/link";

/* ========================================
   CATEGORIES SECTION
   "Explore our Art Experiences"
   Pinterest-style masonry grid with balanced columns.
======================================== */

interface CardProps {
  href: string;
  image: string;
  label: string;
  title: string;
  description: string;
  aspect: "tall" | "wide" | "portrait" | "square";
}

function Card({ href, image, label, title, description, aspect }: CardProps) {
  const aspectClass =
    aspect === "tall"
      ? "aspect-[3/4]"
      : aspect === "portrait"
        ? "aspect-[5/6]"
        : aspect === "square"
          ? "aspect-[8/7]"
          : "aspect-[4/3]";
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#FFFFF5] dark:bg-surface-dark border border-stone-100 dark:border-stone-800 block ${aspectClass} mb-4 break-inside-avoid`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
        style={{ backgroundImage: `url("${image}")` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
          {label}
        </span>
        <h3 className="text-white text-2xl font-display font-light mb-0 sm:mb-2">{title}</h3>
        <p className="hidden sm:block text-white/50 text-sm font-light leading-relaxed max-w-xs transition-opacity group-hover:text-white/80">
          {description}
        </p>
      </div>
    </div>
  );
}

export function CategoriesSection() {
  const cards: CardProps[] = [
    // Column 1 — 3 cards
    {
      href: "/experience/canvas-painting",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic",
      label: "White Space",
      title: "Canvas Painting",
      description: "The freedom of white space. Express your inner landscape through pigment and movement.",
      aspect: "tall",
    },
    {
      href: "/experience/punch-needle",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631430/IMG_3254_vjcfvh.heic",
      label: "Textured Threads",
      title: "Punch Needle",
      description: "Learn the meditative craft of punch needle embroidery.",
      aspect: "tall",
    },
    {
      href: "/experience/texture-art",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631445/IMG_6955_dacuj6.heic",
      label: "Depth & Light",
      title: "Texture Art",
      description: "Layering light and shadow through the delicate medium of handmade textures.",
      aspect: "tall",
    },
    // Column 2 — 3 cards
    {
      href: "/experience/tote-bag",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636327/IMG_7643_lgemfy.heic",
      label: "Wearable Art",
      title: "Tote Bag",
      description: "Customize eco-friendly tote bags with your own hand-painted designs.",
      aspect: "portrait",
    },
    {
      href: "/experience/pottery",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636416/IMG_8301_b3dqiw.heic",
      label: "Tactile Harmony",
      title: "Pottery",
      description: "Shape earth with your hands, finding rhythm in the circular motion of the wheel.",
      aspect: "portrait",
    },
    {
      href: "/experience/trinket-tray",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631443/IMG_0627_huujuz.heic",
      label: "Mini Masterpiece",
      title: "Trinket Tray Making + Painting",
      description: "Create and paint adorable, functional clay trinket trays for your home.",
      aspect: "square",
    },
    // Column 3 — 3 cards
    {
      href: "/experience/block-print",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631433/IMG_0497_rinstb.heic",
      label: "Rhythmic Patterns",
      title: "Block Print Station",
      description: "Explore traditional block printing to create intricate, repeating patterns.",
      aspect: "tall",
    },
    {
      href: "/experience/clay-mirror",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631396/IMG_5184_h8wfsi.heic",
      label: "Molding Patience",
      title: "Clay Mirror",
      description: "Create intricate cultural designs with clay and mirrors.",
      aspect: "tall",
    },
    {
      href: "/experience/fabric-painting",
      image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631448/IMG_1467_hf5f8c.heic",
      label: "Textile Canvas",
      title: "Fabric Painting",
      description: "Transform plain fabrics into vibrant works of art using specialized fabric paints.",
      aspect: "tall",
    },
  ];

  return (
    <section className="px-4 py-10 md:py-14 lg:px-8 max-w-7xl mx-auto w-full" id="categories">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
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

      {/* 2-column masonry grid on mobile, 3-column on desktop */}
      <div className="columns-2 lg:columns-3 gap-4">
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
