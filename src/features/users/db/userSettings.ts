'use server'

import { notificationSchema } from "@/features/jobListings/actions/schemas";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import z from "zod";
import { updateUserNotificationSettings } from "./users";

export async function saveUserNotificationSettings(unsafe: z.infer<typeof notificationSchema>) {
    const { userId } = await getCurrentUser();
    if (!userId) {
        return {
            error: true,
            message: 'Create an Account first'
        }
    }
    const { success, data } = notificationSchema.safeParse(unsafe)
    if (!success) {
        return {
            error: true,
            message: 'Prompt could\'t able to process , try after sometime'
        }
    }
    await updateUserNotificationSettings(userId, data)
    return {
        error: false,
        message: 'notification preferences updated'
    }
}