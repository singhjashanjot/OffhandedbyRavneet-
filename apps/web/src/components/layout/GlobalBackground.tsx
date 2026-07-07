"use client";

import { usePathname } from "next/navigation";

export function GlobalBackground() {
  const pathname = usePathname();

  // Do not render the global background on the Home page
  if (pathname === "/") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Canvas Texture Background */}
      <div
        className="absolute inset-0 opacity-[0.72] bg-cover bg-center bg-no-repeat mix-blend-multiply"
        style={{ backgroundImage: 'url("/about-bg.jpg")' }}
      />
      
      {/* Vignette Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(80% 60%, transparent 40%, rgba(255, 255, 230, 0.55) 100%)' }}
      />

      {/* Breathing Sage Green Orbs */}
      {/* Top-Left Orb */}
      <div
        className="absolute top-[-12%] left-[-8%] w-[480px] h-[480px] rounded-full bg-[#B9C4B1] opacity-60 blur-[40px] animate-orb-breathe-1"
      />
      
      {/* Bottom-Right Orb */}
      <div
        className="absolute bottom-[-10%] right-[-6%] w-[520px] h-[520px] rounded-full bg-[#B9C4B1] opacity-60 blur-[48px] animate-orb-breathe-2"
      />

      {/* Middle-Right Orb */}
      <div
        className="absolute top-[40%] right-[8%] w-[240px] h-[240px] rounded-full bg-[#B9C4B1] opacity-55 blur-[30px] animate-orb-breathe-3"
      />
    </div>
  );
}
