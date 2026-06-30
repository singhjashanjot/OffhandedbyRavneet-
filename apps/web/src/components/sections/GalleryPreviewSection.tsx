"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui";

/* ========================================
   GALLERY PREVIEW SECTION
   Visual showcase of past workshops
======================================== */

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
    alt: "Pottery workshop in progress",
    className: "h-64",
  },
  {
    src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
    alt: "Canvas painting session",
    className: "h-96",
  },
  {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    alt: "Acrylic art creation",
    className: "h-80",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    alt: "Rope art workshop",
    className: "h-72",
  },
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    alt: "Cake decoration class",
    className: "h-[26rem]",
  },
  {
    src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
    alt: "Group workshop session",
    className: "h-[18rem]",
  },
  {
    src: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80",
    alt: "Painting setup",
    className: "h-[22rem]",
  },
  {
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
    alt: "Art gallery display",
    className: "h-72",
  },
  {
    src: "https://images.unsplash.com/photo-1459908676235-8cb9336604f0?w=400&q=80",
    alt: "Crafting session",
    className: "h-96",
  },
  {
    src: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=400&q=80",
    alt: "Colorful painting",
    className: "h-80",
  },
];

export function GalleryPreviewSection() {
  return (
    <section className="mt-20 md:mt-32 pt-20 md:pt-28 pb-10 md:pb-14 bg-[#fffff1] max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div>
        <SectionHeader
          title="Moments We've Captured"
          subtitle="A glimpse into the creative journeys shared at our workshops"
        />

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl group break-inside-avoid w-full mb-4 ${image.className}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-8">
          <Link href="/gallery" className=" bg-[#fffff5] btn-secondary">
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
