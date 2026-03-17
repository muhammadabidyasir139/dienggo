import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { cabins } from "./cabins";
import { facilities } from "./facilities";

export const cabinFacilities = pgTable("cabin_facilities", {
    cabinId: uuid("cabin_id").references(() => cabins.id, { onDelete: "cascade" }),
    facilityId: uuid("facility_id").references(() => facilities.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        pk: primaryKey(table.cabinId, table.facilityId),
    };
});
