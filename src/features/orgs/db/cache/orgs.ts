import { getGlobalTag, getIdTag } from "@/lib/dataCache";


export const getOrgGlobalTag = () => {
    return getGlobalTag('organizations');
}

export const getOrgIdTag = (id: string) => {
    return getIdTag('organizations', id)
}

export const revalidateOrgTags = (id: string) => {
    getOrgGlobalTag();
    getOrgIdTag(id);
}