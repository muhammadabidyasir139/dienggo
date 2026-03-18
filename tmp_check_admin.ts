import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { config } from "dotenv";

config({ path: ".env.local" });

async function checkAdmin() {
    console.log("Checking admin users...");
    const admins = await db.select().from(users).where(eq(users.role, "admin"));
    console.log("Admin users found:", admins.map(u => ({ email: u.email, role: u.role })));
}

checkAdmin().catch(console.error);
