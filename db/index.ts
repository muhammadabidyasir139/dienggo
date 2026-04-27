import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./schema/relations";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  console.warn(
    "DATABASE_URL is not defined. Database will not be initialized.",
  );
}

// Supabase always requires SSL; neon.tech uses rejectUnauthorized: false
const sslConfig = connectionString.includes("neon.tech")
  ? { rejectUnauthorized: false }
  : "require";

// Use a global variable to prevent multiple connections in development
const globalForDb = global as unknown as {
  client: postgres.Sql | undefined;
};

const client =
  globalForDb.client ??
  (connectionString
    ? postgres(connectionString, {
        prepare: false,
        ssl: sslConfig,
        max: 1, // Stay at 1 for Supabase Session mode to avoid "MaxClientsInSessionMode" error
      })
    : null);

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client as postgres.Sql;
}

export const db = drizzle(client as any, {
  schema: { ...schema, ...relations },
});
export { client };
