import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { revalidateJobListingCache } from "./cache/jobListing";
import { eq } from "drizzle-orm";

/** Insert JobListing Data to DB  */
export const insertJobListing = async (job: typeof JobListingTable.$inferInsert) => {
    const [listing] = await db.insert(JobListingTable).values(job).returning({
        id: JobListingTable.id,
        orgId: JobListingTable.orgId
    });
    //revalidate the cache tag
    revalidateJobListingCache(listing.id, listing.orgId)
    return listing;
}
/** Update Job Listing Data from db */
export const updateJobListing = async (id: string, job: Partial<typeof JobListingTable.$inferInsert>) => {
    const [listing] = await db.update(JobListingTable).set(job).where(eq(JobListingTable.id, id)).returning({
        id: JobListingTable.id,
        orgId: JobListingTable.orgId
    });
    //revalidate the cache tag
    revalidateJobListingCache(id, listing.orgId);
    return listing;
}

export const deleteJobListing = async (id: string) => {
    const [listing] = await db.delete(JobListingTable).where(eq(JobListingTable.id, id)).returning({
        id: JobListingTable.id,
        orgId: JobListingTable.orgId
    });
    //revalidate the cache tag
    revalidateJobListingCache(id, listing.orgId);
    return listing;
}