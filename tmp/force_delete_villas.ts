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
  const ids = ["267040d8-b549-4748-b247-7fbc0e2098f9", "da4e9998-99ff-46bc-af7e-ae5939bbd12f"];
  console.log(`Force deleting villas: ${ids.join(", ")}`);
  try {
    const result = await client`DELETE FROM villas WHERE id IN ${client(ids)} RETURNING nama`;
    console.log(`Success! Deleted ${result.length} villas.`);
    console.log(JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error("Deletion failed with detailed internal error:");
    if (err.detail) console.error("Detail:", err.detail);
    else console.error("Message:", err.message || err);
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
