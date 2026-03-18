import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

async function resetAdmin() {
    console.log("Resetting admin password...");
    const email = "admin@dienggo.com";
    const password = "admin123";
    
    // Check if user exists
    const admins = await db.select().from(users).where(eq(users.email, email));
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (admins.length > 0) {
        await db.update(users)
            .set({ password: hashedPassword, role: "admin" })
            .where(eq(users.email, email));
        console.log("Admin password updated!");
    } else {
        await db.insert(users).values({
            email,
            password: hashedPassword,
            name: "Administrator",
            role: "admin",
        });
        console.log("Admin user created!");
    }
}

resetAdmin().catch(console.error).finally(() => process.exit(0));
