'use server'

import z from "zod";
import { jobListingSchemas } from "./schemas";
import { getCurrentOrg } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import { insertJobListing, updateJobListing as updateJobListingDB, deleteJobListing as deleteJobListingDB } from "../db/jobListings";
import { getJobListingIdTag, getJobListingOrgTag } from "../db/cache/jobListing";
import { cacheTag } from "next/cache";
import { JobApplicationTable, JobListingTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { and, count, desc, eq } from "drizzle-orm";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { getNextJobListingStatus } from "../lib/utils";
import { hasReachedFeaturedJobListingLimit, hasReachJobListingLimit } from "@/services/clerk/lib/planFeaturesHelper";
import { getJobApplicationListingCacheTag } from "@/features/jobApplications/db/cache/applications";


export async function createJobListing(unSafeData: z.infer<typeof jobListingSchemas>) {
    const { orgId } = await getCurrentOrg();

    if (!orgId || !(await hasOrgUserPermission('org:job_listing:create_job_listings'))) {
        return {
            error: true,
            message: 'You don\'t have permission do this operation'
        }
    }
    const { success, data } = jobListingSchemas.safeParse(unSafeData);

    if (!success) {
        return {
            error: true,
            message: 'There is an error creating the job listing'
        }
    }
    const jobListing = await insertJobListing({
        ...data, orgId, status: 'draft'
    });

    redirect(`/employer/job-listings/${jobListing.id}`)
}

export async function updateJobListing(id: string, unSafeData: z.infer<typeof jobListingSchemas>) {
    const { orgId } = await getCurrentOrg();
    if (!orgId || !(await hasOrgUserPermission('org:job_listing:create_job_listings'))) return {
        error: true,
        message: 'You don\' have permission to perform this operation'
    }
    const { success, data } = jobListingSchemas.safeParse(unSafeData);
    if (!success) {
        return {
            error: true,
            message: 'Error updating the form listing'
        }
    }
    const updatedJobListing = await updateJobListingDB(id, data);
    redirect(`/employer/job-listings/${updatedJobListing.id}`)
}
export async function getJobListing(id: string, orgId: string) {
    'use cache'
    cacheTag(getJobListingIdTag(id));
    return await db.query.JobListingTable.findFirst({
        where: and(eq(JobListingTable.id, id), eq(JobListingTable.orgId, orgId))
    })
}





export async function toggleJobListingStatus(id: string) {
    const { orgId } = await getCurrentOrg();
    if (!orgId) {
        return {
            error: true,
            message: 'You don\'t have the permission for updating status'
        }
    }
    const jobListing = await getJobListing(id, orgId);
    if (!jobListing) return {
        error: true,
        message: 'This id doesn\'t belong to any job listing'
    }
    const newStatus = getNextJobListingStatus(jobListing.status);

    //verify permissions 
    if (!(await hasOrgUserPermission('org:job_listing:job_listing_change_status')) || (await hasReachJobListingLimit() && newStatus === 'published')) {
        return {
            error: true,
            message: 'You have reached your limit , upgrade your plan'
        }
    }
    await updateJobListingDB(id, {
        status: newStatus,
        isFeatured: newStatus === 'published' ? undefined : false,
        postedAt: newStatus === 'published' && jobListing.postedAt == null ? new Date() : undefined
    })
    return {
        error: false,
        message: 'Status Updated'
    }
}


export async function toggleJobListingFeature(id: string) {
    const { orgId } = await getCurrentOrg();
    if (!orgId || !(await hasOrgUserPermission('org:job_listing:job_listing_change_status'))) {
        return {
            error: true,
            message: 'You don\'t have permission to feature'
        }
    }
    const jobListing = await getJobListing(id, orgId);
    if (!jobListing) {
        return {
            error: true,
            message: 'This Job listing doesn\'t exists'
        }
    }
    //check feature limit 
    if (jobListing.isFeatured && !(await hasReachedFeaturedJobListingLimit())) {
        return {
            error: true,
            message: 'You hit the limit , Upgrade your plan to feature more Job Listing'
        }
    }
    //Update the db 
    await updateJobListingDB(id, {
        isFeatured: !jobListing.isFeatured,
    })
    return {
        error: false,
        message: 'This Job Listing Featured'
    }
}


export async function deleteJobListing(id: string) {
    const { orgId } = await getCurrentOrg();
    if (!orgId || !(await hasOrgUserPermission('org:job_listing:delete_job_listings'))) {
        return {
            error: true,
            message: 'You don\'t have permission to delete'
        }
    }

    const jobListing = await getJobListing(id, orgId);

    if (!jobListing) {
        return {
            error: true,
            message: 'This post does\'t exists'
        }
    }

    await deleteJobListingDB(id);
    return redirect('/employer')
}


export async function getJobListingArray(orgId: string) {
    'use cache'
    cacheTag(getJobListingOrgTag(orgId));

    const data = await db.select({
        id: JobListingTable.id,
        title: JobListingTable.title,
        status: JobListingTable.status,
        applicationCount: count(JobApplicationTable.userId)
    }).from(JobListingTable).where(eq(JobListingTable.orgId, orgId))
        .leftJoin(JobApplicationTable, eq(JobListingTable.id, JobApplicationTable.jobListingId))
        .groupBy(JobApplicationTable.jobListingId, JobListingTable.id)
        .orderBy(desc(JobListingTable.createdAt))

    //Cache the jobListings and jobApplications Based on jobListing id  
    data.forEach(list => cacheTag(getJobApplicationListingCacheTag(list.id)))

    return data;
}
