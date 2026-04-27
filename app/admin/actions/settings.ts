"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    try {
        let result = await db.select().from(settings).where(eq(settings.id, 1));
        
        if (result.length === 0) {
            // Initialize settings if not exists
            const [newSettings] = await db.insert(settings).values({ id: 1 }).returning();
            return newSettings;
        }
        
        return result[0];
    } catch (error) {
        console.error("Error getting settings:", error);
        return { isMaintenanceMode: false };
    }
}

export async function updateMaintenanceMode(isMaintenance: boolean) {
    try {
        await db.update(settings)
            .set({ isMaintenanceMode: isMaintenance, updatedAt: new Date() })
            .where(eq(settings.id, 1));
            
        revalidatePath("/");
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating maintenance mode:", error);
        return { success: false, error: "Failed to update maintenance mode" };
    }
}
