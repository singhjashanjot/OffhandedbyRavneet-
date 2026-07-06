"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/queries/admin";

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();

  try {
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      stock_quantity: parseInt(formData.get("stock_quantity") as string, 10),
      category: formData.get("category") as string,
      is_active: formData.get("is_active") === "true",
      image: formData.get("image") as string,
    };

    if (!rawData.name) throw new Error("Name is required");
    if (isNaN(rawData.price) || rawData.price < 0) throw new Error("Price must be positive");
    if (isNaN(rawData.stock_quantity) || rawData.stock_quantity < 0) throw new Error("Stock cannot be negative");
    if (!rawData.category) throw new Error("Category is required");

    const { error } = await supabase.from("products").insert([rawData]);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createClient();

  try {
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      stock_quantity: parseInt(formData.get("stock_quantity") as string, 10),
      category: formData.get("category") as string,
      is_active: formData.get("is_active") === "true",
      image: formData.get("image") as string,
    };

    if (!rawData.name) throw new Error("Name is required");
    if (isNaN(rawData.price) || rawData.price < 0) throw new Error("Price must be positive");
    if (isNaN(rawData.stock_quantity) || rawData.stock_quantity < 0) throw new Error("Stock cannot be negative");
    if (!rawData.category) throw new Error("Category is required");

    const { error } = await supabase
      .from("products")
      .update(rawData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message || "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createClient();

  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product. It may have existing orders attached to it." };
  }
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  await requireAdmin();
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: any) {
    console.error("Error toggling product status:", error);
    return { success: false, error: error.message };
  }
}
