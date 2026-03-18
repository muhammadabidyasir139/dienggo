import { db } from "./db";
import { sql } from "drizzle-orm";

async function run() {
    console.log("Fixing users table...");
    try {
        await db.execute(sql`ALTER TABLE public.users ADD COLUMN phone text;`);
        console.log("Added phone column");
    } catch (e: any) { console.log(e.message); }
    
    try {
        await db.execute(sql`ALTER TABLE public.users ADD COLUMN image text;`);
        console.log("Added image column");
    } catch (e: any) { console.log(e.message); }
    
    console.log("Done");
}

run().catch(console.error).finally(() => process.exit(0));
