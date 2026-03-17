"use server";

import { db } from "@/db";
import { jeeps, jeepIncludes, facilities } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getJeeps() {
  return await db.select().from(jeeps).orderBy(desc(jeeps.createdAt));
}

export async function getJeepBySlug(slug: string) {
  const result = await db.query.jeeps.findFirst({
    where: eq(jeeps.slug, slug),
    with: {
      includes: {
        with: {
          facility: true,
        },
      },
    },
  });
  return result;
}

export async function getJeepById(id: string) {
  const result = await db.select().from(jeeps).where(eq(jeeps.id, id));
  return result[0];
}

export async function createJeep(data: any) {
  try {
    const [newJeep] = await db.insert(jeeps).values(data).returning();
    revalidatePath("/admin/jeep");
    return { success: true, data: newJeep };
  } catch (error: any) {
    console.error("Create jeep error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateJeep(id: string, data: any) {
  try {
    const [updatedJeep] = await db
      .update(jeeps)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(jeeps.id, id))
      .returning();
    revalidatePath("/admin/jeep");
    return { success: true, data: updatedJeep };
  } catch (error: any) {
    console.error("Update jeep error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteJeep(id: string) {
  try {
    await db.delete(jeeps).where(eq(jeeps.id, id));
    revalidatePath("/admin/jeep");
    return { success: true };
  } catch (error: any) {
    console.error("Delete jeep error:", error);
    return { success: false, error: error.message };
  }
}
