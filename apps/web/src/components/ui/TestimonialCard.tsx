"use client";

import { motion } from "framer-motion";
import type { Testimonial } from "@/data";

/* ========================================
   TESTIMONIAL CARD COMPONENT
   Display customer review with rating
======================================== */

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card p-6 md:p-8 flex flex-col h-full"
    >
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            filled={i < testimonial.rating}
          />
        ))}
      </div>

      {/* Review Text */}
      <blockquote className="text-body-lg text-neutral-700 leading-relaxed flex-grow mb-6">
        "{testimonial.review}"
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
        {/* Avatar Placeholder */}
        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
          <span className="text-brand-600 font-semibold text-body-lg">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        
        <div>
          <p className="font-semibold text-neutral-900">{testimonial.name}</p>
          <p className="text-body-sm text-neutral-500">{testimonial.workshopType}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ========================================
   STAR ICON COMPONENT
======================================== */

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? "text-amber-400" : "text-neutral-200"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
