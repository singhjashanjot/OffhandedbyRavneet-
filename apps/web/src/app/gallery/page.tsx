"use client";

import { Header, Footer, SectionHeader } from "@/components";
import Image from "next/image";
import { motion } from "framer-motion";

/* ========================================
   GALLERY PAGE
   Visual showcase of past workshops
======================================== */

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80", alt: "Pottery workshop", category: "Pottery" },
  { src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80", alt: "Canvas painting", category: "Canvas" },
  { src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80", alt: "Acrylic art", category: "Acrylic" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", alt: "Rope art", category: "Rope" },
  { src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", alt: "Cake painting", category: "Cake" },
  { src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80", alt: "Group session", category: "Events" },
  { src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80", alt: "Punch needle", category: "Punch Needle" },
  { src: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80", alt: "Workshop moment", category: "Events" },
  { src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80", alt: "Bento cake", category: "Cake" },
];

export default function GalleryPage() {
  return (
    <>
      <Header />
      
      <main className="pt-24">
        {/* Header Section */}
        <section className="py-24 bg-brand-50 max-w-screen-2xl mx-auto">
          <div className="container-custom">
            <SectionHeader
              title="Our Gallery"
              subtitle="A visual journey through our workshops and the art created by our participants"
            />

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn-primary btn-sm">All</button>
              <button className="btn-secondary btn-sm">Pottery</button>
              <button className="btn-secondary btn-sm">Canvas</button>
              <button className="btn-secondary btn-sm">Cake Art</button>
              <button className="btn-secondary btn-sm">Events</button>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-24 bg-white max-w-screen-2xl mx-auto">
          <div className="container-custom">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={500}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                    <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="badge-secondary backdrop-blur-sm">{image.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
