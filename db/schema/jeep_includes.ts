import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { jeeps } from "./jeeps";
import { facilities } from "./facilities";

export const jeepIncludes = pgTable("jeep_includes", {
    jeepId: uuid("jeep_id").references(() => jeeps.id, { onDelete: "cascade" }),
    facilityId: uuid("facility_id").references(() => facilities.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        pk: primaryKey(table.jeepId, table.facilityId),
    };
});
