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
  const targetNames = ["jl raya dieng", "Villa Dieng View Luxury"];
  console.log(`Attempting to delete villas: ${targetNames.join(", ")}`);

  try {
    // Find IDs first
    const villasToDel = await client`SELECT id, nama FROM villas WHERE nama IN ${client(targetNames)}`;
    
    if (villasToDel.length === 0) {
      console.log("No villas were found with those exact names.");
      await client.end();
      return;
    }

    const ids = villasToDel.map(v => v.id);
    console.log(`Found ${villasToDel.length} villas. IDs: ${ids.join(", ")}`);

    // Delete from villa_facilities (column name is "vill-id" per schema)
    console.log("Deleting from villa_facilities...");
    await client`DELETE FROM villa_facilities WHERE "vill-id" IN ${client(ids)}`;

    // Update bookings
    console.log("Setting villa_id to NULL in bookings...");
    await client`UPDATE bookings SET villa_id = NULL WHERE villa_id IN ${client(ids)}`;

    // Delete the villas
    console.log("Deleting from villas...");
    const deleted = await client`DELETE FROM villas WHERE id IN ${client(ids)} RETURNING nama`;

    console.log(`Success! Deleted ${deleted.length} villas: ${deleted.map(v => v.nama).join(", ")}`);
  } catch (err: any) {
    console.error("An error occurred during deletion:");
    console.error(err.message || err);
    if (err.detail) console.error("Detail:", err.detail);
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
