import { relations } from "drizzle-orm";
import { jeeps } from "./jeeps";
import { facilities } from "./facilities";
import { jeepIncludes } from "./jeep_includes";

export const jeepRelations = relations(jeeps, ({ many }) => ({
    includes: many(jeepIncludes),
}));

export const facilityRelations = relations(facilities, ({ many }) => ({
    jeepIncludes: many(jeepIncludes),
}));

export const jeepIncludesRelations = relations(jeepIncludes, ({ one }) => ({
    jeep: one(jeeps, {
        fields: [jeepIncludes.jeepId],
        references: [jeeps.id],
    }),
    facility: one(facilities, {
        fields: [jeepIncludes.facilityId],
        references: [facilities.id],
    }),
}));
