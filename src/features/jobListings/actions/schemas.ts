
import { experiences, jobListingType, locationRequirements, wageIntervals } from "@/drizzle/schema";
import z from "zod";

export const jobListingSchemas = z.object({
    title: z.string().min(1, 'Required'),
    description: z.string().min(1, 'Required'),
    wage: z.number().int().positive().nullable(),
    type: z.enum(jobListingType),
    wageInterval: z.enum(wageIntervals).nullable(),
    experienceLevel: z.enum(experiences),
    locationRequirement: z.enum(locationRequirements),
    stateAbbreviation: z.string().transform(val => (val.trim() === '' ? null : val)).nullable(),
    city: z.string().transform(val => (val.trim() === '' ? null : val)).nullable()
}).refine(listing => listing.locationRequirement === 'remote' || listing.city != null, {
    message: 'Required for non-remote listings ',
    path: ['city']
}).refine(listing => listing.locationRequirement === 'remote' || listing.stateAbbreviation != null, {
    message: 'required for non-remote listings',
    path: ['stateAbbreviation']
})



export const searchParamsSchema = z.object({
    title: z.string().optional().catch(undefined),
    city: z.string().optional().catch(undefined),
    state: z.string().optional().catch(undefined),
    experience: z.enum(experiences).optional().catch(undefined),
    locationRequirements: z.enum(locationRequirements).optional().catch(undefined),
    type: z.enum(jobListingType).optional().catch(undefined),
    jobIds: z.union([z.string(), z.array(z.string())]).transform((val) => {
        if (!val) return []
        return Array.isArray(val) ? val : [val]
    }).optional()
})

export const ANY_VALUE = 'any'

export const jobListingFilterSchemas = z.object({
    title: z.string().optional(),
    city: z.string().optional(),
    state: z.string().or(z.literal(ANY_VALUE)).optional(),
    experience: z.enum(experiences).or(z.literal(ANY_VALUE)).optional(),
    type: z.enum(jobListingType).or(z.literal(ANY_VALUE)).optional(),
    locationRequirements: z.enum(locationRequirements).or(z.literal(ANY_VALUE)).optional(),
})

export const jobApplicationSchema = z.object({
    coverLetter: z.string().transform(t => t?.trim() === '' ? null : t).nullable()
})


export const jobListingAiSearchSchema = z.object({
    query: z.string().min(1, 'Required')
})

export const notificationSchema = z.object({
    aiPrompt: z.string().transform(val => val.trim() === '' ? null : val).nullable(),
    newJobEmailNotification: z.boolean().default(false)
})
