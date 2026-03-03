type CacheTag = 'users' | 'userSettings' | 'organizations' | 'orgsUserSettings' | 'userResumes' | 'jobListings' | 'jobApplications';



export const getGlobalTag = (tag: CacheTag) => {
    return `global:${tag}` as const
}

export const getIdTag = (tag: CacheTag, id: string) => {
    return `id:${id}-${tag}` as const
}