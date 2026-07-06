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
  
  // Note: Depending on foreign key constraints (bookings, reviews), this might fail
  // if you have restricted deletes. Assuming cascading deletes or ignoring errors.
  const { error } = await supabase
    .from("workshops")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Dummy condition to delete all
    
  if (error) {
    console.error("Error deleting all workshops:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/");
  revalidatePath("/workshops");
  revalidatePath("/admin/workshops");
  
  return { success: true };
}
