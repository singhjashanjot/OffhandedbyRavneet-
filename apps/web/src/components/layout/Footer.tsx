"use client";

import Link from "next/link";
import { useState } from "react";
import { footerNavigation } from "@/data";

/* ========================================
   FOOTER COMPONENT
   Modern footer inspired by shadcnblocks/footer31
   Large heading + nav columns + newsletter + brand text
======================================== */

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Workshops", href: "/workshops" },
  { label: "Products", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/offhandedbyravneet", external: true },
  { label: "Facebook", href: "https://facebook.com/offhanded", external: true },
  { label: "WhatsApp", href: "https://wa.me/919876543210", external: true },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    if (email.trim()) {
      alert("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "#FFFFF1" }}
    >
      <div className="px-6 md:px-12 lg:px-20 pt-20 pb-8">
        {/* ─── Top Section: Heading + Nav Columns ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Large Heading */}
          <div>
            <h2
              className="font-display font-light leading-[1.05] tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                color: "#3D4E40",
              }}
            >
              Creativity, handmade
              <br />
              with heart
            </h2>
          </div>

          {/* Right: Navigation + Social Columns */}
          <div className="grid grid-cols-2 gap-8 lg:justify-end">
            {/* Pages Column */}
            <nav className="flex flex-col gap-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social Column */}
            <nav className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200 inline-flex items-center gap-1.5 w-fit"
                >
                  {link.label}
                  {/* External link arrow */}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-60"
                  >
                    <path
                      d="M3.5 1.5H10.5V8.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5 1.5L1.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ─── Middle Section: Support + Newsletter | Location + Legal ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mt-16 lg:mt-24">
          {/* Left: Support + Newsletter */}
          <div className="space-y-10">
            {/* Get Support */}
            <div>
              <p className="text-sm text-neutral-500 mb-1.5">Get Support :</p>
              <a
                href="mailto:hello@offhanded.in"
                className="text-sm text-neutral-900 hover:text-neutral-600 transition-colors duration-200 underline underline-offset-4 decoration-neutral-300"
              >
                hello@offhanded.in
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">
                Sign up for upcoming workshops   :
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex items-center border-b border-neutral-300 pb-2 max-w-md"
              >
                <input
                  type="email"
                  placeholder="EMAIL*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none tracking-wide"
                  style={{ letterSpacing: "0.05em" }}
                />
                <button
                  type="submit"
                  className="ml-4 text-neutral-900 hover:text-neutral-600 transition-colors duration-200 flex-shrink-0"
                  aria-label="Subscribe to newsletter"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 6L19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Location + Legal */}
          <div className="grid grid-cols-2 gap-8 lg:justify-end">
            {/* Location */}
            <div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Punjab
                <br />
                India, Asia
              </p>
            </div>

            {/* Legal Links */}
            <nav className="flex flex-col gap-2">
              {footerNavigation.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ─── Bottom: Large Brand Name ─── */}
        <div className="mt-16 lg:mt-24 w-full overflow-hidden pt-4">
          <h2
            className="font-display font-light leading-none select-none text-center whitespace-nowrap"
            style={{
              fontSize: "clamp(4rem, 10.5vw, 16rem)",
              letterSpacing: "-0.09em",
              color: "#3D4E40",
              opacity: 0.5,
              transform: "scaleY(1.1)",
              transformOrigin: "bottom",
            }}
          >
            offhandedbyravneet
          </h2>
        </div>
      </div>
    </footer>
  );
}
