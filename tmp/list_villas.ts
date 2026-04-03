import { db } from "./db";
import { villas } from "./db/schema/villas";

async function main() {
  const allVillas = await db.select().from(villas);
  console.log(JSON.stringify(allVillas, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
