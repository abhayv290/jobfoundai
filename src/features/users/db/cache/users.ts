import { getGlobalTag, getIdTag } from "@/lib/dataCache";


export const getUserGlobalTag = () => {
    return getGlobalTag('users');
}

export const getUserIdTag = (id: string) => {
    return getIdTag('users', id)
}

export const revalidateUserTags = (id: string) => {
    getUserGlobalTag();
    getUserIdTag(id);
}