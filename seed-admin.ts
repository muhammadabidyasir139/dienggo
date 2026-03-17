import { db } from "./db";
import { users } from "./db/schema/users";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seedAdmin() {
    console.log("Seeding admin user...");
    const email = "admin@dienggo.com";
    const password = "admin123";
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed.");
        
        await db.insert(users).values({
            email,
            password: hashedPassword,
            name: "Administrator",
            role: "admin",
        });
        
        console.log("-----------------------------------");
        console.log("Admin user created successfully!");
        console.log("Email: " + email);
        console.log("Password: " + password);
        console.log("-----------------------------------");
    } catch (error: any) {
        if (error.code === '23505') {
            console.log("Admin user already exists.");
        } else {
            console.error("Error seeding admin user:", error);
        }
    } finally {
        process.exit(0);
    }
}

seedAdmin();
