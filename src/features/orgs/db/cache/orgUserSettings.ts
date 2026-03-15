import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getOrgUserSettingGlobalTag = () => getGlobalTag('orgsUserSettings')

export const getOrgUserSettingIdTag = (userId: string, orgId: string) => getIdTag('orgsUserSettings', `${userId}-${orgId}`)



export function revalidateOrgUserSettingCaches(userId: string, orgId: string) {
    revalidateTag(getOrgUserSettingGlobalTag(), 'max')
    revalidateTag(getOrgUserSettingIdTag(userId, orgId), 'max')
}