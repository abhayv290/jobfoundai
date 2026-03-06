import { db } from '@/drizzle/db';
import { JobListingTable } from '@/drizzle/schema';
import { getJobListingOrgTag } from '@/features/jobListings/db/cache/jobListing';
import { getCurrentOrg } from '@/services/clerk/lib/getCurrentAuth'
import { desc, eq } from 'drizzle-orm';
import { cacheTag } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function page() {
    const { orgId } = await getCurrentOrg();
    if (!orgId) {
        return null;
    }
    const jobListings = await getMostRecentJobListing(orgId);
    if (!jobListings) {
        return redirect('/employer/job-listings/new');
    } else {
        return redirect(`/employer/job-listings/${jobListings.id}`)
    }
}

async function getMostRecentJobListing(orgId: string) {
    'use cache'

    cacheTag(getJobListingOrgTag(orgId))
    return db.query.JobListingTable.findFirst({
        where: eq(JobListingTable.orgId, orgId),
        orderBy: desc(JobListingTable.createdAt),
        columns: { id: true }
    })

}