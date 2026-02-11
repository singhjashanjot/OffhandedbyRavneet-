"use client";

import { SectionHeader, WorkshopCard } from "@/components";
import { upcomingWorkshops } from "@/data";
import Link from "next/link";

export function UpcomingWorkshopsSection() {
  const featuredWorkshops = upcomingWorkshops.slice(0, 3);

  return (
    <section className="py-24 bg-[#fffff1] max-w-screen-2xl mx-auto">
      <div className="container-custom">
        <SectionHeader
          title="Upcoming Workshops"
          subtitle="Join us for an immersive art experience. No prior experience needed."
        />

        {/* Bento Grid Layout: 
            Desktop: 3 columns.
            - Card 1 (Idx 0): Top Left (Span 2 cols)
            - Card 2 (Idx 1): Right (Span 1 col, Span 2 rows)
            - Card 3 (Idx 2): Bottom Left (Span 2 cols)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredWorkshops.map((workshop, index) => {
             let gridClass = "";
             let hideFeatured = false;
             let forceFeatured = false;

             if (index === 0) {
              // 1st card: Left, Wide
              gridClass = "md:col-span-2 lg:col-span-2";
              // Ideally featured layout (horizontal) for width
              forceFeatured = true;
             } else if (index === 1) {
              // 2nd card: Right, Tall (2 rows)
              gridClass = "md:col-span-1 lg:col-span-1 lg:row-span-2";
              // Must be vertical layout (not featured style)
              hideFeatured = true;
             } else if (index === 2) {
              // 3rd card: Bottom Left, Wide
              gridClass = "md:col-span-2 lg:col-span-2";
              // Ideally featured layout (horizontal) for width
              forceFeatured = true;
             }

             return (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                index={index}
                className={gridClass}
                hideFeaturedLayout={hideFeatured}
                variant={forceFeatured ? "featured" : undefined}
              />
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/workshops" className="btn-secondary">
            View All Workshops
          </Link>
        </div>
      </div>
    </section>
  );
}
