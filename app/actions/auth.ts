"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerUser(data: any) {
    try {
        const { name, email, phone, password } = data;

        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        
        if (existingUser.length > 0) {
            return { error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.insert(users).values({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "customer", // Default role
        });

        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { error: "Terjadi kesalahan saat mendaftar. Silakan coba lagi." };
    }
}
