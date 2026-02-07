/* ========================================
   NAVIGATION DATA
   Site navigation structure
======================================== */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Workshops",
    href: "/workshops",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const footerNavigation = {
  workshops: [
    { label: "Pottery Texture Art", href: "/workshops?category=pottery" },
    { label: "Canvas Art", href: "/workshops?category=canvas" },
    { label: "Rope Painting", href: "/workshops?category=rope" },
    { label: "Bento Cake Painting", href: "/workshops?category=bento-cake" },
    { label: "Punch Needle", href: "/workshops?category=punch-needle" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com/offhandedbyravneet", icon: "instagram" },
    { label: "Facebook", href: "https://facebook.com/offhanded", icon: "facebook" },
    { label: "WhatsApp", href: "https://wa.me/919876543210", icon: "whatsapp" },
  ],
};
