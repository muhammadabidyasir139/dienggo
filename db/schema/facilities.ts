import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const facilities = pgTable("facilities", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(),
    icon: text("icon"),
});
