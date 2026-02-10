/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ========================================
         OFFHANDED DESIGN SYSTEM
         Calm, Premium, Minimal Aesthetic
      ======================================== */
      
      colors: {
        /* Primary Brand Colors - Warm, Earthy, Calming */
        "primary": "#1B3022",
        "background-light": "#FFFFF1",
        "offhanded-deep": "#2D3E30",
        "offhanded-forest": "#1B3022",
        "offhanded-accent": "#B2C0AD",
        /* Primary Brand Colors - Warm, Earthy, Calming */
        brand: {
          50: "#f0f4ef", /* Visible sage tint */
          100: "#e0e8de", /* Stronger tint */
          200: "#c8d5c4", /* Approaching base color */
          300: "#b7c4b0", /* The User's Color */
          400: "#9dab96", /* Slightly darker for distinct UI elements */
          500: "#86947f", /* Primary button color */
          600: "#6d7a67",
          700: "#566151",
          800: "#414a3d",
          900: "#2d342a",
          950: "#181d16",
        },
        
        /* Neutral Colors - Warm Stone/Greige to match Sage */
        neutral: {
          50: "#fafaf9", /* Warm White */
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        
        /* Alias gray to neutral for consistency */
        gray: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        
        /* Accent Colors for categories */
        accent: {
          pottery: "#b7c4b0", // Sage
          canvas: "#e6e2d6", // Beige
          rope: "#d6d2c4", // Darker Beige
          cake: "#f2efe9", // Off white
          punch: "#a8b5a8", // Darker Sage
        },
        /* New Redesign Colors */
        "text-main": "#141514",
        "text-muted": "#4a4a4a",
        primary: {
          DEFAULT: "#141514", // Using text-main as primary for now or similar dark shade
          dark: "#000000",
        },
        "surface-dark": "#1c1917", // Matching neutral-900 for dark mode surface
      },
      
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],

      },

      fontSize: {
        /* Typography Scale */
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.875rem", { lineHeight: "1.3" }],
        "heading-md": ["1.5rem", { lineHeight: "1.4" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
      },
      
      spacing: {
        /* Section spacing system */
        "section-sm": "4rem",
        "section-md": "6rem",
        "section-lg": "8rem",
        "section-xl": "10rem",
      },
      
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "soft-lg": "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
        "glow": "0 0 40px rgba(184, 150, 96, 0.15)",
      },
      
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
      },
      
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "marquee": "marquee 25s linear infinite",
      },
      
      transitionDuration: {
        "400": "400ms",
      },
      
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
