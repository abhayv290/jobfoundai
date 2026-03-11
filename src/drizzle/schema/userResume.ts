import { pgTable, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { createdAt, updatedAt } from "./schemaHelper";
import { relations } from "drizzle-orm";


export const UserResumeTable = pgTable('user_resumes', {
    userId: varchar('userId').primaryKey().references(() => UserTable.id, { onDelete: 'cascade' }),
    resumeFileUrl: varchar().notNull(),
    resumeFileKey: varchar().notNull(),
    aiSummary: varchar(),
    createdAt,
    updatedAt
})



export const userResumeRelations = relations(UserResumeTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [UserResumeTable.userId],
        references: [UserTable.id]
    })
}))