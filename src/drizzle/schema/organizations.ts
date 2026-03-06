import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "./schemaHelper";
import { relations } from "drizzle-orm";
import { JobListingTable } from "./jobListings";
import { OrgsUserSettings } from "./orgsUserSettings";




export const OrganizationTable = pgTable('organizations', {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    avatar: varchar().notNull(),
    createdAt,
    updatedAt
})



/** Defining relations  */
export const organizationRelations = relations(OrganizationTable, ({ many }) => ({
    jobListings: many(JobListingTable),
    orgsUserSettings: many(OrgsUserSettings)
}))