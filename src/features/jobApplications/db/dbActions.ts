import { db } from "@/drizzle/db";
import { JobApplicationTable } from "@/drizzle/schema";
import { revalidateJobApplicationCacheTags } from "./cache/applications";

export async function insertJobApplication(app: typeof JobApplicationTable.$inferInsert) {
    await db.insert(JobApplicationTable).values(app).onConflictDoNothing({
        target: [
            JobApplicationTable.jobListingId,
            JobApplicationTable.userId
        ]
    })
    revalidateJobApplicationCacheTags(app.userId, app.jobListingId)
}