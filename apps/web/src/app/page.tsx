import {
  Header,
  Footer,
  HeroSection,
  CategoriesSection,
  UpcomingWorkshopsSection,

  GalleryPreviewSection,
  TestimonialsSection,
  FounderSection,
  CTASection,
} from "@/components";
import { BrandMarquee } from "@/components/ui/BrandMarquee";

/* ========================================
   HOME PAGE
   Landing page for Offhanded
======================================== */

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main>
        {/* Hero - Brand intro with CTA */}
        <HeroSection />

        {/* Brand Partners */}
        <BrandMarquee />

        {/* Workshop Categories - Art styles offered */}
        <CategoriesSection />

        {/* Upcoming Workshops - Featured sessions */}
        <UpcomingWorkshopsSection />



        {/* Gallery Preview - Past workshop visuals */}
        <GalleryPreviewSection />

        {/* Testimonials - Customer reviews */}
        <TestimonialsSection />

        {/* Founder Story - Brand narrative */}
        <FounderSection />

        {/* CTA - Final conversion push */}
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
