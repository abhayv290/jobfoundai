'use server'

import z from "zod";
import { jobListingSchemas } from "./schemas";
import { getCurrentOrg } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import { insertJobListing, updateJobListing as updateJobListingDB } from "../db/jobListings";
import { getJobListingIdTag } from "../db/cache/jobListing";
import { cacheTag } from "next/cache";
import { JobListingTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";


export async function createJobListing(unSafeData: z.infer<typeof jobListingSchemas>) {
    const { orgId } = await getCurrentOrg();

    if (!orgId) {
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
    if (!orgId) return {
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

