import z from "zod";

export const orgUserSettingSchema = z.object({
    newApplicationEmailNotifications: z.boolean().default(false),
    minimumRating: z.number().int().min(1).max(5).nullable(),
})