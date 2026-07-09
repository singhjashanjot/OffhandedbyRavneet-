import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.offhandedbyravneet.com";

  // Static routes
  const staticRoutes = [
    "",
    "/workshops",
    "/allcategories",
    "/gallery",
    "/about",
    "/contact",
    "/products",
  ];

  // Dynamic experience category slugs
  const experienceSlugs = [
    "pottery-texture",
    "canvas-painting",
    "clay-mirror-painting",
    "acrylic-art",
    "rope-painting",
    "textured-art",
    "jute-bag-painting",
    "cake-painting",
    "bento-cake-painting",
    "punch-needle",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : 0.8,
    })),
    ...experienceSlugs.map((slug) => ({
      url: `${baseUrl}/experience/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  return sitemapEntries;
}
