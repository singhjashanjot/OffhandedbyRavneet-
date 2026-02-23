/* ========================================
   SUPABASE STORAGE UTILITIES
   Upload, delete, and get public URLs
   for media across all storage buckets
======================================== */

import { createBrowserClient } from "@supabase/ssr";

type StorageBucket = "workshop-images" | "product-images" | "gallery-media" | "avatars";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/** Upload a file to a Supabase Storage bucket */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: publicUrl.publicUrl, error: null };
}

/** Delete a file from a Supabase Storage bucket */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ error: string | null }> {
  const supabase = getSupabase();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  return { error: error?.message || null };
}

/** Get the public URL for a file in a storage bucket */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/** Upload a user avatar */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/avatar.${ext}`;
  return uploadFile("avatars", path, file);
}

/** Upload a workshop image */
export async function uploadWorkshopImage(
  workshopId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const path = `${workshopId}/${timestamp}.${ext}`;
  return uploadFile("workshop-images", path, file);
}

/** Upload a product image */
export async function uploadProductImage(
  productId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const path = `${productId}/${timestamp}.${ext}`;
  return uploadFile("product-images", path, file);
}

/** Upload a gallery media item */
export async function uploadGalleryMedia(
  file: File,
  category?: string
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const folder = category || "uncategorized";
  const path = `${folder}/${timestamp}.${ext}`;
  return uploadFile("gallery-media", path, file);
}
