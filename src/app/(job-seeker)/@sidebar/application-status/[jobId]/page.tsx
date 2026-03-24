import { ApplicationStatus, getUserJobApplications } from "@/app/(job-seeker)/application-status/[jobId]/page"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import UserApplicationMenuGroup from "../UserApplicationSidebar"
import { sortApplicationByStage } from "@/features/jobApplications/lib/utils"



export default async function ApplicationStatusSidebar() {
    const { userId } = await getCurrentUser()
    if (!userId) {
        return null
    }
    const applications = await getUserJobApplications(userId)
    if (!applications.length) return null
    return (
        Object.entries(Object.groupBy(applications, ap => ap.status)).sort(([a], [b]) => sortApplicationByStage(a, b)).map(([status, applications]) => (
            <UserApplicationMenuGroup status={status as ApplicationStatus} key={status} applications={applications} />
        ))
    )
}



