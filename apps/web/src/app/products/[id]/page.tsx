import { Header, Footer } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, getActiveProducts } from "@/lib/queries/products";

/* ========================================
   PRODUCT DETAIL PAGE
   Individual product page with story section
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
    .slice(0, 3);

  const mainImage =
    product.product_images?.[0]?.url ||
    product.image ||
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80";

  return (
    <>
      <Header />

      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
          {/* Hero Section — Product Image + Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Product Image */}
            <div className="relative group">
              <div className="aspect-[4/5] w-full bg-offhanded-accent/20 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-offhanded-accent font-bold uppercase tracking-[0.3em] text-xs">
                  {product.category || "The Collection"}
                </span>
                <h1 className="font-display text-neutral-900 text-display-lg font-bold leading-tight mt-4 tracking-tighter">
                  {product.name}
                </h1>
                <p className="text-neutral-500 text-body-lg mt-4 leading-relaxed font-light">
                  {product.description ||
                    "A curated selection of archival pigments and artisan tools, designed for those who seek to leave a lasting legacy on the canvas."}
                </p>
              </div>

              {/* Stat Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-offhanded-deep/5 text-neutral-900 p-6 text-center border border-offhanded-deep/10">
                  <p className="text-xs uppercase opacity-60 mb-1">Purity</p>
                  <p className="text-2xl font-bold">99%</p>
                </div>
                <div className="bg-offhanded-deep/5 text-neutral-900 p-6 text-center border border-offhanded-deep/10">
                  <p className="text-xs uppercase opacity-60 mb-1">Craft</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
                <div className="bg-offhanded-deep/5 text-neutral-900 p-6 text-center border border-offhanded-deep/10">
                  <p className="text-xs uppercase opacity-60 mb-1">Limited</p>
                  <p className="text-2xl font-bold">500</p>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex flex-col gap-4">
                <p className="text-display-sm font-light text-neutral-900">
                  ₹{product.price?.toLocaleString("en-IN")}{" "}
                  <span className="text-body-sm opacity-50 uppercase tracking-widest ml-2">
                    INR
                  </span>
                </p>
                <Link
                  href={`/checkout?productId=${product.id}&title=${encodeURIComponent(product.name)}&price=${product.price}`}
                  className="bg-offhanded-deep text-white py-5 rounded-full font-bold uppercase tracking-widest hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 text-body-md"
                >
                  Acquire Piece
                </Link>
              </div>
            </div>
          </div>

          {/* Narrative Section — The Story Behind the Craft */}
          <section className="mb-32">
            <div className="border-t border-offhanded-deep/10 pt-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left — Title + Quote */}
                <div className="lg:col-span-5">
                  <h2 className="text-display-md font-serif text-neutral-900 leading-tight mb-8 italic">
                    The Story Behind the Craft
                  </h2>
                  <div className="h-px w-24 bg-neutral-900/30 mb-8"></div>
                  <p className="text-neutral-600 text-body-lg leading-relaxed italic border-l-2 border-offhanded-accent pl-6 font-serif">
                    &ldquo;Color is a power which directly influences the soul.
                    This palette is the key to that influence.&rdquo;
                  </p>
                </div>

                {/* Right — Description + Features */}
                <div className="lg:col-span-7 space-y-12">
                  <p className="text-neutral-900 text-body-lg font-light leading-relaxed first-letter:font-serif first-letter:text-[5rem] first-letter:font-black first-letter:float-left first-letter:leading-[1] first-letter:mr-3 first-letter:text-offhanded-deep">
                    {product.description ||
                      "Born from the forgotten archives of the 17th-century Florentine masters, this piece is more than a kit; it is a resurrection of color. We spent three years sourcing lapis lazuli from the highest peaks and ochres from the deepest earth to ensure that every stroke you lay is imbued with the weight of history."}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-offhanded-accent font-bold">
                          Integrity
                        </span>
                        <h4 className="font-serif text-heading-md text-neutral-900 mt-1">
                          Sustainable Legacy
                        </h4>
                      </div>
                      <p className="text-body-sm text-neutral-500 leading-relaxed">
                        Each wooden box is crafted from reclaimed oak from the
                        royal estates, dried for a decade before being hand-oiled
                        by our master carpenters.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-offhanded-accent font-bold">
                          Quality
                        </span>
                        <h4 className="font-serif text-heading-md text-neutral-900 mt-1">
                          Pigment Purity
                        </h4>
                      </div>
                      <p className="text-body-sm text-neutral-500 leading-relaxed">
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

          {/* More from the Studio */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-offhanded-accent font-bold uppercase tracking-[0.3em] text-xs">
                    Exhibitions
                  </span>
                  <h3 className="font-display text-neutral-900 text-display-sm font-bold mt-2">
                    More from the Studio
                  </h3>
                </div>
                <Link
                  href="/products"
                  className="text-neutral-900 font-bold border-b-2 pb-1 hover:text-brand-600 transition-colors border-neutral-900/20"
                >
                  View All Works
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((relProduct: any) => {
                  const relImage =
                    relProduct.product_images?.[0]?.url ||
                    relProduct.image ||
                    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80";

                  return (
                    <Link
                      key={relProduct.id}
                      href={`/products/${relProduct.id}`}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-square bg-offhanded-accent/20 rounded-xl mb-4 overflow-hidden relative">
                        <Image
                          src={relImage}
                          alt={relProduct.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-body-lg font-bold text-neutral-900 font-serif">
                        {relProduct.name}
                      </h4>
                      <p className="text-neutral-500 text-body-sm mt-1">
                        ₹{relProduct.price?.toLocaleString("en-IN")}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
