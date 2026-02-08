"use client";

import { motion } from "framer-motion";

/* ========================================
   SECTION HEADER COMPONENT
   Reusable section title with subtitle
======================================== */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 md:mb-16 ${centered ? "text-center" : ""} ${className}`}
    >
      <h2 className="font-display text-display-sm md:text-display-md text-neutral-900 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-body-lg text-neutral-500 max-w-2xl mx-auto text-balance">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
