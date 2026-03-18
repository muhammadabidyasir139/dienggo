import { db, client } from "./db";
import { users } from "./db/schema/users";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seedCustomer() {
    console.log("Seeding customer user...");
    const email = "customer@dienggo.com";
    const password = "customer123";
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed.");
        
        await db.insert(users).values({
            email,
            password: hashedPassword,
            name: "Test Customer",
            role: "customer",
        });
        
        console.log("-----------------------------------");
        console.log("Customer user created successfully!");
        console.log("Email: " + email);
        console.log("Password: " + password);
        console.log("-----------------------------------");
    } catch (error: any) {
        if (error.code === '23505' || error.message?.includes('unique constraint')) {
            console.log("Customer user already exists.");
        } else {
            console.error("Error seeding customer user:", error);
        }
    } finally {
        if (client) {
            await client.end();
        }
    }
}

seedCustomer();
