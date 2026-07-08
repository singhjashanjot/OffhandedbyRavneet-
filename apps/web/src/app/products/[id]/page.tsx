import { Header, Footer } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, getActiveProducts } from "@/lib/queries/products";

/* ========================================
   PRODUCT DETAIL PAGE
   Modern product showcase with studio curation
   Server Component — fetches from Supabase
======================================== */

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description:
      product.description ||
      `Shop ${product.name} at Offhanded. Premium art supplies and curated materials.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  // Fetch related products (exclude current)
  const allProducts = await getActiveProducts();
  const relatedProducts = allProducts
    .filter((p: any) => p.id !== product.id)
    .slice(0, 4);

  const mainImage =
    product.product_images?.[0]?.url ||
    product.image ||
    "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic";

  return (
    <>
      <Header />

      <main className="pt-24">
        {/* ===== HERO — Product Showcase ===== */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Image — takes 7 cols */}
            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/5] w-full bg-offhanded-accent/20 rounded-3xl overflow-hidden shadow-soft-lg relative group">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Details — takes 5 cols */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col gap-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-caption font-sans text-neutral-400 uppercase tracking-widest">
                <Link href="/products" className="hover:text-neutral-700 transition-colors">Products</Link>
                <span className="text-neutral-300">/</span>
                <span className="text-neutral-600 font-medium">{product.category || "Collection"}</span>
              </nav>

              {/* Title + Description */}
              <div>
                <h1 className="font-display text-neutral-900 text-display-md md:text-display-lg font-light leading-[1.1] tracking-tighter">
                  {product.name}
                </h1>
                <p className="font-sans text-neutral-500 text-body-lg mt-5 leading-relaxed">
                  {product.description ||
                    "A curated selection of archival pigments and artisan tools, designed for those who seek to leave a lasting legacy on the canvas."}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-offhanded-accent/30" />

              {/* Price + CTA */}
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-display text-neutral-900 text-display-sm font-light">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                  <span className="font-sans text-caption text-neutral-400 uppercase tracking-widest">
                    Inclusive of all taxes
                  </span>
                </div>
                <Link
                  href={`/checkout?productId=${product.id}&title=${encodeURIComponent(product.name)}&price=${product.price}`}
                  className="bg-offhanded-deep text-white py-4 px-8 rounded-full font-sans font-bold uppercase tracking-widest text-body-sm hover:shadow-lg hover:brightness-110 transition-all inline-flex items-center justify-center gap-3 self-start"
                >
                  Add to Cart
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-offhanded-deep/5 rounded-xl p-4 text-center border border-offhanded-deep/10">
                  <p className="font-sans text-[10px] uppercase text-neutral-500 tracking-widest mb-1">Purity</p>
                  <p className="font-display text-heading-sm text-neutral-900 font-medium">99%</p>
                </div>
                <div className="bg-offhanded-deep/5 rounded-xl p-4 text-center border border-offhanded-deep/10">
                  <p className="font-sans text-[10px] uppercase text-neutral-500 tracking-widest mb-1">Craft</p>
                  <p className="font-display text-heading-sm text-neutral-900 font-medium">Hand</p>
                </div>
                <div className="bg-offhanded-deep/5 rounded-xl p-4 text-center border border-offhanded-deep/10">
                  <p className="font-sans text-[10px] uppercase text-neutral-500 tracking-widest mb-1">Edition</p>
                  <p className="font-display text-heading-sm text-neutral-900 font-medium">Limited</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Story Section ===== */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-20 mt-28 mb-28">
          <div className="border-t border-offhanded-deep/10 pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left */}
              <div className="lg:col-span-5">
                <span className="font-sans text-offhanded-accent font-bold uppercase tracking-[0.3em] text-[10px]">
                  The Story
                </span>
                <h2 className="font-display text-neutral-900 text-display-sm md:text-display-md font-light leading-[1.1] tracking-tighter mt-4">
                  Behind the Craft
                </h2>
                <div className="h-px w-20 bg-neutral-900/20 mt-6"></div>
                <p className="font-serif text-neutral-600 text-body-lg leading-relaxed italic mt-8 border-l-2 border-offhanded-accent pl-6">
                  &ldquo;Color is a power which directly influences the soul.
                  This palette is the key to that influence.&rdquo;
                </p>
              </div>

              {/* Right */}
              <div className="lg:col-span-7 space-y-12">
                <p className="font-sans text-neutral-700 text-body-lg font-light leading-relaxed first-letter:font-serif first-letter:text-[5rem] first-letter:font-black first-letter:float-left first-letter:leading-[1] first-letter:mr-3 first-letter:text-offhanded-deep">
                  {product.description ||
                    "Born from the forgotten archives of the 17th-century Florentine masters, this piece is more than a kit; it is a resurrection of color. We spent three years sourcing lapis lazuli from the highest peaks and ochres from the deepest earth to ensure that every stroke you lay is imbued with the weight of history."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-offhanded-accent font-bold">
                      Integrity
                    </span>
                    <h4 className="font-display text-heading-md text-neutral-900 font-medium leading-snug">
                      Sustainable Legacy
                    </h4>
                    <p className="font-sans text-body-sm text-neutral-500 leading-relaxed">
                      Each wooden box is crafted from reclaimed oak from the
                      royal estates, dried for a decade before being hand-oiled
                      by our master carpenters.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-offhanded-accent font-bold">
                      Quality
                    </span>
                    <h4 className="font-display text-heading-md text-neutral-900 font-medium leading-snug">
                      Pigment Purity
                    </h4>
                    <p className="font-sans text-body-sm text-neutral-500 leading-relaxed">
                      No fillers. No synthetic binders. Only cold-pressed
                      linseed oil and pure mineral pigments that will remain
                      vibrant for centuries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== More from the Studio ===== */}
        {relatedProducts.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-6 md:px-20 mb-28">
            <div className="border-t border-offhanded-deep/10 pt-16 mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <span className="font-sans text-offhanded-accent font-bold uppercase tracking-[0.3em] text-[10px]">
                    Curated Selections
                  </span>
                  <h3 className="font-display text-neutral-900 text-display-sm font-light tracking-tight mt-3">
                    More from the Studio
                  </h3>
                </div>
                <Link
                  href="/products"
                  className="font-sans text-neutral-900 font-bold text-caption uppercase tracking-widest border-b-2 border-neutral-900/20 pb-1 hover:text-brand-600 hover:border-brand-600 transition-all flex items-center gap-1"
                >
                  View All
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relProduct: any) => {
                const relImage =
                  relProduct.product_images?.[0]?.url ||
                  relProduct.image ||
                  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic";

                return (
                  <Link
                    key={relProduct.id}
                    href={`/products/${relProduct.id}`}
                    className="group flex flex-col"
                  >
                    <div className="aspect-[3/4] bg-offhanded-accent/20 rounded-2xl overflow-hidden relative mb-3">
                      <Image
                        src={relImage}
                        alt={relProduct.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-display text-neutral-900 text-body-md font-medium leading-snug">
                      {relProduct.name}
                    </h4>
                    <p className="font-sans text-neutral-500 text-body-sm mt-1">
                      ₹{relProduct.price?.toLocaleString("en-IN")}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
