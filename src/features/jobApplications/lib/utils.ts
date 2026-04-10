import { ApplicationStages } from "@/drizzle/schema";


const sort_order: Record<ApplicationStages, number> = {
    applied: 0,
    interested: 1,
    interviewed: 2,
    hired: 3,
    denied: 4
}
export const sortApplicationByStage = (a: ApplicationStages, b: ApplicationStages): number => {
    return sort_order[a] - sort_order[b]
}