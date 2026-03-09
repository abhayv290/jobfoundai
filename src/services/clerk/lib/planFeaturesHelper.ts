import { getCurrentOrg } from "./getCurrentAuth"
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { hasPlanFeature } from "./planFeatures";
import { hasOrgUserPermission } from "./orgUserPermissions";
import { boolean } from "zod";

export const hasReachJobListingLimit = async () => {
    const { orgId } = await getCurrentOrg();
    if (!orgId) {
        return true;
    }
    const cnt = await getPublishedJobListingsCnt(orgId);
    const canPost = await Promise.all([
        hasPlanFeature('post_1_job_listing').then(has => has && cnt < 1),
        hasPlanFeature('post_3_job_listing').then(has => has && cnt < 3),
        hasPlanFeature('post_20_job_listings').then(has => has && cnt < 20)
    ])
    return !canPost.some(Boolean)
}

async function getPublishedJobListingsCnt(id: string) {
    const [res] = await db.select({ count: count() }).from(JobListingTable).where(and(eq(JobListingTable.orgId, id), eq(JobListingTable.status, 'published')))

    return res?.count ?? 0;
}


export const hasReachedFeaturedJobListingLimit = async () => {
    const { orgId } = await getCurrentOrg();
    if (!orgId) {
        return true;
    }
    const cnt = await getFeaturedJobListingCnt(orgId);

    const canFeatured = Promise.all([
        hasPlanFeature('1_featured_job_listing').then(has => has && cnt < 1),
        hasPlanFeature('unlimited_featured_job_listings')
    ])

    return !(await canFeatured).some(Boolean)
}


async function getFeaturedJobListingCnt(id: string) {
    const [res] = await db.select({ count: count() }).from(JobListingTable).where(and(
        eq(JobListingTable.orgId, id), eq(JobListingTable.isFeatured, true)
    ))
    return res?.count ?? 0;
}