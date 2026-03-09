import { auth } from "@clerk/nextjs/server"

type OrgUserPermission = 'org:job_listing:job_listing_change_status' | 'org:job_listing:delete_job_listings' |
    'org:job_listing:create_job_listings' |
    'org:job_listing:job_listing_change_status' |
    'org:job_listing:job_listings_applicant_change_rating' |
    'org:job_listing:job_listings_appication_change_stage'

export async function hasOrgUserPermission(permission: OrgUserPermission) {
    const { has } = await auth();
    return has({ permission })
}