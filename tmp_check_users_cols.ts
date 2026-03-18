import { db } from "./db";
import { sql } from "drizzle-orm";

async function run() {
    console.log("Checking columns of users table...");
    const res = await db.execute(sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'users';`);
    console.log(res);
}

run().catch(console.error).finally(() => process.exit(0));
