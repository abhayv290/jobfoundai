import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { createdAt, updatedAt } from "./schemaHelper";
import { relations } from "drizzle-orm";


export const UserSettingsTable = pgTable('user_settings', {
    userId: varchar().notNull().references(() => UserTable.id, { onDelete: 'cascade' }),
    newJobEmailNotification: boolean().notNull().default(false),
    aiPrompt: varchar(),
    createdAt,
    updatedAt,
})


/** User Notifications Settings relations  */
export const userSettingsRelations = relations(UserSettingsTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [UserSettingsTable.userId],
        references: [UserTable.id]
    })
}))