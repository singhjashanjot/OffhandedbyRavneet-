"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";



/* ========================================
   HEADER COMPONENT
   Floating island design based on user request
======================================== */

export function Header() {
  const pathname = usePathname() ?? "";
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header if scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide header if scrolling down and past 100px
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  // Navigation Items Mapping
  const navItems = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/workshops", label: "Workshops", icon: "grid_view" }, // Mapped from 'Work'
    { href: "/gallery", label: "Gallery", icon: "gallery_thumbnail" }, // Mapped from 'Gallery'
    { href: "/about", label: "About", icon: "person" }, // Mapped from 'About'
  ];

  return (
    <>
      <header 
        className={`fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-transform duration-500 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-[200px]"}`}
      >
        
        {/* Main Floating Island */}
        <div className="pointer-events-auto flex items-center justify-between gap-4 bg-[#fffff1]/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5 rounded-full px-2 py-2 md:px-3 md:py-2.5 transition-all duration-300 hover:shadow-2xl hover:bg-[#fffff1]/90 hover:scale-[1.01]">
            
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center px-4 py-1.5 border-r border-[#141514]/10 hover:opacity-80 transition-opacity">
               <img 
                 src="https://res.cloudinary.com/daoho0jwj/image/upload/v1770430209/Offhanded_transparent_Black_1_tkvdt8.png" 
                 alt="Offhanded Logo" 
                 className="h-6 w-auto object-contain" 
               />
            </Link>

            {/* Center: Navigation Links */}
            <nav className="flex items-center gap-1 md:gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300
                      ${isActive 
                        ? "bg-[#2D3E30] text-white shadow-md shadow-[#4E342E]/20" 
                        : "text-[#141514]/70 hover:bg-[#141514]/5 hover:text-[#141514]"
                      }
                    `}
                  >
                    {/* Icon */}
                    <span 
                        className={`material-symbols-outlined text-[20px] ${isActive ? "font-normal" : "font-light"}`}
                        style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
                    >
                      {item.icon}
                    </span>
                    
                    {/* Label (Hidden on mobile generally, or shown if room permits - keeping minimal icons on mobile usually better, but snippet implies text in tooltip/label. I'll show text on active or hover for desktop) */}
                    <span className={`text-xs font-medium hidden md:block ${isActive ? "block" : "hidden group-hover:block"}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>


        </div>

      </header>
    </>
  );
}
