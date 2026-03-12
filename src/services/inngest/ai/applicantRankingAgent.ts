import { updateJobListingApplication } from '@/features/jobApplications/db/dbActions'
import { createAgent, createTool, gemini } from '@inngest/agent-kit'
import { env } from '@/data/env/server'
import z from 'zod'

const saveApplicantRatingTool = createTool({
    name: 'save-applicant-rating',
    description: 'save the applicant\'s ranking for a specific job listing in the database',
    parameters: z.object({
        rating: z.number().int().max(5).min(1),
        jobListingId: z.string().min(1),
        userId: z.string().min(1),
    }),
    handler: async ({ jobListingId, userId, rating }) => {
        await updateJobListingApplication(jobListingId, userId, { rating })
        return 'Successfully saved applicant rating'
    }
})

export const applicantRankingAgent = createAgent({
    name: 'applicantRankingAgent',
    description: 'Agent for ranking job application for specific job Listings based on their resume and cover letter ',
    system: 'You are an expert at ranking job applications for specific jobs based on their resume and cover letter .you will be provided with a user prompt that includes a user\'r id ,resume and cover letter as well as the job listing they are applying for in JSON. Your task is to compare the job listings with the applicant\'s resume and cover letter and provide a rating for the applicant on how well they fit that specific job listing.The rating should ba number between 1 and 5, where 5 is the highest rating indicating a perfect or near perfect match.A rating 3 should be used for applicants that barely meet the requirements of the job listing,while a rating of 1 should be used for applicants that do not meet the requirements at all .You should save this user rating in the database and not return any output.',
    tools: [saveApplicantRatingTool],
    model: gemini({
        model: 'gemini-2.5-flash',
        apiKey: env.GEMINI_API_KEY,
    })
})



