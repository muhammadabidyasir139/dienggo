import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../db/index";
import { villas } from "../db/schema/villas";
import { villaFacilities } from "../db/schema/villa_facilities";
import { bookings } from "../db/schema/bookings";
import { inArray } from "drizzle-orm";

async function main() {
  const ids = ["267040d8-b549-4748-b247-7fbc0e2098f9", "da4e9998-99ff-46bc-af7e-ae5939bbd12f"];
  console.log(`Starting deletion for villas: ${ids.join(", ")}`);

  try {
    // 1. Update bookings to unlink these villas
    console.log("Unlinking bookings...");
    await db.update(bookings).set({ villaId: null }).where(inArray(bookings.villaId, ids));

    // 2. Delete from villa_facilities
    console.log("Removing facilities data...");
    await db.delete(villaFacilities).where(inArray(villaFacilities.villaId, ids));

    // 3. Finally delete the villas themselves
    console.log("Deleting the villas...");
    const result = await db.delete(villas).where(inArray(villas.id, ids)).returning();

    console.log(`Deletion successful! Deleted ${result.length} villas:`);
    console.log(result.map(v => v.nama));
  } catch (error) {
    console.error("Deletion failed with error:", error);
  } finally {
    process.exit(0);
  }
}

main();
