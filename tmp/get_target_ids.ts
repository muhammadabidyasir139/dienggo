import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString, { prepare: false, ssl: "require" });

async function main() {
  const result = await client`SELECT id, nama FROM villas`;
  console.log(JSON.stringify(result, null, 2));
  await client.end();
}

main();
