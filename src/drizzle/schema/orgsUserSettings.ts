import { boolean, integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { OrganizationTable } from "./organizations";
import { createdAt, updatedAt } from "./schemaHelper";
import { relations } from "drizzle-orm";



export const OrgsUserSettings = pgTable('orgs_user_settings', {
    userId: varchar().notNull().references(() => UserTable.id, { onDelete: 'cascade' }),
    orgsId: varchar().notNull().references(() => OrganizationTable.id, { onDelete: 'cascade' }),
    newApplicationEmailNotifications: boolean().notNull().default(false),
    minimumRating: integer(),
    createdAt,
    updatedAt,
},
    table => [primaryKey({ columns: [table.userId, table.orgsId] })]
)



/** orgs Settings Relations  */
export const orgsSettingsRelations = relations(OrgsUserSettings, ({ one }) => ({
    user: one(UserTable, {
        fields: [OrgsUserSettings.userId],
        references: [UserTable.id]
    }),
    organization: one(OrganizationTable, {
        fields: [OrgsUserSettings.orgsId],
        references: [OrganizationTable.id]
    })
}))