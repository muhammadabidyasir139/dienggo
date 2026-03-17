import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { villas } from "./villas";
import { facilities } from "./facilities";

export const villaFacilities = pgTable("villa_facilities", {
    villaId: uuid("vill-id").references(() => villas.id, { onDelete: "cascade" }),
    facilityId: uuid("facility_id").references(() => facilities.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        pk: primaryKey(table.villaId, table.facilityId),
    };
});
