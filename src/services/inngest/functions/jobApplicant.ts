import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { getJobApplication, getUserResume } from "@/features/jobApplications/db/actions";
import { applicantRankingAgent } from "../ai/applicantRankingAgent";



export const rankApplication = inngest.createFunction(
    { id: 'rank-applicant', name: 'Rank Applicant' },
    { event: 'app/jobApplication.created' },
    async ({ event, step }) => {
        const { userId, jobListingId } = event.data;
        //Fetching the coverLetter from user jobApplication
        const getCoverLetter = step.run('get-cover-letter', async () => (await getJobApplication(jobListingId, userId))?.coverLetter)

        //fetching the Ai Summary from the userResume 
        const getAiSummary = step.run('get-user-resume', async () => (await getUserResume(userId))?.aiSummary);

        //Fetching job-listing to compare and rank the user application based on his resume
        const getListing = step.run('get-job-listings', async () => {
            return await db.query.JobListingTable.findFirst({
                where: and(eq(JobListingTable.id, jobListingId), eq(JobListingTable.status, 'published')),
                columns: {
                    id: true, city: true, description: true, experienceLevel: true,
                    locationRequirement: true, stateAbbreviation: true, title: true, wage: true, wageInterval: true, type: true, postedAt: true
                }
            })
        })

        const [coverLetter, aiSummary, listing] = await Promise.all([
            getCoverLetter, getAiSummary, getListing
        ])

        if (!aiSummary || !listing) return

        //Ai Agent for rank the users job application 
        await applicantRankingAgent.run(JSON.stringify({ coverLetter, aiSummary, listing, userId }))
    }
)