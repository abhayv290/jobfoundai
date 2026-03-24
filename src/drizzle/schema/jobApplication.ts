import { integer, pgEnum, pgTable, primaryKey, text, uuid, varchar } from "drizzle-orm/pg-core";
import { JobListingTable } from "./jobListings";
import { UserTable } from "./users";
import { createdAt, updatedAt } from "./schemaHelper";
import { relations } from "drizzle-orm";

export const applicationStages = ['denied', 'interested', 'applied', 'hired', 'interviewed'] as const;
export type ApplicationStages = typeof applicationStages[number];

export const applicationEnum = pgEnum('applications_enum', applicationStages);

export const JobApplicationTable = pgTable('job_applications', {
    jobListingId: uuid().references(() => JobListingTable.id, { onDelete: 'cascade' }).notNull(),
    userId: varchar().references(() => UserTable.id, { onDelete: 'cascade' }).notNull(),
    coverLetter: text(),
    rating: integer(),
    stage: applicationEnum().notNull().default('applied'),
    createdAt,
    updatedAt
},
    table => [primaryKey({ columns: [table.jobListingId, table.userId] })]  // making unique together
)



/** Job applications relation  */
export const jobApplicationsRelations = relations(JobApplicationTable, ({ one }) => ({
    jobListing: one(JobListingTable, {
        fields: [JobApplicationTable.jobListingId],
        references: [JobListingTable.id]
    }),
    user: one(UserTable, {
        fields: [JobApplicationTable.userId],
        references: [UserTable.id]
    })
}))