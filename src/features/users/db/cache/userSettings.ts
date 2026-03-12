import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";


export const getUserSettingsGlobalTag = () => {
    return getGlobalTag('userSettings');
}

export const getUserSettingsIdTag = (userId: string) => {
    return getIdTag('userSettings', userId)
}

export const revalidateUserSettingsTags = (userId: string) => {
    revalidateTag(getUserSettingsGlobalTag(), 'max');
    revalidateTag(getUserSettingsIdTag(userId), 'max');
}