"use server";

import { db } from "@/db";
import { facilities } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getFacilities() {
  return await db.select().from(facilities).orderBy(desc(facilities.name));
}

export async function getFacilityById(id: string) {
  const result = await db
    .select()
    .from(facilities)
    .where(eq(facilities.id, id));
  return result[0];
}

export async function createFacility(data: any) {
  try {
    const [newFacility] = await db.insert(facilities).values(data).returning();
    revalidatePath("/admin/facilities");
    return { success: true, data: newFacility };
  } catch (error: any) {
    console.error("Create facility error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateFacility(id: string, data: any) {
  try {
    const [updatedFacility] = await db
      .update(facilities)
      .set({ ...data })
      .where(eq(facilities.id, id))
      .returning();
    revalidatePath("/admin/facilities");
    return { success: true, data: updatedFacility };
  } catch (error: any) {
    console.error("Update facility error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFacility(id: string) {
  try {
    await db.delete(facilities).where(eq(facilities.id, id));
    revalidatePath("/admin/facilities");
    return { success: true };
  } catch (error: any) {
    console.error("Delete facility error:", error);
    return { success: false, error: error.message };
  }
}
