import { Header, Footer, FounderSection } from "@/components";
import Image from "next/image";
import type { Metadata } from "next";

/* ========================================
   ABOUT PAGE
   Brand story and team introduction
======================================== */

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Offhanded's mission, our founder Ravneet's story, and why we're passionate about bringing art to everyone.",
};

const stats = [
  { number: "600+", label: "Happy Participants" },
  { number: "50+", label: "Workshops Conducted" },
  { number: "8+", label: "Art Categories" },
  { number: "1+", label: "Year of Magic" },
];

const values = [
  {
    icon: "🧘",
    title: "Mindfulness",
    description: "Every workshop is designed as a meditative experience, helping you find calm through creativity.",
  },
  {
    icon: "🌈",
    title: "Inclusivity",
    description: "No age barriers, no skill requirements. Everyone is welcome to explore and express.",
  },
  {
    icon: "✨",
    title: "Quality",
    description: "Premium venues, top-quality materials, and personalized attention for every participant.",
  },
  {
    icon: "💝",
    title: "Community",
    description: "More than workshops, we build connections and lasting memories.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-24 bg-brand-50 max-w-screen-2xl mx-auto">
          <div className="container-custom text-center">
            <span className="badge-accent mb-4 inline-block">Our Story</span>
            <h1 className="font-display text-display-md md:text-display-lg text-neutral-900 mb-6 text-balance">
              Art That Heals, Creates, and Connects
            </h1>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
              Offhanded was born from a simple belief: everyone deserves a safe space 
              to express themselves creatively, regardless of their background or skill level.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-white border-b border-neutral-100 max-w-screen-2xl mx-auto">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-display-sm md:text-display-md text-brand-600">
                    {stat.number}
                  </div>
                  <div className="text-body-md text-neutral-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <FounderSection />

        {/* Values Section */}
        <section className="py-24 bg-brand-50 max-w-screen-2xl mx-auto">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-display text-display-sm text-neutral-900 mb-4">
                What We Stand For
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="card p-6 text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-display text-heading-sm text-neutral-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-body-md text-neutral-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Image */}
        <section className="relative h-[400px] md:h-[500px] max-w-screen-2xl mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&q=80"
            alt="Art workshop in progress"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <p className="font-display text-display-sm md:text-display-md text-white text-center px-4 max-w-3xl text-balance">
              "Art is not what you see, but what you make others see."
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
