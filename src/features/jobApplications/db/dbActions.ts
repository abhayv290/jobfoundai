import { db } from "@/drizzle/db";
import { JobApplicationTable } from "@/drizzle/schema";
import { revalidateJobApplicationCacheTags } from "./cache/applications";
import { and, eq } from "drizzle-orm";

export async function insertJobApplication(app: typeof JobApplicationTable.$inferInsert) {
    await db.insert(JobApplicationTable).values(app).onConflictDoNothing({
        target: [
            JobApplicationTable.jobListingId,
            JobApplicationTable.userId
        ]
    })
    revalidateJobApplicationCacheTags(app.userId, app.jobListingId)
}

export async function updateJobListingApplication(jobListingId: string, userId: string, data: Partial<Omit<typeof JobApplicationTable.$inferInsert, 'userId' | 'jobListingId'>>) {
    await db.update(JobApplicationTable).set(data).
        where(and(eq(JobApplicationTable.userId, userId),
            eq(JobApplicationTable.jobListingId, jobListingId)))

    //revalidating the caches
    revalidateJobApplicationCacheTags(userId, jobListingId)
}