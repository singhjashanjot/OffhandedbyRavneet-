import { ProductForm } from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product | Offhanded Admin",
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-4 inline-block"
        >
          ← Back to Products
        </Link>
        <h1 className="text-2xl font-serif text-neutral-900">Edit Product</h1>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
