
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