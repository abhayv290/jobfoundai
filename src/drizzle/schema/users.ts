import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "./schemaHelper";
import { relations } from "drizzle-orm";
import { UserSettingsTable } from "./userSettings";
import { UserResumeTable } from "./userResume";
import { OrgsUserSettings } from "./orgsUserSettings";


export const UserTable = pgTable('users', {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    email: varchar().notNull().unique(),
    avatar: varchar().notNull(),
    createdAt,
    updatedAt,
})



/** User relations  */
export const userRelations = relations(UserTable, ({ one, many }) => ({
    notificationSettings: one(UserSettingsTable),
    resume: one(UserResumeTable),
    orgsUserSettings: many(OrgsUserSettings),
}))