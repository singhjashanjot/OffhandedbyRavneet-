"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui";
import { ActionPill } from "@/components/ui/action-pill";

/* ========================================
   GALLERY PREVIEW SECTION
   Visual showcase of past workshops
======================================== */

const galleryImages = [
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic",
    alt: "Art moment",
    className: "h-64",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_2774_zvfqy7.heic",
    alt: "Creative workshop",
    className: "h-96",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_0627_mqmp5e.heic",
    alt: "Making art",
    className: "h-80",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_6955_qypkz3.heic",
    alt: "Offhanded session",
    className: "h-72",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636489/IMG_5521_qdzurw.heic",
    alt: "Workshop creation",
    className: "h-[26rem]",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636488/IMG_5556_swiq5g.heic",
    alt: "Artistic moment",
    className: "h-[18rem]",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636486/IMG_1987_hb6ecj.heic",
    alt: "Creativity",
    className: "h-[22rem]",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636417/IMG_8310_yojqor.heic",
    alt: "Clay craft",
    className: "h-72",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636416/IMG_8301_b3dqiw.heic",
    alt: "Pottery moment",
    className: "h-96",
  },
  {
    src: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636390/IMG_8297_ivhitf.heic",
    alt: "Workshop memory",
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
        <div className="text-center mt-8 flex justify-center">
          <ActionPill href="/gallery">
            View Full Gallery
          </ActionPill>
        </div>
      </div>
    </section>
  );
}
