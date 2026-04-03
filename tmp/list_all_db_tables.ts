import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString, { prepare: false, ssl: "require" });

async function main() {
  console.log("Listing every physical table in the DB...");
  try {
    const result = await client`
      SELECT n.nspname as schema,
             c.relname as table
      FROM pg_catalog.pg_class c
      LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'r'
      AND n.nspname NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schema, table;
    `;
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Failed to list tables:", err);
  } finally {
    await client.end();
  }
}

main();
