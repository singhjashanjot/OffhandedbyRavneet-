import { Header, Footer, SectionHeader } from "@/components";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/queries/products";

/* ========================================
   PRODUCTS PAGE
   Art supplies and merchandise store
   Server Component — fetches from Supabase
======================================== */

export const metadata: Metadata = {
  title: "Products",
  description: "Shop art supplies, kits, and Offhanded merchandise. Everything you need for your creative journey.",
};

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <>
      <Header />
      
      <main className="pt-24">
        {/* Header Section */}
        <section className="py-24 bg-brand-50 max-w-screen-2xl mx-auto">
          <div className="container-custom">
            <SectionHeader
              title="Shop Art Supplies"
              subtitle="Take your creativity home with our curated selection of art materials"
            />
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-24 bg-white max-w-screen-2xl mx-auto">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group card-hover"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-3xl">
                    <Image
                      src={product.image || "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-caption text-neutral-500">{product.category || "General"}</span>
                    <h3 className="font-medium text-neutral-900 mt-1 group-hover:text-brand-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 font-semibold text-neutral-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Coming Soon Note */}
            <div className="mt-16 text-center p-8 rounded-3xl bg-brand-50">
              <p className="text-body-lg text-neutral-600">
                🛍️ More products coming soon! Stay tuned for our full catalog.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
