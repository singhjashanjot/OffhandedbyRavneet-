"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

/* ========================================
   PRODUCTS SECTION
   Parallax slide-up reveal + custom order CTA.
======================================== */

const featuredProducts = [
  { id: 1, name: "Artisan Mug Set", category: "Handmade Ceramics", price: "1,299", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80" },
  { id: 2, name: "Premium Paint Kit", category: "Art Kits", price: "2,499", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80" },
  { id: 3, name: "Gold Fine Liners", category: "Fine Liners", price: "899", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80" },
  { id: 4, name: "Linen Sketchbook", category: "Sketchbooks", price: "1,099", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 5, name: "Punch Needle Frame", category: "Art Kits", price: "1,899", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80" },
  { id: 6, name: "Ceramic Vase Set", category: "Handmade Ceramics", price: "2,199", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
];

function ProductCard({ product }: { product: (typeof featuredProducts)[0] }) {
  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white/10">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${product.image}")` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mt-3 flex flex-col gap-0.5">
        <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">{product.category}</p>
        <h3 className="font-display text-white text-sm font-medium leading-snug">{product.name}</h3>
        <span className="font-sans text-white/80 text-sm font-semibold mt-0.5">₹{product.price}</span>
      </div>
    </div>
  );
}

function CustomOrderCard() {
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (description.trim()) { setSubmitted(true); setDescription(""); setTimeout(() => setSubmitted(false), 4000); } };

  return (
    <div className="relative mt-10 md:mt-14">
      <div className="relative max-w-xl mx-auto text-center">
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/70 text-2xl">palette</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[10px]">brush</span>
            </div>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-display font-light text-white mb-2">Have Something Unique in Mind?</h3>
        <p className="text-white/50 text-sm font-light max-w-md mx-auto leading-relaxed">Want a custom-made piece? Share your vision and our artists will bring it to life within 24 hours.</p>
        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto mt-4">
          <div className="relative bg-white/10 border border-white/20 rounded-2xl overflow-hidden focus-within:border-white/40 transition-all">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your dream piece..." rows={2} className="w-full bg-transparent text-white placeholder-white/30 px-4 pt-3 pb-2 text-sm font-light leading-relaxed resize-none focus:outline-none" />
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="text-white/30 text-[10px] flex items-center gap-1"><span className="material-symbols-outlined text-xs">schedule</span> 24hr response</span>
              <button type="submit" disabled={!description.trim()} className="bg-white text-[#2B3B2E] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 disabled:opacity-40 transition-all">Send</button>
            </div>
          </div>
          {submitted && <p className="mt-3 text-green-400 text-xs flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> We will reach out soon!</p>}
        </form>
        <div className="flex items-center justify-center gap-5 mt-6 text-white/30 text-[9px] uppercase tracking-widest">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">verified</span> Expert Artists</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">local_shipping</span> Pan-India</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">handshake</span> With Love</span>
        </div>
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-28 pb-8 md:pb-12">
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
            <Link href="/products" className="inline-flex items-center gap-2 text-white/80 font-medium hover:text-white transition-all group text-sm">
              <span className="uppercase tracking-widest">View all products</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-base">east</span>
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Custom Order Section */}
          <CustomOrderCard />
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
          className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-28 pb-8 md:pb-12"
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
            <Link href="/products" className="inline-flex items-center gap-2 text-white/80 font-medium hover:text-white transition-all group text-sm">
              <span className="uppercase tracking-widest">View all products</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-base">east</span>
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Custom Order Section */}
          <CustomOrderCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
