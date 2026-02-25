"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

/* ========================================
   GALLERY GRID (Client Component)
   Interactive gallery with category filtering
======================================== */

interface GalleryItem {
  id: string;
  media_url: string;
  media_type: string;
  category: string | null;
  caption: string | null;
  event_type: string | null;
}

interface GalleryGridProps {
  items: GalleryItem[];
  categories: string[];
}

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredItems = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  return (
    <>
      {/* Category Filters */}
      <section className="py-6 bg-brand-50 max-w-screen-2xl mx-auto">
        <div className="container-custom flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={activeCategory === null ? "btn-primary btn-sm" : "btn-secondary btn-sm"}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "btn-primary btn-sm" : "btn-secondary btn-sm"}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 bg-white max-w-screen-2xl mx-auto">
        <div className="container-custom">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredItems.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer"
              >
                <Image
                  src={image.media_url}
                  alt={image.caption || "Gallery image"}
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                  <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="badge-secondary backdrop-blur-sm">
                      {image.category || image.event_type || "Art"}
                    </span>
                    {image.caption && (
                      <p className="text-white text-sm mt-1">{image.caption}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
