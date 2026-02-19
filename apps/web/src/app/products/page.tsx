import { Header, Footer, SectionHeader } from "@/components";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

/* ========================================
   PRODUCTS PAGE
   Art supplies and merchandise store
======================================== */

export const metadata: Metadata = {
  title: "Products",
  description: "Shop art supplies, kits, and Offhanded merchandise. Everything you need for your creative journey.",
};

// Mock products data
const products = [
  {
    id: "p-001",
    name: "Pottery Starter Kit",
    price: 1299,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80",
    category: "Kits",
  },
  {
    id: "p-002",
    name: "Acrylic Paint Set (24 colors)",
    price: 899,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    category: "Supplies",
  },
  {
    id: "p-003",
    name: "Canvas Board Pack (3 pcs)",
    price: 449,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
    category: "Supplies",
  },
  {
    id: "p-004",
    name: "Punch Needle Complete Kit",
    price: 1599,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80",
    category: "Kits",
  },
];

export default function ProductsPage() {
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
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group card-hover"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-3xl">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-caption text-neutral-500">{product.category}</span>
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
