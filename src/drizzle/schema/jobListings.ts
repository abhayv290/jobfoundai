import { pgTable, varchar, text, integer, pgEnum, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./schemaHelper";
import { OrganizationTable } from "./organizations";
import { relations } from "drizzle-orm";
import { JobApplicationTable } from "./jobApplication";


export const wageIntervals = ['hourly', 'monthly', 'yearly'] as const;
export const locationRequirements = ['office', 'hybrid', 'remote'] as const;
export const experiences = ['fresher', 'junior', 'mid-level', 'senior'] as const;
export const jobListingStatus = ['draft', 'published', 'de-listed'] as const;
export const jobListingType = ['internship', 'part-time', 'full-time'] as const;
export type WageInterval = typeof wageIntervals[number]
export type LocationRequirement = typeof locationRequirements[number]
export type Experience = typeof experiences[number]
export type JobListingStatus = typeof jobListingStatus[number]
export type JobListingType = typeof jobListingType[number]
export const wageIntervalEnum = pgEnum('job_listing_wage_intervals', wageIntervals);
export const locationRequirementsEnum = pgEnum('job_listing_location_requirements', locationRequirements);
export const experienceEnum = pgEnum('job_listing_experiences', experiences);
export const jobListingStatusEnum = pgEnum('job_listing_status', jobListingStatus);
export const jobListingTypeEnum = pgEnum('job_listing_type', jobListingType);


export const JobListingTable = pgTable('job_listings', {
    id,
    orgId: varchar().references(() => OrganizationTable.id, { onDelete: 'cascade' }).notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    wage: integer(),
    wageInterval: wageIntervalEnum(),
    stateAbbreviation: varchar(),
    city: varchar(),
    isFeatured: boolean().notNull().default(false),
    locationRequirement: locationRequirementsEnum().notNull(),
    experienceLevel: experienceEnum().notNull(),
    status: jobListingStatusEnum().notNull().default('draft'),
    type: jobListingTypeEnum().notNull(),
    postedAt: timestamp({
        withTimezone: true
    }),
    createdAt,
    updatedAt
},
    table => [index().on(table.stateAbbreviation)]
)



export const jobListingsReferences = relations(JobListingTable, ({ one, many }) => ({
    organizations: one(OrganizationTable, {
        fields: [JobListingTable.orgId],
        references: [OrganizationTable.id]
    }),
    applications: many(JobApplicationTable)
}))