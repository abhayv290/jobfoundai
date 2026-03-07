import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";


export const getUserGlobalTag = (): string => {
    return getGlobalTag('users');
}

export const getUserIdTag = (id: string): string => {
    return getIdTag('users', id)
}

export const revalidateUserCache = (id: string) => {
    revalidateTag(getUserGlobalTag(), 'max');
    revalidateTag(getUserIdTag(id), 'max');
}