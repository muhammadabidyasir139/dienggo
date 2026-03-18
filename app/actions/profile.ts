"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(userId: string, formData: {
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
}) {
    try {
        await db
            .update(users)
            .set({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                image: formData.image,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

        revalidatePath("/dashboard/profil");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, error: "Gagal memperbarui profil" };
    }
}
