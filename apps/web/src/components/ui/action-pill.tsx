"use client";

import Link from "next/link";
import React from "react";

interface ActionPillProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ActionPill({ href, children, className = "" }: ActionPillProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-6 rounded-full bg-[#E0E8DE] p-1.5 pl-8 transition-all duration-300 hover:bg-[#D0D9CE] shadow-sm ${className}`}
    >
      <span className="font-display font-medium text-[#2D3E30] text-sm md:text-base tracking-wide">
        {children}
      </span>
      <div className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#2D3E30] text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105 shadow-md">
        <span className="material-symbols-outlined text-lg md:text-xl">arrow_outward</span>
      </div>
    </Link>
  );
}
