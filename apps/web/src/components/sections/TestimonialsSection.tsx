"use client";

import { SectionHeader, TestimonialCard } from "@/components/ui";
import { testimonials } from "@/data";

/* ========================================
   TESTIMONIALS SECTION
   Customer reviews and feedback
======================================== */

export function TestimonialsSection() {
  // Show featured testimonials
  const featuredTestimonials = testimonials.filter((t) => t.featured).slice(0, 3);

  return (
    <section className="py-24 bg-[#fffff1] max-w-screen-2xl mx-auto">
      <div className="container-custom">
        <SectionHeader
          title="What Our Participants Say"
          subtitle="Real experiences from our creative community"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {featuredTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
