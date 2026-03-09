import { JobListingType, WageInterval } from "@/drizzle/schema";

export const formatWageIntervals = (interval: WageInterval): string => {
    switch (interval) {
        case "hourly":
            return 'Hour'
        case "monthly":
            return 'Month'
        case "yearly":
            return 'Year'
        default:
            throw new Error(`Invalid Wage Interval ${interval satisfies never}`)
    }
}

export const formatJobType = (type: JobListingType): string => {
    switch (type) {
        case "internship":
            return 'Internship'
        case "part-time":
            return 'Part Time'
        case "full-time":
            return 'Full Time'
        default:
            throw new Error(`Invalid Job Type`)
    }
}




export const formatWage = (wage: number, wageInterval: WageInterval): string => {
    const formattedWage = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(wage)
    switch (wageInterval) {
        case "hourly":
            return `${formattedWage}/hr`
        case "monthly":
            return `${formattedWage}/month`
        case "yearly":
            return `${formattedWage}/year`
        default:
            throw new Error('Unknown wage interval')
    }
}


export const formatJobListingLocation = (city: string | null, state: string | null): string => {
    if (!state && !city) {
        return 'None'
    }
    const locationParts = [];
    if (city) {
        locationParts.push(city);
    }
    if (state) {
        locationParts.push(state);
    }
    return locationParts.join(', ');
}

