import { getGlobalTag, getIdTag } from "@/lib/dataCache";


export const getUserSettingsGlobalTag = () => {
    return getGlobalTag('userSettings');
}

export const getUserSettingsIdTag = (userId: string) => {
    return getIdTag('userSettings', userId)
}

export const revalidateUserSettingsTags = (userId: string) => {
    getUserSettingsGlobalTag();
    getUserSettingsIdTag(userId);
}