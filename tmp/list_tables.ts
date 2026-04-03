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
  console.log("Listing all tables in public schema...");
  try {
    const result = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Failed to list tables:", err);
  } finally {
    await client.end();
  }
}

main();
