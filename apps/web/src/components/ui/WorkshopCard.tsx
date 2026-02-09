"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Workshop } from "@/data";
import { formatPrice, formatDate } from "@/data";

/* ========================================
   WORKSHOP CARD COMPONENT
   Display upcoming workshop details
======================================== */

interface WorkshopCardProps {
  workshop: Workshop;
  index: number;
  variant?: "default" | "featured";
  className?: string;
  hideFeaturedLayout?: boolean;
}

export function WorkshopCard({ 
  workshop, 
  index, 
  variant = "default", 
  className = "",
  hideFeaturedLayout = false 
}: WorkshopCardProps) {
  const isFeatured = !hideFeaturedLayout && (variant === "featured" || workshop.featured);
  const seatsPercentage = (workshop.availableSeats / workshop.totalSeats) * 100;
  const isLowSeats = seatsPercentage < 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${isFeatured ? "md:col-span-2" : ""} ${className} h-full`}
    >
      <Link
        href={`/events/${workshop.id}`}
        className="group block h-full bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className={`flex flex-col ${isFeatured ? "md:flex-row" : ""} h-full`}>
          {/* Image */}
          <div
            className={`relative overflow-hidden ${
              isFeatured ? "md:w-1/2 min-h-[300px]" : "aspect-[4/3]"
            }`}
          >
            <div className="absolute inset-0 bg-brand-900/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
            <Image
              src={workshop.image}
              alt={workshop.title}
              fill
              sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md text-brand-800 shadow-sm uppercase tracking-wide">
                {workshop.category}
              </span>
            </div>

            {/* Seats Indicator */}
            {isLowSeats && (
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50/90 backdrop-blur-md text-red-600 shadow-sm border border-red-100">
                  Only {workshop.availableSeats} left
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`flex flex-col p-6 md:p-8 ${isFeatured ? "md:w-1/2 md:justify-center bg-brand-50/30" : ""}`}>
            {/* Date & Venue */}
            <div className="flex items-center gap-3 text-sm font-medium text-brand-600 mb-3">
              <div className="flex items-center gap-1.5 bg-brand-100/50 px-2 py-1 rounded-md">
                <CalendarIcon />
                <span>{formatDate(workshop.date)}</span>
              </div>
              <span className="text-brand-300">•</span>
              <span className="text-neutral-500">{workshop.venue}</span>
            </div>

            {/* Title */}
            <h3 className="font-display text-xl md:text-2xl text-neutral-800 mb-3 group-hover:text-brand-700 transition-colors">
              {workshop.title}
            </h3>

            {/* Description */}
            <p className="text-neutral-500 line-clamp-2 mb-6 text-sm leading-relaxed">
              {workshop.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-5 text-sm text-neutral-500 mb-6 pb-6 border-b border-neutral-100/80">
              <div className="flex items-center gap-1.5">
                <div className="text-brand-400"><ClockIcon /></div>
                <span>{workshop.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="text-brand-400"><LocationIcon /></div>
                <span className="truncate max-w-[150px]">{workshop.location.split(",")[0]}</span>
              </div>
            </div>

            {/* Footer: Price & CTA */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-2xl font-display text-neutral-800">
                  {formatPrice(workshop.price)}
                </span>
                <span className="text-xs text-neutral-400 ml-1 font-medium bg-neutral-100 px-1.5 py-0.5 rounded">/ person</span>
              </div>
              <span className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ========================================
   ICON COMPONENTS
======================================== */

function CalendarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
