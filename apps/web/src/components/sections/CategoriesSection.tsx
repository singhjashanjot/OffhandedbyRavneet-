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
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl bg-[#FFFFF5] dark:bg-surface-dark cursor-pointer border border-stone-100 dark:border-stone-800 block ${aspectClass} mb-4`}
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
        <h3 className="text-white text-2xl font-display font-light mb-2">{title}</h3>
        <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs transition-opacity group-hover:text-white/80">
          {description}
        </p>
      </div>
    </Link>
  );
}

export function CategoriesSection() {
  const cards: CardProps[] = [
    // Column 1 — 3 cards
    {
      href: "/experience/pottery-texture",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuKVNovUVJnEUUHB18B1Ypi73XvB9b7xYe_e2eNn7tqGYVhzWHsxqOY7rkikKNJ_0HvpkWyRJ0sMc2glVBu7Pd_RBau-XlUO_1hnWmVC3rHpmBqYS5JHtPaZ7HVSF4qcdc5_qoKHMP4DBUNp5YG-2gzA_0gaqH5TXyylejQ7d2i4DuC9o__DOn10FqwBBndF_zNccccIavt5avRccPSS46zY9B_id2Z8y1MYSUkS6sDSRNaNDHyeQxRyw8nH-SyMWoIid2oMiDqDAR",
      label: "Tactile Harmony",
      title: "Pottery Art Texture",
      description: "Shape earth with your hands, finding rhythm in the circular motion of the wheel.",
      aspect: "tall",
    },
    {
      href: "/experience/punch-needle",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
      label: "Textured Threads",
      title: "Punch Needle",
      description: "Learn the meditative craft of punch needle embroidery.",
      aspect: "tall",
    },
    {
      href: "/experience/cake-painting",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      label: "Edible Canvas",
      title: "Cake Painting",
      description: "Decorate delicious cakes with artistic painting techniques.",
      aspect: "tall",
    },
    // Column 2 — 3 cards
    {
      href: "/experience/canvas-painting",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSCFiZ8evmlz60E4OO6fY8FnCR-OQudvyZbPYjpSah2k_lTA8cFYgdxesyUASWGp0Dv8lpUydzZBoWSAYXcISXxYiNHNPjKwciJCRtyXGBZAzHG1z1u0ytxk9vUWC6OXnTarFw6mQ21LliNGxfER68CodfVLC9HumlIy04xIZc9_seMpIqtCGvBwASCzZ-IofWyJ9hNN353dXQP68-ii-rgGkYwh9vhyX5Cs0N-S4c_1ZG_yJAX5MZlHZ011TOx9lIvOJoZaBYZcVQ",
      label: "White Space",
      title: "Canvas Painting",
      description: "The freedom of white space. Express your inner landscape through pigment and movement.",
      aspect: "portrait",
    },
    {
      href: "/experience/textured-art",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw3b1f7a6lWfdbEgo5tdd_p0R3MrUTulESqHaGtyEps371KiGZiZAHx9v1CQfM_erChYIYj1odYN9NrcODXjFsVllVze91aV9xIKDmPDpZr4saUDlSoYA284Z2ibXwY0CezSugydv3u74HHXlOEwnAXCl5tUAijnm1wdPvzwiczkxoiJfZMGWdz0MEUy89nOmVxb3QN89YfvKWyvTqNjQwO8Y24nX_CRMvE3csMS-wh-dF7lNTTtUR6tvQ1vc7SXISU98pCN9fuiTV",
      label: "Depth & Light",
      title: "Textured Art",
      description: "Layering light and shadow through the delicate medium of handmade papers.",
      aspect: "portrait",
    },
    {
      href: "/experience/bento-cake-painting",
      image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80",
      label: "Mini Masterpiece",
      title: "Bento Cake Painting",
      description: "Create adorable, Instagram-worthy mini bento cakes.",
      aspect: "square",
    },
    // Column 3 — 3 cards (Fluid Art ends here, aligned with Punch Needle in col1)
    {
      href: "/experience/clay-mirror-painting",
      image: "https://images.unsplash.com/photo-1522775559573-2f63d04af08f?w=800&q=80",
      label: "Molding Patience",
      title: "Clay Mirror Painting",
      description: "Create intricate cultural designs with clay and mirrors.",
      aspect: "tall",
    },
    {
      href: "/experience/jute-bag-painting",
      image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800&q=80",
      label: "Sustainable Style",
      title: "Jute Bag Painting",
      description: "Customize eco-friendly jute bags with your own hand-painted designs.",
      aspect: "tall",
    },
    {
      href: "/experience/fluid-art",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
      label: "Mesmerizing Flow",
      title: "Fluid Art",
      description: "Explore mesmerizing flow patterns with acrylic pouring techniques and vibrant colors.",
      aspect: "tall",
    },
  ];

  const col1 = cards.slice(0, 3);
  const col2 = cards.slice(3, 6);
  const col3 = cards.slice(6, 9);

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

      {/* 3-column masonry grid with balanced columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[col1, col2, col3].map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((card) => (
              <Card key={card.title} {...card} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
