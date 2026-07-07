"use client";

import React, { useEffect, useRef, useState } from "react";

// Artist-curated premium paint colors matching the brand's aesthetic
const PAINT_COLORS = [
  "#86947f", // Sage Green (Brand 500)
  "#C87A53", // Terracotta
  "#D9A05B", // Ochre / Warm Gold
  "#5F7D95", // Slate Blue / Indigo
  "#B07C9E", // Dusty Rose
];

export function PaintbrushCursor() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const colorIndexRef = useRef(0);

  // 1. Mount effect to check environment and screen size
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  // 2. Bind listeners effect (runs only after DOM element is rendered on desktop)
  useEffect(() => {
    if (!mounted || isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Apply cursor-none to body
    document.documentElement.classList.add("custom-cursor-active");

    // Track mouse position instantly
    let hasMoved = false;
    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!hasMoved) {
        cursor.style.opacity = "1";
        hasMoved = true;
      }
    };

    // Cycle paint colors on click, trigger squash animation, and paint splatter
    const onMouseDown = (e: MouseEvent) => {
      cursor.classList.add("cursor-clicked");

      // Cycle color
      colorIndexRef.current = (colorIndexRef.current + 1) % PAINT_COLORS.length;
      const nextColor = PAINT_COLORS[colorIndexRef.current];
      cursor.style.setProperty("--paint-color", nextColor);

      // Create paint splatter effect at the tip of the paintbrush (e.clientX, e.clientY)
      createPaintSplatter(e.clientX, e.clientY, nextColor);
    };

    const onMouseUp = () => {
      cursor.classList.remove("cursor-clicked");
    };

    // Handle interactive hover states and hide custom cursor over inputs
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = target.closest(
        'a, button, select, input[type="submit"], input[type="button"], .cursor-pointer, [role="button"]'
      );
      const isInput = target.closest('input, textarea, [contenteditable="true"]');

      if (isInput) {
        cursor.classList.add("cursor-hidden");
      } else {
        cursor.classList.remove("cursor-hidden");
        if (isInteractive) {
          cursor.classList.add("cursor-interactive");
        } else {
          cursor.classList.remove("cursor-interactive");
        }
      }
    };

    // Hide custom cursor when mouse leaves the window
    const onMouseLeave = () => {
      cursor.style.opacity = "0";
    };

    const onMouseEnter = () => {
      cursor.style.opacity = "1";
    };

    // DOM-based high-performance watercolor splatter particle generation
    const createPaintSplatter = (x: number, y: number, color: string) => {
      const splatter = document.createElement("div");
      splatter.className = "paint-splatter-effect";
      splatter.style.left = `${x}px`;
      splatter.style.top = `${y}px`;
      splatter.style.setProperty("--paint-color", color);

      // Generate 6 organic watercolor splash drops
      for (let i = 0; i < 6; i++) {
        const drop = document.createElement("div");
        drop.className = "paint-drop";

        // Distribute in a full circle with randomized distances and sizes
        const angle = Math.random() * Math.PI * 2;
        const distance = 8 + Math.random() * 22;
        const size = 3 + Math.random() * 5;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        drop.style.setProperty("--tx", `${tx}px`);
        drop.style.setProperty("--ty", `${ty}px`);

        splatter.appendChild(drop);
      }

      document.body.appendChild(splatter);

      // Remove splatter element from DOM after transition completes
      setTimeout(() => {
        splatter.remove();
      }, 550);
    };

    // Bind event listeners
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Cleanup listeners and styles
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mounted, isMobile]);

  if (!mounted || isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-paintbrush-cursor"
      style={{ "--paint-color": PAINT_COLORS[0] } as React.CSSProperties}
    >
      <div className="custom-paintbrush-inner">
        {/* Modern high-fidelity paintbrush SVG (tip is at coordinate 0,0) */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Metallic reflection for the ferrule */}
            <linearGradient id="ferrule-grad" x1="12" y1="12" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="30%" stopColor="#f8fafc" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            
            {/* Shading for the handle to make it 3D rounded (site matching sage-forest palette) */}
            <linearGradient id="handle-grad" x1="17" y1="17" x2="45" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2D3E30" />     {/* Offhanded Forest */}
              <stop offset="40%" stopColor="#3D5341" />    {/* Light reflection */}
              <stop offset="80%" stopColor="#1E2B20" />    {/* Shadowed green */}
              <stop offset="100%" stopColor="#141D15" />
            </linearGradient>

            {/* Bristles hair texture base gradient */}
            <linearGradient id="bristles-grad" x1="0" y1="0" x2="15" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F2EFE9" />    {/* Soft warm cream */}
              <stop offset="100%" stopColor="#D6D2C4" />  {/* Shadowed beige */}
            </linearGradient>
          </defs>

          {/* Brush Handle (tapers down elegantly, thicker near ferrule) */}
          <path
            d="M 17 20 L 20 17 L 43.5 40.5 C 44.3 41.3, 44.3 42.7, 43.5 43.5 C 42.7 44.3, 41.3 44.3, 40.5 43.5 Z"
            fill="url(#handle-grad)"
            stroke="#1b2a1f"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          
          {/* Handle highlight stroke for 3D depth */}
          <path
            d="M 19 18 L 41.5 40.5"
            stroke="#86947f"
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Ferrule (Metal collar with ridges matching crimped style) */}
          <path
            d="M 12 15 L 15 12 L 20 17 L 17 20 Z"
            fill="url(#ferrule-grad)"
            stroke="#475569"
            strokeWidth="0.8"
          />
          {/* Ferrule crimping ridges */}
          <path d="M 14.5 17.5 C 15.5 17.5, 16.5 16.5, 17.5 15.5" stroke="#475569" strokeWidth="0.6" />
          <path d="M 16 19 C 17 19, 18 18, 19 17" stroke="#334155" strokeWidth="0.8" />
          <path d="M 13 16 C 14 16, 15 15, 16 14" stroke="#94a3b8" strokeWidth="0.6" />

          {/* Bristles Base Shape (full fluffy rounded tip) */}
          <path
            d="M 0 0 C 3 8, 7 13, 11 16 L 16 11 C 13 7, 8 3, 0 0 Z"
            fill="url(#bristles-grad)"
            stroke="#8c857b"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Bristle details / individual hair lines */}
          <path d="M 2 3 C 4 7, 7 10, 12 12.5" stroke="#a39c94" strokeWidth="0.5" strokeLinecap="round" opacity="0.75" />
          <path d="M 3 2 C 7 4, 10 7, 12.5 12" stroke="#a39c94" strokeWidth="0.5" strokeLinecap="round" opacity="0.75" />
          <path d="M 1 5 C 3 9, 6 11, 10.5 13.5" stroke="#8c857b" strokeWidth="0.4" strokeLinecap="round" opacity="0.5" />
          <path d="M 5 1 C 9 3, 11 6, 13.5 10.5" stroke="#8c857b" strokeWidth="0.4" strokeLinecap="round" opacity="0.5" />

          {/* Paint Dip Tip (wet paint effect that blends overlay) */}
          <path
            d="M 0 0 C 1.8 4.8, 4.8 7.8, 8 10 L 10 8 C 7.8 4.8, 4.8 1.8, 0 0 Z"
            fill="var(--paint-color, #86947f)"
            opacity="0.9"
            style={{ mixBlendMode: "multiply" }}
          />
          {/* Glossy highlight on wet paint tip */}
          <path
            d="M 1 2 C 2 3, 3 3.5, 4 4"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
      </div>
    </div>
  );
}
