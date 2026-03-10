import { Header, Footer } from "@/components";
import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/queries/gallery";
import { GalleryGrid } from "./GalleryGrid";

/* ========================================
   GALLERY PAGE
   Visual showcase of past workshops
   Server Component — fetches from Supabase
======================================== */

export const metadata: Metadata = {
  title: "Gallery | Offhanded",
  description:
    "A visual journey through our workshops and the art created by our participants.",
};

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  const categories = Array.from(
    new Set(galleryItems.map((item: any) => item.category).filter(Boolean))
  );

  return (
    <>
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-24">
          <h2 className="font-display font-light text-5xl lg:text-7xl tracking-tight text-[#2D3E30] mb-6">
            Moments in Motion
          </h2>
          <div className="h-px w-24 bg-brand-300 mb-6" />
          <p className="max-w-xl font-sans text-lg text-[#2D3E30]/70 font-light leading-relaxed">
            A curated selection of the art of the moment. Captured through the
            lens of stillness and the tactile rhythm of clay.
          </p>
        </section>

        {/* Gallery Grid */}
        <GalleryGrid
          items={galleryItems}
          categories={categories as string[]}
        />
      </main>

      <Footer />
    </>
  );
}
