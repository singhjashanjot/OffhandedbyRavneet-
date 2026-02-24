import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";

/* ========================================
   FONT CONFIGURATION
   Inter: Modern sans-serif for body text (Google Font)
   Space Grotesk: Modern display font for headings
   Playfair Display: Elegant serif for specific headings
======================================== */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

/* ========================================
   SEO METADATA
======================================== */

export const metadata: Metadata = {
  metadataBase: new URL("https://offhanded.in"),
  title: {
    default: "Offhanded | Immersive Art Experiences & Workshops",
    template: "%s | Offhanded",
  },
  description:
    "Discover immersive, meditative art workshops by Offhanded. Join pottery, canvas art, rope painting, and more. For all ages and skill levels. Book your creative escape today.",
  keywords: [
    "art workshops",
    "pottery classes",
    "canvas painting",
    "meditative art",
    "creative workshops",
    "art therapy",
    "beginner art classes",
    "corporate art events",
    "private art parties",
  ],
  authors: [{ name: "Offhanded" }],
  creator: "Offhanded",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://offhanded.in",
    siteName: "Offhanded",
    title: "Offhanded | Immersive Art Experiences & Workshops",
    description:
      "Discover immersive, meditative art workshops by Offhanded. Join pottery, canvas art, rope painting, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Offhanded - Immersive Art Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Offhanded | Immersive Art Experiences",
    description: "Discover immersive, meditative art workshops by Offhanded.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
};

/* ========================================
   ROOT LAYOUT
======================================== */

import SmoothScrolling from "@/components/SmoothScrolling";
import { AuthProvider } from "@/components/providers/AuthProvider";

/* ========================================
   ROOT LAYOUT
======================================== */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#fffff1] antialiased overflow-x-hidden">
        <AuthProvider>
          <SmoothScrolling>{children}</SmoothScrolling>
        </AuthProvider>
      </body>
    </html>
  );
}
