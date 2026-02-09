"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { WorkshopCategory } from "@/data";

/* ========================================
   CATEGORY CARD COMPONENT
   Display workshop category with hover effect
======================================== */

interface CategoryCardProps {
  category: WorkshopCategory;
  index: number;
  className?: string;
}

export function CategoryCard({ category, index, className = "" }: CategoryCardProps) {
  return (
    <Link
      href={`/experience/${category.slug}`}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer block h-full w-full ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
         <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
         />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-white text-xl md:text-2xl font-bold mb-1 drop-shadow-md">
          {category.name}
        </h3>
        <p className="text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 drop-shadow-sm line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
