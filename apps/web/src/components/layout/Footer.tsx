import Link from "next/link";
import { footerNavigation } from "@/data";

/* ========================================
   FOOTER COMPONENT
   Minimal footer with large brand text & halftone effect
======================================== */

const excludeLabels = ["Facebook", "WhatsApp", "About Us"];

const footerLinks = [
  ...footerNavigation.social.map((s) => ({ label: s.label, href: s.href, external: true })),
  ...footerNavigation.company.map((c) => ({ label: c.label, href: c.href, external: false })),
  ...footerNavigation.legal.map((l) => ({ label: l.label, href: l.href, external: false })),
].filter((item) => !excludeLabels.includes(item.label));

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "#FFFFF1" }}>
      {/* Top Navigation Bar */}
      <div className="relative z-10 px-6 md:px-10 py-8 mt-16 flex items-center justify-between">
        {/* Logo + Tagline */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-neutral-900"
          >
            Offhanded
          </Link>
          <span className="text-neutral-400 text-sm hidden sm:inline">
            · Made with care
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {footerLinks.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Brand Text placed just above the halftone effect */}
      <div className="relative z-10 flex items-center justify-center px-4 pt-24 md:pt-28">
        <h2
          className="font-canela text-center uppercase leading-none select-none"
          style={{
            fontSize: "clamp(3rem, 10vw, 10rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            transform: "scaleY(2)",
            background: "linear-gradient(to bottom, #2D3E30 0%, #2D3E3080 60%, transparent 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Offhanded
        </h2>
      </div>

      {/* Halftone Dot Pattern Effect */}
      <div className="relative w-full -mt-4" style={{ height: "clamp(100px, 15vw, 200px)" }}>
        <HalftonePattern />
      </div>
    </footer>
  );
}

/* ========================================
   HALFTONE PATTERN COMPONENT
   Creates a halftone dot gradient effect
======================================== */

function HalftonePattern() {
  const rows = 20;
  const cols = 120;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox={`0 0 ${cols * 10} ${rows * 10}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const progress = row / (rows - 1);
          const radius = 0.5 + progress * 4;
          const opacity = progress * progress;
          return (
            <circle
              key={`${row}-${col}`}
              cx={col * 10 + 5}
              cy={row * 10 + 5}
              r={radius}
              fill="#2D3E30"
              opacity={opacity}
            />
          );
        })
      )}
    </svg>
  );
}
