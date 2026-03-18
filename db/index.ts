import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./schema/relations";

const connectionString = process.env.DATABASE_URL!;

export const client = postgres(connectionString, {
    prepare: false,
    ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : (process.env.NODE_ENV === 'production' ? "require" : false),
    max: 1, // Limit connections to prevent "MaxClients" errors on restricted plans
});

export const db = drizzle(client, { schema: { ...schema, ...relations } });
