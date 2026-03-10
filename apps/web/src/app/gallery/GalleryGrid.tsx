"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

/* ========================================
   GALLERY GRID (Client Component)
   Asymmetric grid with category filtering
   + Behind the Scenes section
======================================== */

interface GalleryItem {
  id: string;
  media_url: string;
  media_type: string;
  category: string | null;
  caption: string | null;
  event_type: string | null;
}

interface GalleryGridProps {
  items: GalleryItem[];
  categories: string[];
}

/*
  Row templates — each row spans 12 cols and shares a single aspect ratio
  so items on the same row are always the same height = no empty gaps.
*/

/* Tailwind needs full class strings at build time — no dynamic interpolation */
const COL_SPAN_MAP: Record<number, string> = {
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
};
interface RowTemplate {
  cols: number[];        // column spans — must sum to 12
  aspect: string;        // shared aspect ratio for the whole row
  grayscale: string[];   // per-slot grayscale
  decorations?: ("corner" | "border" | null)[];
}

const ROW_TEMPLATES: RowTemplate[] = [
  // Row A: 7 + 5, landscape
  {
    cols: [7, 5],
    aspect: "aspect-[4/3]",
    grayscale: ["grayscale-[0.15]", "grayscale-[0.25]"],
    decorations: ["corner", null],
  },
  // Row B: 5 + 7, shorter landscape
  {
    cols: [5, 7],
    aspect: "aspect-[3/2]",
    grayscale: ["grayscale-[0.1]", "grayscale-[0.2]"],
    decorations: [null, "corner"],
  },
  // Row C: 4 + 8, wider
  {
    cols: [4, 8],
    aspect: "aspect-video",
    grayscale: ["grayscale-[0.3]", ""],
    decorations: [null, "border"],
  },
  // Row D: 6 + 6, equal
  {
    cols: [6, 6],
    aspect: "aspect-[4/3]",
    grayscale: ["grayscale-[0.15]", "grayscale-[0.1]"],
    decorations: [null, null],
  },
  // Row E: 8 + 4
  {
    cols: [8, 4],
    aspect: "aspect-[3/2]",
    grayscale: ["", "grayscale-[0.25]"],
    decorations: ["border", null],
  },
  // Row F: 5 + 7
  {
    cols: [5, 7],
    aspect: "aspect-[4/3]",
    grayscale: ["grayscale-[0.2]", "grayscale-[0.1]"],
    decorations: ["corner", null],
  },
];

/* ── Placeholder videos (used until real ones exist in DB) ── */
const PLACEHOLDER_VIDEOS: GalleryItem[] = [
  {
    id: "placeholder-v1",
    media_url: "https://videos.pexels.com/video-files/5703983/5703983-sd_640_360_25fps.mp4",
    media_type: "video",
    category: "Behind the Scenes",
    caption: null,
    event_type: null,
  },
  {
    id: "placeholder-v2",
    media_url: "https://videos.pexels.com/video-files/6585870/6585870-sd_640_360_25fps.mp4",
    media_type: "video",
    category: "Behind the Scenes",
    caption: null,
    event_type: null,
  },
  {
    id: "placeholder-v3",
    media_url: "https://videos.pexels.com/video-files/5547763/5547763-sd_640_360_25fps.mp4",
    media_type: "video",
    category: "Behind the Scenes",
    caption: null,
    event_type: null,
  },
];

/* Inline videos sprinkled into the main grid */
const INLINE_PLACEHOLDER_VIDEOS: GalleryItem[] = [
  {
    id: "placeholder-iv1",
    media_url: "https://videos.pexels.com/video-files/6942560/6942560-sd_640_360_25fps.mp4",
    media_type: "video",
    category: null,
    caption: null,
    event_type: null,
  },
  {
    id: "placeholder-iv2",
    media_url: "https://videos.pexels.com/video-files/4916480/4916480-sd_640_360_25fps.mp4",
    media_type: "video",
    category: null,
    caption: null,
    event_type: null,
  },
];

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredItems = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  // Split items into main gallery (images + videos mixed) and BTS videos
  const { mainItems, btsItems } = useMemo(() => {
    const dbVideos = filteredItems.filter((i) => i.media_type === "video");
    const images = filteredItems.filter((i) => i.media_type !== "video");

    // BTS: use up to 3 DB videos, fall back to placeholders
    const bts = dbVideos.length >= 3
      ? dbVideos.slice(0, 3)
      : [...dbVideos, ...PLACEHOLDER_VIDEOS].slice(0, 3);

    // Remaining DB videos go into main grid
    const mainVideos = dbVideos.slice(3);

    // Inline placeholder videos (only when not enough DB videos)
    const inlinePlaceholders =
      mainVideos.length < 2
        ? INLINE_PLACEHOLDER_VIDEOS.slice(0, 2 - mainVideos.length)
        : [];
    const allMainVideos = [...mainVideos, ...inlinePlaceholders];

    // Interleave: insert a video every 4 images
    const merged: GalleryItem[] = [];
    let vi = 0;
    images.forEach((img, i) => {
      merged.push(img);
      if ((i + 1) % 4 === 0 && vi < allMainVideos.length) {
        merged.push(allMainVideos[vi++]);
      }
    });
    while (vi < allMainVideos.length) {
      merged.push(allMainVideos[vi++]);
    }
    return { mainItems: merged, btsItems: bts };
  }, [filteredItems]);

  // Build rows from mainItems
  const rows = useMemo(() => {
    const result: { item: GalleryItem; colSpan: number; aspect: string; grayscale: string; decoration: "corner" | "border" | null }[][] = [];
    let itemIdx = 0;
    let templateIdx = 0;

    while (itemIdx < mainItems.length) {
      const template = ROW_TEMPLATES[templateIdx % ROW_TEMPLATES.length];
      const row: typeof result[number] = [];

      for (let slot = 0; slot < template.cols.length && itemIdx < mainItems.length; slot++) {
        row.push({
          item: mainItems[itemIdx],
          colSpan: template.cols[slot],
          aspect: template.aspect,
          grayscale: template.grayscale[slot] || "",
          decoration: template.decorations?.[slot] ?? null,
        });
        itemIdx++;
      }
      result.push(row);
      templateIdx++;
    }
    return result;
  }, [mainItems]);

  let globalIdx = 0;

  return (
    <>
      {/* Category Filters */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-20 mb-16">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? "bg-[#2D3E30] text-[#fffff1]"
                  : "bg-brand-100 text-[#2D3E30] hover:bg-brand-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#2D3E30] text-[#fffff1]"
                    : "bg-brand-100 text-[#2D3E30] hover:bg-brand-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Asymmetric Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 pb-20">
        {rows.length > 0 ? (
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {rows.map((row, rowIdx) =>
              row.map((cell) => {
                const idx = globalIdx++;
                const isVideo = cell.item.media_type === "video";

                return (
                  <motion.div
                    key={cell.item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx % 6) * 0.07 }}
                    className={`col-span-12 ${COL_SPAN_MAP[cell.colSpan] || ""} relative group`}
                  >
                    {cell.decoration === "corner" && (
                      <div className="absolute -top-3 -left-3 w-10 h-10 border-t border-l border-brand-300/30 z-10 hidden md:block" />
                    )}

                    <div
                      className={`overflow-hidden rounded-xl ${cell.aspect} bg-[#2D3E30]/5 relative ${
                        cell.decoration === "border"
                          ? "border border-brand-300/10 p-1.5"
                          : ""
                      }`}
                    >
                      {cell.decoration === "border" ? (
                        <div className="w-full h-full rounded-lg overflow-hidden relative">
                          <GalleryMedia
                            item={cell.item}
                            grayscale={cell.grayscale}
                            isVideo={isVideo}
                            priority={idx < 2}
                          />
                        </div>
                      ) : (
                        <GalleryMedia
                          item={cell.item}
                          grayscale={cell.grayscale}
                          isVideo={isVideo}
                          priority={idx < 2}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-sans text-lg text-[#2D3E30]/50 font-light">
              No items found in this category.
            </p>
          </div>
        )}
      </section>

      {/* Behind the Scenes Section — always visible */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 border-t border-brand-300/10 pt-20 pb-32">
        <div className="mb-12">
          <h3 className="font-display font-light text-3xl tracking-tight text-[#2D3E30] mb-2">
            Behind the Scenes
          </h3>
          <p className="font-sans text-[#2D3E30]/60 font-light">
            The raw, unedited rhythm of our process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {btsItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-neutral-200 grayscale contrast-125 brightness-90 relative">
                <video
                  src={item.media_url}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ========================================
   GALLERY MEDIA
   Renders image or video inside grid cell
======================================== */

function GalleryMedia({
  item,
  grayscale,
  isVideo,
  priority,
}: {
  item: GalleryItem;
  grayscale: string;
  isVideo: boolean;
  priority: boolean;
}) {
  if (isVideo) {
    return (
      <video
        src={item.media_url}
        className={`absolute inset-0 w-full h-full object-cover ${grayscale} group-hover:scale-105 transition-transform duration-700`}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <Image
      src={item.media_url}
      alt={item.caption || "Gallery"}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 60vw"
      className={`object-cover ${grayscale} group-hover:scale-105 transition-transform duration-700`}
    />
  );
}
