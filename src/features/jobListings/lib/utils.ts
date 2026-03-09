import { JobListingStatus } from "@/drizzle/schema";


export const getNextJobListingStatus = (status: JobListingStatus) => {
    switch (status) {
        case "draft":
            return 'published';
        case "published":
            return 'de-listed';
        case 'de-listed':
            return 'published'
        default:
            return 'draft'
    }
}


export const sortJobListingByStatus = (a: JobListingStatus, b: JobListingStatus) => statusSortOrder[b] - statusSortOrder[a]

const statusSortOrder: Record<JobListingStatus, number> = {
    'draft': 0,
    'de-listed': 1,
    'published': 2
}


