'use server'
import { db } from "@/drizzle/db";
import { JobApplicationTable, JobListingTable, UserResumeTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { getJobApplicationIdCacheTag } from "./cache/applications";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResume";
import z from "zod";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListing";
import { insertJobApplication } from "./dbActions";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { inngest } from "@/services/inngest/client";
import { jobApplicationSchema } from "@/features/jobListings/actions/schemas";


export async function getJobApplication(listingId: string, userId: string) {
    'use cache'
    cacheTag(getJobApplicationIdCacheTag(userId, listingId))
    const data = await db.query.JobApplicationTable.findFirst({
        where: and(eq(JobApplicationTable.userId, userId), eq(JobApplicationTable.jobListingId, listingId))
    })
    return data
}


export async function getUserResume(userId: string) {
    'use cache'
    cacheTag(getUserResumeIdTag(userId))
    return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId)
    })
}


export async function createJobApplication(listingId: string, unsafeData: z.infer<typeof jobApplicationSchema>) {
    const { userId } = await getCurrentUser()
    if (!userId) {
        return {
            error: true,
            message: 'Permission Denied'
        }
    }
    const [userResume, listing] = await Promise.all([
        getUserResume(userId),
        getPublicJobListing(listingId)
    ])
    if (!userResume || !listing) {
        return {
            error: true,
            message: 'This job Application does\'t Exists'
        }
    }

    const { success, data } = jobApplicationSchema.safeParse(unsafeData)
    if (!success) return {
        error: true,
        message: 'Error Submitting the application'
    }

    await insertJobApplication({
        jobListingId: listing.id, userId, ...data
    })

    //TODO - Ai Generation using ingest
    // await inngest.send({
    //     name: 'app/jobApplication.created',
    //     data: { jobListingId: listing.id, userId }
    // })
    return {
        error: false,
        message: 'Your Application is Submitted'
    }

}

async function getPublicJobListing(id: string) {
    'use cache'
    cacheTag(getJobListingIdTag(id))
    return await db.query.JobListingTable.findFirst({
        where: and(eq(JobListingTable.id, id), eq(JobListingTable.status, 'published')),
        columns: {
            id: true
        }
    })
}

