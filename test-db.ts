import { db } from "./db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testConnection() {
    try {
        const result = await db.execute(sql`SELECT 1`);
        console.log("Connection successful:", result);
    } catch (error) {
        console.error("Connection failed:", error);
    } finally {
        process.exit(0);
    }
}

testConnection();
