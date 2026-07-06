import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product | Offhanded Admin",
};

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-4 inline-block"
        >
          ← Back to Products
        </Link>
        <h1 className="text-2xl font-serif text-neutral-900">Add New Product</h1>
      </div>

      <ProductForm />
    </div>
  );
}
