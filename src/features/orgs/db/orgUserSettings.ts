'use server';
import { db } from "@/drizzle/db";
import { OrgsUserSettings } from "@/drizzle/schema";
import { revalidateOrgUserSettingCaches } from "./cache/orgUserSettings";
import { and, eq } from "drizzle-orm";


export async function insertOrgUserSettings(data: typeof OrgsUserSettings.$inferInsert) {
    await db.insert(OrgsUserSettings).values(data).onConflictDoNothing()

    //revalidating caches 
    revalidateOrgUserSettingCaches(data.userId, data.orgsId)
}

export async function deleteOrgUserSettings(userId: string, orgId: string) {
    await db.delete(OrgsUserSettings).where(and(eq(OrgsUserSettings.userId, userId), eq(OrgsUserSettings.orgsId, orgId)))

    //revalidating caches 
    revalidateOrgUserSettingCaches(userId, orgId)

}

export async function updateOrgUserSettings(userId: string, orgId: string, data: Partial<Omit<typeof OrgsUserSettings.$inferInsert, 'userId' | 'orgsId'>>) {
    await db.insert(OrgsUserSettings).values({ userId, orgsId: orgId, ...data }).onConflictDoUpdate({
        target: [
            OrgsUserSettings.userId,
            OrgsUserSettings.orgsId
        ],
        set: data
    })

    //revalidating caches
    revalidateOrgUserSettingCaches(userId, orgId)
}