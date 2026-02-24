import { Header, Footer, SectionHeader } from "@/components";
import Image from "next/image";
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
  description: "A visual journey through our workshops and the art created by our participants.",
};

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  // Extract unique categories for filter buttons
  const categories = Array.from(
    new Set(galleryItems.map((item: any) => item.category).filter(Boolean))
  );

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
          </div>
        </section>

        {/* Gallery Grid - Client component for interactivity (filtering) */}
        <GalleryGrid items={galleryItems} categories={categories as string[]} />
      </main>

      <Footer />
    </>
  );
}
