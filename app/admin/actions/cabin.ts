"use server";

import { db } from "@/db";
import { cabins } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCabins() {
    return await db.select().from(cabins).orderBy(desc(cabins.createdAt));
}

export async function getCabinById(id: string) {
    const result = await db.select().from(cabins).where(eq(cabins.id, id));
    return result[0];
}

export async function getCabinBySlug(slug: string) {
    const result = await db.select().from(cabins).where(eq(cabins.slug, slug));
    return result[0];
}

export async function createCabin(data: any) {
    try {
        const [newCabin] = await db.insert(cabins).values(data).returning();
        revalidatePath("/admin/cabin");
        return { success: true, data: newCabin };
    } catch (error: any) {
        console.error("Create cabin error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateCabin(id: string, data: any) {
    try {
        const [updatedCabin] = await db
            .update(cabins)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(cabins.id, id))
            .returning();
        revalidatePath("/admin/cabin");
        return { success: true, data: updatedCabin };
    } catch (error: any) {
        console.error("Update cabin error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteCabin(id: string) {
    try {
        await db.delete(cabins).where(eq(cabins.id, id));
        revalidatePath("/admin/cabin");
        return { success: true };
    } catch (error: any) {
        console.error("Delete cabin error:", error);
        return { success: false, error: error.message };
    }
}
