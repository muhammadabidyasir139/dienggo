import {
    pgTable,
    boolean,
    timestamp,
    integer,
} from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
    id: integer("id").primaryKey().default(1),
    isMaintenanceMode: boolean("is_maintenance_mode").default(false).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
