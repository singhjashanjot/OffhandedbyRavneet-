import { getAdminProducts } from "@/lib/queries/admin";
import { formatPrice, formatDate } from "@/data/workshops";
import { ProductActions } from "@/components/admin/ProductActions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Products | Offhanded Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {products.length} products total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-[#1B3022] text-white rounded-xl font-medium text-sm hover:bg-[#2a4a35] transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Product
              </th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Category
              </th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Price
              </th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Stock
              </th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">
                Status
              </th>
              <th className="text-right px-6 py-4 font-medium text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((product: any) => (
              <tr
                key={product.id}
                className="hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">📦</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                        {product.description || "No description"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  {product.category || "General"}
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-medium ${
                      product.stock_quantity <= 5
                        ? "text-red-600"
                        : "text-neutral-700"
                    }`}
                  >
                    {product.stock_quantity} left
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      product.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <ProductActions productId={product.id} isActive={product.is_active} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-neutral-400"
                >
                  No products yet.{" "}
                  <Link
                    href="/admin/products/new"
                    className="text-[#1B3022] underline"
                  >
                    Create your first product
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
