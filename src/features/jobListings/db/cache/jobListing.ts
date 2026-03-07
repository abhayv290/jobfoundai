import { getGlobalTag, getIdTag, getOrganizationTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";


export const getJobListingGlobalTag = (): string => {
    return getGlobalTag('jobListings');
}

export const getJobListingIdTag = (id: string): string => {
    return getIdTag('jobListings', id)
}


export const getJobListingOrgTag = (orgId: string): string => {
    return getOrganizationTag('jobListings', orgId);
}
export const revalidateJobListingCache = (id: string, orgId: string) => {
    revalidateTag(getJobListingGlobalTag(), 'max')
    revalidateTag(getJobListingIdTag(id), 'max')
    revalidateTag(getJobListingOrgTag(orgId), 'max')
}