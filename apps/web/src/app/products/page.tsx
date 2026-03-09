import { Header, Footer } from "@/components";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/queries/products";

/* ========================================
   PRODUCTS PAGE
   Curated art supplies and merchandise store
   Server Component — fetches from Supabase
======================================== */

export const metadata: Metadata = {
  title: "Products",
  description:
    "Shop art supplies, kits, and Offhanded merchandise. Everything you need for your creative journey.",
};

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <>
      <Header />

      <main className="pt-24">
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-20 py-12 md:py-20">
          {/* Hero Section */}
          <section className="mb-20">
            <div className="flex flex-col gap-6 max-w-2xl">
              <span className="font-sans text-offhanded-accent font-bold uppercase tracking-[0.3em] text-[10px]">
                Volume 01 — Permanent Collection
              </span>
              <h1 className="font-display text-neutral-900 text-display-md md:text-display-lg font-light leading-[1.1] tracking-tighter">
                The Curated{" "}
                <br />
                <span className="italic font-serif">Aesthetics of Artistry</span>
              </h1>
              <p className="font-sans text-neutral-500 text-body-lg font-normal leading-relaxed max-w-lg mt-4">
                A minimalist selection of high-end art supplies and handmade
                ceramics, designed for those who find beauty in the tactile and
                the functional.
              </p>
            </div>
          </section>

          {/* Filter / Sub-nav */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-offhanded-accent/20 pb-6">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              <button className="text-neutral-900 text-xs font-bold uppercase tracking-widest border-b-2 border-brand-600 pb-1">
                All Objects
              </button>
              <button className="text-neutral-400 hover:text-neutral-900 text-xs font-bold uppercase tracking-widest transition-colors">
                Handmade Ceramics
              </button>
              <button className="text-neutral-400 hover:text-neutral-900 text-xs font-bold uppercase tracking-widest transition-colors">
                Art Kits
              </button>
              <button className="text-neutral-400 hover:text-neutral-900 text-xs font-bold uppercase tracking-widest transition-colors">
                Fine Liners
              </button>
              <button className="text-neutral-400 hover:text-neutral-900 text-xs font-bold uppercase tracking-widest transition-colors">
                Sketchbooks
              </button>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-widest">
              <span>Sort by:</span>
              <select className="bg-transparent border-none text-xs font-bold text-neutral-900 focus:ring-0 p-0 pr-8 cursor-pointer">
                <option>Featured</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: any) => {
              const imageUrl =
                product.product_images?.[0]?.url ||
                product.image ||
                "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80";

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group flex flex-col border border-neutral-200/80 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-soft transition-all duration-300"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-offhanded-accent/10">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="bg-offhanded-deep text-white px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-600 transition-colors inline-block rounded-full">
                        View
                      </span>
                    </div>
                  </div>
                  <div className="p-3 md:p-4 flex flex-col gap-1">
                    <p className="font-sans text-offhanded-accent text-[10px] uppercase tracking-widest font-bold">
                      {product.category || "General"}
                    </p>
                    <h3 className="font-display text-neutral-900 text-sm font-medium leading-snug">
                      {product.name}
                    </h3>
                    <span className="font-sans text-neutral-900 text-sm font-semibold mt-1">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Section — Ceramic Series + Pagination */}
          <div className="mt-32 pt-12 border-t border-offhanded-accent/30 flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="flex flex-col gap-4">
              <h4 className="font-display text-neutral-900 text-heading-lg font-light tracking-tight">
                The Ceramic Series
              </h4>
              <p className="font-sans text-neutral-400 max-w-sm text-body-sm">
                Every piece is hand-thrown in our studio, reflecting the subtle
                imperfections of the process.
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-neutral-900 text-xs font-bold uppercase tracking-widest hover:text-brand-600 transition-colors mt-2"
              >
                Explore Series
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="flex gap-4">
              <button className="size-10 rounded-full border border-offhanded-accent flex items-center justify-center text-neutral-900 hover:border-neutral-900 transition-all">
                <span className="material-symbols-outlined text-xl">
                  chevron_left
                </span>
              </button>
              <button className="size-10 rounded-full border border-offhanded-accent flex items-center justify-center text-neutral-900 hover:border-neutral-900 transition-all">
                <span className="material-symbols-outlined text-xl">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
