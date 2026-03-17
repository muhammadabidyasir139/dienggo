"use server";

import { db } from "@/db";
import { wisata } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAktivitas() {
    return await db.select().from(wisata).orderBy(desc(wisata.createdAt));
}

export async function getAktivitasById(id: string) {
    const result = await db.select().from(wisata).where(eq(wisata.id, id));
    return result[0];
}

export async function createAktivitas(data: any) {
    try {
        const [newAktivitas] = await db.insert(wisata).values(data).returning();
        revalidatePath("/admin/aktivitas");
        return { success: true, data: newAktivitas };
    } catch (error: any) {
        console.error("Create aktivitas error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateAktivitas(id: string, data: any) {
    try {
        const [updatedAktivitas] = await db
            .update(wisata)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(wisata.id, id))
            .returning();
        revalidatePath("/admin/aktivitas");
        return { success: true, data: updatedAktivitas };
    } catch (error: any) {
        console.error("Update aktivitas error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteAktivitas(id: string) {
    try {
        await db.delete(wisata).where(eq(wisata.id, id));
        revalidatePath("/admin/aktivitas");
        return { success: true };
    } catch (error: any) {
        console.error("Delete aktivitas error:", error);
        return { success: false, error: error.message };
    }
}
