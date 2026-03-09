type CacheTag = 'users' | 'userSettings' | 'organizations' | 'orgsUserSettings' | 'userResumes' | 'jobListings' | 'jobApplications';



export const getGlobalTag = (tag: CacheTag): string => {
    return `global:${tag}` as const
}

export const getIdTag = (tag: CacheTag, id: string): string => {
    return `id:${id}-${tag}` as const
}

export const getOrganizationTag = (tag: CacheTag, orgId: string): string => {
    return `orgId:${orgId}-${tag}` as const
}

export const getJobListingTag = (tag: CacheTag, jobListingId: string): string => {
    return `jobListingId:${jobListingId}-${tag}` as const
}