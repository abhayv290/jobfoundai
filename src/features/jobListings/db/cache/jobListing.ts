import { getGlobalTag, getIdTag, getOrganizationTag } from "@/lib/dataCache";


export const getJobListingGlobalTag = () => {
    return getGlobalTag('jobListings');
}

export const getJobListingIdTag = (id: string) => {
    return getIdTag('jobListings', id)
}


export const getJobListingOrgTag = (orgId: string) => {
    return getOrganizationTag('jobListings', orgId);
}
export const revalidateJobListingTags = (id: string, orgId: string) => {
    getJobListingGlobalTag();
    getJobListingOrgTag(orgId)
    getJobListingIdTag(id);
}