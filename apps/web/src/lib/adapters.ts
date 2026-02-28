/* ========================================
   DATA ADAPTERS
   Transform Supabase DB records to existing
   frontend component types
======================================== */

import type { Workshop } from "@/data";

// Type for a workshop row from Supabase
interface DbWorkshop {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  category: string;
  slug: string | null;
  workshop_type: string;
  price: number;
  date: string;
  start_time: string;
  end_time: string | null;
  duration: string | null;
  venue_name: string;
  venue_address: string | null;
  location: string | null;
  instructor: string | null;
  level: string | null;
  total_slots: number;
  available_slots: number;
  is_active: boolean;
  what_we_do: string[] | null;
  image: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  workshop_images?: Array<{
    id: string;
    image_url: string;
    sort_order: number;
  }>;
}

interface DbReview {
  id: string;
  user_id: string | null;
  author_name: string | null;
  workshop_id: string | null;
  workshop_type: string | null;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  featured: boolean;
  created_at: string;
}

interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  image: string | null;
  created_at: string;
  product_images?: Array<{
    id: string;
    image_url: string;
    sort_order: number;
  }>;
}

interface DbGalleryItem {
  id: string;
  media_url: string;
  media_type: string;
  category: string | null;
  caption: string | null;
  event_type: string | null;
  created_at: string;
}

/**
 * Transform a database workshop row into the frontend Workshop type
 */
export function dbToWorkshop(db: DbWorkshop): Workshop {
  // Format time to display format (e.g. "11:00" -> "11:00 AM")
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${minutes} ${ampm}`;
  };

  return {
    id: db.id,
    slug: db.slug || undefined,
    categoryId: db.category,
    title: db.title,
    description: db.description,
    image: db.image || "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
    price: db.price,
    date: db.date,
    time: formatTime(db.start_time),
    location: db.location || db.venue_name,
    venue: db.venue_name,
    instructor: db.instructor || "Offhanded Team",
    availableSeats: db.available_slots,
    duration: db.duration || "2 Hours",
  };
}

/**
 * Transform a list of DB workshops to frontend Workshop type
 */
export function dbToWorkshops(dbWorkshops: DbWorkshop[]): Workshop[] {
  return dbWorkshops.map(dbToWorkshop);
}

export type { DbWorkshop, DbReview, DbProduct, DbGalleryItem };
