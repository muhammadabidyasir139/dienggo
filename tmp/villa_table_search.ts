import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString, { prepare: false, ssl: "require" });

async function main() {
  console.log("Searching for ANY table in ANY schema that has 'villa' in the name...");
  try {
    const result = await client`
      SELECT n.nspname as schema_name, relname as table_name
      FROM pg_catalog.pg_class c
      JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      WHERE relname ILIKE '%villa%';
    `;
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Failed to search tables:", err);
  } finally {
    await client.end();
  }
}

main();
