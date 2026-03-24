'use server'
import { db } from "@/drizzle/db";
import { applicationStages, ApplicationStages, JobApplicationTable, JobListingTable, UserResumeTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { getJobApplicationIdCacheTag, getJobApplicationListingCacheTag, } from "./cache/applications";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResume";
import z from "zod";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListing";
import { insertJobApplication, updateJobListingApplication } from "./dbActions";
import { getCurrentOrg, getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { inngest } from "@/services/inngest/client";
import { jobApplicationSchema } from "@/features/jobListings/actions/schemas";
import { getUserIdTag } from "@/features/users/db/cache/users";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";



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


    await inngest.send({
        name: 'app/jobApplication.created',
        data: { jobListingId: listing.id, userId }
    })
    return {
        error: false,
        message: 'Your Application is Submitted'
    }

}

async function getPublicJobListing(id: string) {
    'use cache'
    cacheTag(getJobListingIdTag(id))
    cacheTag(getJobListingIdTag(id))
    return await db.query.JobListingTable.findFirst({
        where: and(eq(JobListingTable.id, id), eq(JobListingTable.status, 'published')),
        columns: {
            id: true
        }
    })
}



export async function getJobListingApplications(id: string) {
    'use cache'
    cacheTag(getJobApplicationListingCacheTag(id))

    const data = await db.query.JobApplicationTable.findMany({
        where: eq(JobApplicationTable.jobListingId, id),
        columns: {
            userId: false, updatedAt: false
        },
        with: {
            user: {
                columns: {
                    name: true, id: true, avatar: true
                },
                with: {
                    resume: {
                        columns: {
                            aiSummary: true, resumeFileUrl: true
                        }
                    }
                }
            }
        }
    })
    //caching for specific users 
    data.forEach(({ user }) => {
        cacheTag(getUserIdTag(user.id))
        cacheTag(getUserResumeIdTag(user.id))
    })
    return data
}


export async function updateApplicationStage(userId: string, jobListingId: string, stage: ApplicationStages) {
    const { orgId } = await getCurrentOrg()
    if (!orgId || !(await hasOrgUserPermission('org:job_listing:job_listings_appication_change_stage'))) {
        return {
            error: true,
            message: 'you don\'t have permission to update the stage'
        }
    }
    const { success, data } = z.enum(applicationStages).safeParse(stage)
    if (!success) {
        return {
            error: true,
            message: 'Invalid Stage Key'
        }
    }
    const jobListing = await getJobListing(jobListingId, orgId)
    if (!jobListing) return {
        error: true,
        message: 'this jobLIsting doesn\'t exist '
    }
    await updateJobListingApplication(jobListing.id, userId, { stage: data })
    return {
        error: false,
        message: 'Application Stage Updated'
    }

}

export async function updateApplicationRating(userId: string, jobListingId: string, rating: number | null) {
    const { orgId } = await getCurrentOrg()
    if (!orgId || !(await hasOrgUserPermission('org:job_listing:job_listings_applicant_change_rating'))) {
        return {
            error: true,
            message: 'you don\'t have permission to update the Rating'
        }
    }
    const { success, data } = z.number().min(1).max(5).nullish().safeParse(rating)
    if (!success) {
        return {
            error: true,
            message: 'Invalid Rating Key'
        }
    }
    const jobListing = await getJobListing(jobListingId, orgId)
    if (!jobListing) return {
        error: true,
        message: 'this jobLIsting doesn\'t exist '
    }
    await updateJobListingApplication(jobListing.id, userId, { rating: data })
    return {
        error: false,
        message: 'Rating Updated'
    }
}
async function getJobListing(id: string, orgId: string) {
    return await db.query.JobListingTable.findFirst({
        where: and(eq(JobListingTable.id, id), eq(JobListingTable.orgId, orgId)),
        columns: { id: true }
    })
}