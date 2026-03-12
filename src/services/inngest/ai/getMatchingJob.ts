import { env } from "@/data/env/server";
import { experiences, jobListingType, locationRequirements, wageIntervals } from "@/drizzle/schema";
import { AgentResult, createAgent, gemini } from "@inngest/agent-kit";
import z from "zod";

const listingSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    wage: z.number().nullable(),
    wageInterval: z.enum(wageIntervals).nullable(),
    city: z.string().nullable(),
    stateAbbreviation: z.string().nullable(),
    experienceLevel: z.enum(experiences),
    type: z.enum(jobListingType),
    locationRequirement: z.enum(locationRequirements),
})
const NO_JOBS = 'NO_JOBS'
export async function getMatchingJobListings(prompt: string, jobListings: z.infer<typeof listingSchema>[],
    { maxJobCount }: { maxJobCount?: number } = {}
) {
    const agent = createAgent({
        name: 'Job Matching Agent',
        description: 'Agent for matching user query for job Listings',
        system: `You are an expert at matching users with jobs based on their specific experience ,and requirements,The provided user prompt will be a description that can include information about themselves as well what they are looking for in a job ,${maxJobCount ? `you are to return up to ${maxJobCount} jobs if available` : 'Return all jobs that match the requirements '}.
        Return the job at comma separated list of jobIds. If you cannot find any jobs that match the user prompt ,return the next "${NO_JOBS}". Here is the json array of available jobListings : ${JSON.stringify(
            jobListings.map(listings => (
                listingSchema.transform(listing => ({
                    ...listing,
                    wage: listing.wage ?? undefined,
                    wageInterval: listing.wageInterval ?? undefined,
                    city: listing.city ?? undefined,
                    stateAbbreviation: listing.stateAbbreviation ?? undefined,
                    locationRequirement: listing.locationRequirement ?? undefined
                })).parse(listings)
            ))
        )}`,
        model: gemini({
            model: 'gemini-2.5-flash',
            apiKey: env.GEMINI_API_KEY
        })
    })
    const res = await agent.run(prompt)
    const lastMessage = getLastOutputMessage(res)
    if (!lastMessage || lastMessage === NO_JOBS) {
        return []
    }
    return lastMessage.split(',').map(i => i.trim()).filter(Boolean)
}

function getLastOutputMessage(result: AgentResult) {
    const lastMessage = result.output.at(-1)
    if (lastMessage == null || lastMessage.type !== 'text') return;

    return (typeof lastMessage.content === 'string') ? lastMessage.content.trim() : lastMessage.content.join('\n').trim()
}