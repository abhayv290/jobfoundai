'use server'

import z from "zod";
import { orgUserSettingSchema } from "./schemas";
import { getCurrentOrg, getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { updateOrgUserSettings } from "../db/orgUserSettings";

export async function saveOrgUserSettingPreferences(unsafe: z.infer<typeof orgUserSettingSchema>) {
    const { userId } = await getCurrentUser()
    const { orgId } = await getCurrentOrg()
    if (!userId || !orgId) {
        return {
            error: true,
            message: 'Create an Account first'
        }
    }
    const { success, data } = orgUserSettingSchema.safeParse(unsafe)
    if (!success) {
        return {
            error: true,
            message: 'Some Error Occurred , Try again'
        }
    }
    await updateOrgUserSettings(userId, orgId, data);
    return {
        error: false,
        message: 'Preferences Updated'
    }
}