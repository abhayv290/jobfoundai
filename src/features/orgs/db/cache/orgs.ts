import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";


export const getOrgGlobalTag = (): string => {
    return getGlobalTag('organizations');
}

export const getOrgIdTag = (id: string): string => {
    return getIdTag('organizations', id)
}

export const revalidateOrgCache = (id: string) => {
    revalidateTag(getOrgGlobalTag(), 'max')
    revalidateTag(getOrgIdTag(id), 'max')
}