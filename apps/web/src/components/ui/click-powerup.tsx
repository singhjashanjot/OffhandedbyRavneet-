"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export const ClickPowerUp = ({
  children,
  className,
  tapDuration = 500,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  tapDuration?: number;
  onClick?: () => void;
}) => {
  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    if (isTapped) return;
    setIsTapped(true);
    if (onClick) onClick();
    setTimeout(() => setIsTapped(false), tapDuration);
  };

  const state = isTapped ? "tap" : "rest";

  return (
    <motion.div
      initial="rest"
      animate={state}
      whileHover={isTapped ? "tap" : "hover"}
      onTap={handleTap}
      className="relative inline-block cursor-pointer [--pattern:#2D3E30]"
    >
      {/* Corner brackets */}
      {[
        {
          corner: "top-right",
          cls: "absolute top-0 right-0 size-2 border-t border-r z-20",
        },
        {
          corner: "top-left",
          cls: "absolute top-0 left-0 size-2 border-t border-l z-20",
        },
        {
          corner: "bottom-left",
          cls: "absolute bottom-0 left-0 size-2 border-b border-l z-20",
        },
        {
          corner: "bottom-right",
          cls: "absolute right-0 bottom-0 size-2 border-r border-b z-20",
        },
      ].map(({ corner, cls }) => (
        <motion.div
          key={corner}
          custom={corner}
          variants={{
            rest: (c: string) => ({ 
              x: c.includes("right") ? 2 : -2, 
              y: c.includes("bottom") ? 2 : -2, 
              borderColor: "rgb(38 38 38)" 
            }),
            hover: (c: string) => ({
              x: c.includes("right") ? 5 : -5,
              y: c.includes("bottom") ? 5 : -5,
              borderColor: "rgb(38 38 38)",
            }),
            tap: (c: string) => ({
              x: c.includes("right") ? -1 : 1,
              y: c.includes("bottom") ? -1 : 1,
              borderColor: "rgb(38 38 38)",
            }),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cls}
        />
      ))}

      <button
        className={`relative overflow-hidden px-6 py-2.5 sm:px-10 sm:py-3 font-medium uppercase bg-[#2D3E30] ${className || ""}`}
      >
        {/* Arm panel */}
        <motion.span
          variants={{
            rest: { scaleX: 0, originX: 0, backgroundColor: "#3D4E40" },
            hover: { scaleX: 1, originX: 0, backgroundColor: "#3D4E40" },
            tap: { scaleX: 1, originX: 0, backgroundColor: "#1e2920" },
          }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="absolute inset-0 z-10 origin-left"
        />

        {/* Text */}
        <span className="relative z-20 text-white">
          {children}
        </span>
      </button>
    </motion.div>
  );
};

export default ClickPowerUp;
