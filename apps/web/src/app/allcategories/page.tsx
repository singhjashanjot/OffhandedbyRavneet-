"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Newsreader } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["italic", "normal"],
  adjustFontFallback: false,
});

/* ========================================
   ART CATEGORIES DATA
   18 categories for pagination (6 per page = 3 pages)
======================================== */
const artCategories = [
  {
    id: 1,
    title: "Canvas Painting",
    slug: "canvas-painting",
    description: "The freedom of white space. Express your inner landscape through pigment and movement on canvas.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSCFiZ8evmlz60E4OO6fY8FnCR-OQudvyZbPYjpSah2k_lTA8cFYgdxesyUASWGp0Dv8lpUydzZBoWSAYXcISXxYiNHNPjKwciJCRtyXGBZAzHG1z1u0ytxk9vUWC6OXnTarFw6mQ21LliNGxfER68CodfVLC9HumlIy04xIZc9_seMpIqtCGvBwASCzZ-IofWyJ9hNN353dXQP68-ii-rgGkYwh9vhyX5Cs0N-S4c_1ZG_yJAX5MZlHZ011TOx9lIvOJoZaBYZcVQ",
  },
  {
    id: 2,
    title: "Textured Art",
    slug: "textured-art",
    description: "Layering light and shadow through the delicate medium of handmade papers and mixed media.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw3b1f7a6lWfdbEgo5tdd_p0R3MrUTulESqHaGtyEps371KiGZiZAHx9v1CQfM_erChYIYj1odYN9NrcODXjFsVllVze91aV9xIKDmPDpZr4saUDlSoYA284Z2ibXwY0CezSugydv3u74HHXlOEwnAXCl5tUAijnm1wdPvzwiczkxoiJfZMGWdz0MEUy89nOmVxb3QN89YfvKWyvTqNjQwO8Y24nX_CRMvE3csMS-wh-dF7lNTTtUR6tvQ1vc7SXISU98pCN9fuiTV",
  },
  {
    id: 3,
    title: "Clay Mirror Painting",
    slug: "clay-mirror-painting",
    description: "Create intricate cultural designs combining clay and mirrors for stunning decorative pieces.",
    image: "https://images.unsplash.com/photo-1522775559573-2f63d04af08f?w=800&q=80",
  },
  {
    id: 4,
    title: "Lippan Art",
    slug: "lippan-art",
    description: "Traditional Kutchi mud and mirror work creating mesmerizing geometric patterns.",
    image: "https://images.unsplash.com/photo-1596568809289-a0ded1ff6cd2?w=800&q=80",
  },
  {
    id: 5,
    title: "Tote Bag Painting",
    slug: "tote-bag-painting",
    description: "Customize eco-friendly tote bags with your own hand-painted artistic designs.",
    image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800&q=80",
  },
  {
    id: 6,
    title: "Fluid Art",
    slug: "fluid-art",
    description: "Explore mesmerizing flow patterns with acrylic pouring techniques and vibrant colors.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
  },
  {
    id: 7,
    title: "Aztec Mask Painting",
    slug: "aztec-mask-painting",
    description: "Channel ancient Mesoamerican artistry through bold, symbolic mask designs.",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
  },
  {
    id: 8,
    title: "Tissue Art",
    slug: "tissue-art",
    description: "Transform delicate tissues into stunning 3D art pieces with layering techniques.",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&q=80",
  },
  {
    id: 9,
    title: "Punch Needle",
    slug: "punch-needle",
    description: "Learn the meditative craft of punch needle embroidery to create textured masterpieces.",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
  },
  {
    id: 10,
    title: "Glass Painting",
    slug: "glass-painting",
    description: "Paint luminous designs on glass surfaces, creating stunning light-catching artwork.",
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80",
  },
  {
    id: 11,
    title: "Fabric Painting",
    slug: "fabric-painting",
    description: "Express creativity on fabric with specialized paints for wearable and decorative art.",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
  },
  {
    id: 12,
    title: "DIY Moon Painting",
    slug: "diy-moon-painting",
    description: "Capture celestial beauty with dreamy lunar-inspired painting techniques.",
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&q=80",
  },
  {
    id: 13,
    title: "Canvas Pouch Painting",
    slug: "canvas-pouch-painting",
    description: "Design unique canvas pouches with personalized hand-painted artwork.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
  },
  {
    id: 14,
    title: "Trinket Trays",
    slug: "trinket-trays",
    description: "Craft beautifully decorated trays perfect for organizing small treasures.",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80",
  },
  {
    id: 15,
    title: "Pot Painting",
    slug: "pot-painting",
    description: "Transform terracotta pots into vibrant garden art with creative designs.",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
  },
  {
    id: 16,
    title: "Cap Painting",
    slug: "cap-painting",
    description: "Customize caps with unique hand-painted designs for personalized fashion.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
  },
  {
    id: 17,
    title: "Gold Foil Painting",
    slug: "gold-foil-painting",
    description: "Add luxurious gold leaf accents to create opulent, gallery-worthy pieces.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  },
  {
    id: 18,
    title: "Rope on Canvas Painting",
    slug: "rope-on-canvas-painting",
    description: "Combine textured rope with paint for unique, dimensional canvas artwork.",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
  },
];

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(artCategories.length / ITEMS_PER_PAGE);

/* ========================================
   CATEGORY CARD COMPONENT
======================================== */
function CategoryCard({ category, index }: { category: typeof artCategories[0]; index: number }) {
  // Staggered margin for visual interest
  const marginClass = index % 3 === 0 ? "mt-0" : index % 3 === 1 ? "mt-[80px]" : "mt-[40px]";
  const displayNumber = String(category.id).padStart(2, "0");

  return (
    <Link
      href={`/experience/${category.slug}`}
      className={`flex flex-col gap-6 ${marginClass} group cursor-pointer`}
    >
      <div className="border-b border-[#B2C0AD] pb-6 relative">
        <span className="text-6xl font-extralight text-[#2D3E30]/10 absolute -top-10 -left-2 select-none group-hover:text-[#B2C0AD]/30 transition-colors">
          {displayNumber}
        </span>
        <div className="w-full aspect-[4/5] bg-[#2D3E30]/5 rounded mb-6 overflow-hidden">
          <img
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            src={category.image}
            alt={category.title}
          />
        </div>
        <h3 className="text-2xl font-semibold text-[#2D3E30] mb-3">{category.title}</h3>
        <p className="text-[#2D3E30]/60 text-sm leading-relaxed mb-6">
          {category.description}
        </p>
        <span className="bg-[#2D3E30] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded group-hover:bg-[#3e3b2d] transition-colors inline-block">
          View Workshop
        </span>
      </div>
    </Link>
  );
}

/* ========================================
   PAGINATION COMPONENT
======================================== */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3 mt-20">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium uppercase tracking-widest transition-all duration-300 ${
          currentPage === 1
            ? "border-[#B2C0AD]/30 text-[#2D3E30]/30 cursor-not-allowed"
            : "border-[#2D3E30] text-[#2D3E30] hover:bg-[#2D3E30] hover:text-white"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-12 h-12 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              currentPage === page
                ? "bg-[#2D3E30] text-white"
                : "bg-transparent text-[#2D3E30] hover:bg-[#B2C0AD]/20 border border-[#B2C0AD]/50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium uppercase tracking-widest transition-all duration-300 ${
          currentPage === totalPages
            ? "border-[#B2C0AD]/30 text-[#2D3E30]/30 cursor-not-allowed"
            : "border-[#2D3E30] text-[#2D3E30] hover:bg-[#2D3E30] hover:text-white"
        }`}
      >
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

/* ========================================
   MAIN PAGE COMPONENT
======================================== */
export default function AllCategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate which categories to display on the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCategories = artCategories.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= TOTAL_PAGES) {
      setCurrentPage(page);
      // Scroll to top of grid smoothly
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <div className={`${newsreader.variable} font-display min-h-screen bg-[#fffff1] text-[#2D3E30] selection:bg-[#B2C0AD]/30 relative overflow-x-hidden`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rotate-12 pointer-events-none opacity-15 z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.3,-44.7C85.4,-31.3,90.5,-15.7,89.7,-0.5C88.8,14.7,82,29.3,73.1,42.5C64.2,55.7,53.2,67.4,39.8,75.1C26.4,82.8,10.6,86.5,-4.4,84C-19.4,81.5,-33.6,72.8,-46.6,62.8C-59.5,52.8,-71.2,41.4,-77.8,27.7C-84.4,14,-85.9,-1.9,-82.9,-16.9C-79.9,-31.9,-72.4,-46.1,-61,-55.4C-49.6,-64.7,-34.3,-69.1,-20.1,-75.4C-5.9,-81.7,7.1,-89.9,23.5,-87.3C39.9,-84.7,59.7,-71.3,44.7,-76.4Z" fill="currentColor" transform="translate(100 100)"></path>
        </svg>
      </div>
      <div className="absolute bottom-40 right-10 w-96 h-96 -rotate-45 pointer-events-none opacity-15 z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M37.5,-63.1C48.1,-56.9,56.1,-46.3,62.4,-34.6C68.8,-22.8,73.4,-10,72.6,2.5C71.8,15,65.6,27.3,57.1,38.1C48.6,48.9,37.8,58.3,25.3,63.9C12.8,69.5,-1.3,71.4,-15.8,68.9C-30.3,66.3,-45.1,59.3,-56.5,48.6C-67.8,37.9,-75.6,23.5,-78.2,8.2C-80.8,-7.2,-78.1,-23.4,-69.7,-36.8C-61.4,-50.2,-47.4,-60.7,-33.4,-65.2C-19.4,-69.7,-5.4,-68.2,6.8,-79.9C19,-91.6,37.5,-63.1,37.5,-63.1Z" fill="currentColor" transform="translate(100 100)"></path>
        </svg>
      </div>

      <div className="relative flex h-auto min-h-screen w-full flex-col font-display overflow-x-hidden">
        <Header />
        <div className="flex h-full grow flex-col">
          
          {/* Main Editorial Content */}
          <main className="flex flex-1 flex-col items-center px-6 lg:px-20 pb-20 relative z-10 w-full">
            
            {/* Hero Heading Section */}
            <div className="max-w-4xl w-full text-center pt-[180px] pb-16 md:pb-24">
              <p className="text-[#B2C0AD] font-medium uppercase tracking-[0.3em] text-[10px] mb-4">Volume III — The Art Direction</p>
              <h1 className="text-[#2D3E30] text-6xl md:text-8xl font-light leading-[0.9] tracking-tighter mb-6 italic">
                The Curator's List
              </h1>
              <div className="h-px w-24 bg-[#2D3E30]/20 mx-auto mb-8"></div>
              <p className="text-[#2D3E30]/60 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto italic">
                An editorial directory of eighteen masterful art experiences, meticulously selected for the discerning creator.
              </p>
            </div>

            {/* Staggered Grid Container */}
            <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {currentCategories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onPageChange={handlePageChange}
            />

            {/* Footer Callout */}
            <div className="mt-40 text-center">
              <p className="text-[#2D3E30]/30 text-xs uppercase tracking-[0.4em] mb-4">Discovery Continues</p>
              <div className="flex items-center justify-center gap-4">
  
              </div>
            </div>

          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
