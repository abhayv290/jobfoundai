import { auth } from "@clerk/nextjs/server"

type FeatureType = 'job_listing' |
    'create_job_listings' |
    'manage_applicant_workflow' |
    'post_3_job_listing' |
    'post_20_job_listings' |
    '1_featured_job_listing' |
    'unlimited_featured_job_listings' |
    'post_1_job_listing'

export async function hasPlanFeature(feature: FeatureType) {
    const { has } = await auth();
    return has({ feature });
}