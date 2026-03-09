import { getGlobalTag, getIdTag, getJobListingTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";


export const getJobApplicationGlobalTag = () => getGlobalTag('jobApplications');
export const getJobApplicationListingCacheTag = (id: string) => getJobListingTag('jobApplications', id)


export const getJobApplicationIdCacheTag = (userId: string, jobListingId: string) => getIdTag('jobApplications', `${userId}-${jobListingId}`)


export const revalidateJobApplicationCacheTags = (userId: string, jobListingId: string) => {
    revalidateTag(getJobApplicationGlobalTag(), 'max')
    revalidateTag(getJobApplicationIdCacheTag(userId, jobListingId), 'max')
    revalidateTag(getJobApplicationListingCacheTag(jobListingId), 'max')
}