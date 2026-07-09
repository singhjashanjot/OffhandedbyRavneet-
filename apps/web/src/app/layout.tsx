import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Playfair_Display, Bebas_Neue } from "next/font/google";
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

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

/* ========================================
   SEO METADATA
======================================== */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.offhandedbyravneet.com"),
  title: {
    default: "Offhanded | Immersive Art Workshops in Jalandhar, Punjab & India",
    template: "%s | Offhanded by Ravneet",
  },
  description:
    "Join immersive, meditative art workshops by Offhanded by Ravneet. Based in Jalandhar, Punjab, offering pottery texture art, Lippan art, canvas painting, and 20+ creative workshops across India.",
  keywords: [
    "art workshops",
    "art workshops in punjab",
    "art workshops in jalandhar",
    "art workshops in chandigarh",
    "art workshops in ludhiana",
    "art workshops in amritsar",
    "art workshops in bathinda",
    "art workshops in hoshiarpur",
    "art workshops in patiala",
    "art workshops in faridkot",
    "art workshops in gurdaspur",
    "art workshops in Moga",
    "art workshops in Ferozepur",
    "art workshops in india",
    "offhanded",
    "offhandedbyravneet",
    "latest art workshops",
    "upcoming workshops",
    "pottery classes in jalandhar",
    "pottery classes in punjab",
    "pottery texture art",
    "canvas painting jalandhar",
    "lippan art workshop",
    "tote bag painting",
    "fluid art classes",
    "aztec mask painting",
    "tissue art",
    "punch needle art",
    "glass painting",
    "fabric painting",
    "diy moon painting",
    "canvas pouch painting",
    "trinket trays making",
    "pot painting workshop",
    "cap painting",
    "gold foil painting",
    "rope on canvas painting",
    "cake painting classes",
    "bento cake painting",
    "textured art workshop jalandhar",
    "creative escape punjab",
    "pottery studio jalandhar",
    "ravneet art studio",
    "offhanded by ravneet",
    "immersive art experiences"
  ],
  authors: [{ name: "Offhanded" }],
  creator: "Offhanded",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.offhandedbyravneet.com",
    siteName: "Offhanded",
    title: "Offhanded | Immersive Art Workshops in Jalandhar, Punjab & India",
    description:
      "Discover immersive, meditative art workshops, pottery classes, and premium creative experiences by Offhanded by Ravneet in Punjab and India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Offhanded by Ravneet - Immersive Art Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Offhanded | Immersive Art Workshops in Punjab & India",
    description: "Discover immersive, meditative art workshops and pottery classes by Offhanded by Ravneet.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
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
import { GlobalBackground, PaintbrushCursor } from "@/components";

/* ========================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable} ${bebasNeue.variable} scroll-smooth`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Offhanded by Ravneet",
              "image": "https://www.offhandedbyravneet.com/og-image.png",
              "@id": "https://www.offhandedbyravneet.com/#organization",
              "url": "https://www.offhandedbyravneet.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jalandhar",
                "addressRegion": "Punjab",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.instagram.com/offhandedbyravneet"
              ],
              "founder": {
                "@type": "Person",
                "name": "Ravneet"
              },
              "description": "Immersive art workshops and pottery classes in Jalandhar, Punjab, and across India. Explore canvas painting, pottery texture art, clay mirror painting, Lippan art, and 20+ creative workshops curated by Offhanded.",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Art Workshops & Experiences",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Pottery Texture Art Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Canvas Painting Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Clay Mirror Painting Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Lippan Art Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Tote Bag Painting Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Fluid Art Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Textured Art Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Cake Painting Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Bento Cake Painting Workshop"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Punch Needle Art Workshop"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FFFFF0] antialiased overflow-x-hidden relative">
        <GlobalBackground />
        <PaintbrushCursor />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <AuthProvider>
            <SmoothScrolling>{children}</SmoothScrolling>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
