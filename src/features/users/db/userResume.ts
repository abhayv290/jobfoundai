'use server'
import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";
import { revalidateUserResumeCache } from "./cache/userResume";
import { eq } from "drizzle-orm";

export async function upsertUserResume(userId: string, data: Omit<typeof UserResumeTable.$inferInsert, 'userId'>) {
    try {
        await db.insert(UserResumeTable).values({ userId, ...data }).onConflictDoUpdate({
            target: UserResumeTable.userId,
            set: data
        })
    } catch (err) {
        throw err
    }

    //revalidating Caches 
    revalidateUserResumeCache(userId)
}

export async function getUserResumeFileKey(userId: string) {
    const data = await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
            resumeFileKey: true
        }
    })
    return data?.resumeFileKey
}

export async function updateUserResume(userId: string, data: Partial<Omit<typeof UserResumeTable.$inferInsert, 'userId'>>) {
    await db.update(UserResumeTable).set(data).where(eq(UserResumeTable.userId, userId))

    //revalidating the caches 
    revalidateUserResumeCache(userId)
}