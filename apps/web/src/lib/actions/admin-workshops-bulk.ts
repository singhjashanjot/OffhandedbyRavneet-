"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/queries/admin";

export async function deactivateAllWorkshops() {
  await requireAdmin();
  const supabase = createClient();
  
  const { error } = await supabase
    .from("workshops")
    .update({ is_active: false })
    .neq("is_active", false); // Only update active ones to avoid unnecessary rows
    
  if (error) {
    console.error("Error deactivating all workshops:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/");
  revalidatePath("/workshops");
  revalidatePath("/admin/workshops");
  
  return { success: true };
}

export async function deleteAllWorkshops() {
  await requireAdmin();
  const supabase = createClient();
  
  // Fetch all workshops with date and title
  const { data: workshops, error: fetchErr } = await supabase
    .from("workshops")
    .select("id, date, title");

  if (fetchErr) {
    console.error("Error fetching workshops for bulk delete:", fetchErr);
    return { success: false, error: fetchErr.message };
  }

  if (!workshops || workshops.length === 0) {
    return { success: true, message: "No workshops to delete.", deletedCount: 0, deactivatedCount: 0, skippedCount: 0 };
  }

  // Fetch all booking workshop IDs to see which workshops have bookings
  const { data: bookings, error: bookingsErr } = await supabase
    .from("bookings")
    .select("workshop_id");

  if (bookingsErr) {
    console.error("Error fetching bookings for bulk delete:", bookingsErr);
    return { success: false, error: bookingsErr.message };
  }

  const bookedWorkshopIds = new Set((bookings || []).map((b: any) => b.workshop_id));

  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' } as const;
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  const today = formatter.format(new Date());

  let deletedCount = 0;
  let deactivatedCount = 0;
  let skippedCount = 0;

  for (const ws of workshops) {
    if (bookedWorkshopIds.has(ws.id)) {
      // Check if workshop is upcoming
      const isUpcoming = ws.date ? ws.date >= today : true;
      if (isUpcoming) {
        skippedCount++;
        continue; // Do NOT deactivate or delete upcoming workshops with bookings
      }

      // Soft-delete/deactivate since it has bookings and is a past workshop
      const { error: updateErr } = await supabase
        .from("workshops")
        .update({ is_active: false })
        .eq("id", ws.id);

      if (updateErr) {
        console.error(`Error deactivating workshop ${ws.id}:`, updateErr);
      } else {
        deactivatedCount++;
      }
    } else {
      // Hard-delete since it has no bookings
      // Delete images first
      await supabase
        .from("workshop_images")
        .delete()
        .eq("workshop_id", ws.id);

      const { error: deleteErr } = await supabase
        .from("workshops")
        .delete()
        .eq("id", ws.id);

      if (deleteErr) {
        console.error(`Error deleting workshop ${ws.id}:`, deleteErr);
      } else {
        deletedCount++;
      }
    }
  }
  
  revalidatePath("/");
  revalidatePath("/workshops");
  revalidatePath("/admin/workshops");
  
  return { success: true, deletedCount, deactivatedCount, skippedCount };
}

export async function resetAllTestData() {
  await requireAdmin();
  const supabase = createClient();

  // 1. Delete order_items
  const { error: itemsErr } = await supabase
    .from("order_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (itemsErr) {
    console.error("Error deleting order items:", itemsErr);
    return { success: false, error: itemsErr.message };
  }

  // 2. Delete orders
  const { error: ordersErr } = await supabase
    .from("orders")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (ordersErr) {
    console.error("Error deleting orders:", ordersErr);
    return { success: false, error: ordersErr.message };
  }

  // 3. Delete bookings
  const { error: bookingsErr } = await supabase
    .from("bookings")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (bookingsErr) {
    console.error("Error deleting bookings:", bookingsErr);
    return { success: false, error: bookingsErr.message };
  }

  // 4. Delete payments
  const { error: paymentsErr } = await supabase
    .from("payments")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (paymentsErr) {
    console.error("Error deleting payments:", paymentsErr);
    return { success: false, error: paymentsErr.message };
  }

  // 5. Delete workshop_images
  const { error: imagesErr } = await supabase
    .from("workshop_images")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (imagesErr) {
    console.error("Error deleting workshop images:", imagesErr);
  }

  // 6. Delete workshops
  const { error: workshopsErr } = await supabase
    .from("workshops")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (workshopsErr) {
    console.error("Error deleting workshops:", workshopsErr);
    return { success: false, error: workshopsErr.message };
  }

  revalidatePath("/");
  revalidatePath("/workshops");
  revalidatePath("/admin/workshops");
  revalidatePath("/admin");

  return { success: true };
}
