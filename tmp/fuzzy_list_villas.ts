import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "";
if (!connectionString) {
  console.error("DATABASE_URL is not defined");
  process.exit(1);
}

const sslConfig = connectionString.includes("neon.tech")
  ? { rejectUnauthorized: false }
  : "require";

const client = postgres(connectionString, {
  prepare: false,
  ssl: sslConfig,
});

async function main() {
  console.log("Searching for villas with fuzzy names...");
  try {
    const result = await client`
      SELECT id, nama FROM villas 
      WHERE nama ILIKE '%dieng%' 
      OR nama ILIKE '%luxury%';
    `;
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Failed to search villas:", err);
  } finally {
    await client.end();
  }
}

main();
