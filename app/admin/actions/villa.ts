"use server";

import { db } from "@/db";
import { villas } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getVillas() {
    return await db.select().from(villas).orderBy(desc(villas.createdAt));
}

export async function getVillaById(id: string) {
    const result = await db.select().from(villas).where(eq(villas.id, id));
    return result[0];
}

export async function getVillaBySlug(slug: string) {
    const result = await db.select().from(villas).where(eq(villas.slug, slug));
    return result[0];
}

export async function createVilla(data: any) {
    try {
        const [newVilla] = await db.insert(villas).values(data).returning();
        revalidatePath("/admin/villa");
        return { success: true, data: newVilla };
    } catch (error: any) {
        console.error("Create villa error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateVilla(id: string, data: any) {
    try {
        const [updatedVilla] = await db
            .update(villas)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(villas.id, id))
            .returning();
        revalidatePath("/admin/villa");
        return { success: true, data: updatedVilla };
    } catch (error: any) {
        console.error("Update villa error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteVilla(id: string) {
    try {
        await db.delete(villas).where(eq(villas.id, id));
        revalidatePath("/admin/villa");
        return { success: true };
    } catch (error: any) {
        console.error("Delete villa error:", error);
        return { success: false, error: error.message };
    }
}
