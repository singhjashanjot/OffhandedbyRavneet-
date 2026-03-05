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
import { getUpcomingWorkshops } from "@/lib/queries/workshops";
import { getFeaturedReviews } from "@/lib/queries/reviews";
import { dbToWorkshops } from "@/lib/adapters";

/* ========================================
   HOME PAGE
   Landing page for Offhanded
   Server Component — fetches data on server
======================================== */

export default async function HomePage() {
  // Fetch data from Supabase (server-side) with error handling
  let dbWorkshops = [];
  let dbReviews = [];

  try {
    [dbWorkshops, dbReviews] = await Promise.all([
      getUpcomingWorkshops(6),
      getFeaturedReviews(),
    ]);
  } catch (error) {
    console.error("Error fetching data for homepage:", error);
    // Continue with empty arrays - page will still render
  }

  // Transform DB workshops to frontend Workshop type
  const workshops = dbToWorkshops(dbWorkshops);

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

        {/* Upcoming Workshops - From Supabase DB */}
        <UpcomingWorkshopsSection workshops={workshops} />

        {/* Gallery Preview - Past workshop visuals */}
        <GalleryPreviewSection />

        {/* Testimonials - Customer reviews from DB */}
        <TestimonialsSection dbReviews={dbReviews} />

        {/* Founder Story - Brand narrative */}
        <FounderSection />

        {/* CTA - Final conversion push */}
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
