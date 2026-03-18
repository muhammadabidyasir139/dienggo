import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./schema/relations";

const connectionString = process.env.DATABASE_URL!;

// Supabase always requires SSL; neon.tech uses rejectUnauthorized: false
const sslConfig = connectionString.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : "require";

export const client = postgres(connectionString, {
    prepare: false,
    ssl: sslConfig,
    max: 1, // Limit connections to prevent "MaxClients" errors on restricted plans
});

export const db = drizzle(client, { schema: { ...schema, ...relations } });
