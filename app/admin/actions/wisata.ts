"use server";

import { db } from "@/db";
import { wisata } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getWisatas() {
    return await db.select().from(wisata).orderBy(desc(wisata.createdAt));
}

export async function getWisataById(id: string) {
    const result = await db.select().from(wisata).where(eq(wisata.id, id));
    return result[0];
}

export async function createWisata(data: any) {
    try {
        const [newWisata] = await db.insert(wisata).values(data).returning();
        revalidatePath("/admin/wisata");
        return { success: true, data: newWisata };
    } catch (error: any) {
        console.error("Create wisata error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateWisata(id: string, data: any) {
    try {
        const [updatedWisata] = await db
            .update(wisata)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(wisata.id, id))
            .returning();
        revalidatePath("/admin/wisata");
        return { success: true, data: updatedWisata };
    } catch (error: any) {
        console.error("Update wisata error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteWisata(id: string) {
    try {
        await db.delete(wisata).where(eq(wisata.id, id));
        revalidatePath("/admin/wisata");
        return { success: true };
    } catch (error: any) {
        console.error("Delete wisata error:", error);
        return { success: false, error: error.message };
    }
}
