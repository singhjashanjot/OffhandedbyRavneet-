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
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
    alt: "Canvas painting session",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    alt: "Acrylic art creation",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    alt: "Rope art workshop",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    alt: "Cake decoration class",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
    alt: "Group workshop session",
    span: "col-span-2 row-span-1",
  },
];

export function GalleryPreviewSection() {
  return (
    <section className="py-24 bg-[#fffff1] max-w-screen-2xl mx-auto">
      <div className="container-custom">
        <SectionHeader
          title="Moments We've Captured"
          subtitle="A glimpse into the creative journeys shared at our workshops"
        />

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-[200px] md:auto-rows-[250px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl group ${image.span}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link href="/gallery" className="btn-secondary">
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
