'use server'
import { db } from "@/drizzle/db";
import { UserSettingsTable, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateUserCache } from "./cache/users";
import { revalidateUserSettingsTags } from "./cache/userSettings";


export async function insertUser(user: typeof UserTable.$inferInsert) {
    await db.insert(UserTable).values(user).onConflictDoNothing();
    revalidateUserCache(user.id);
}


export async function updateUser(id: string, user: Partial<typeof UserTable.$inferInsert>) {
    await db.update(UserTable).set(user).where(eq(UserTable.id, id));
    revalidateUserCache(id);
}



export async function deleteUser(id: string) {
    await db.delete(UserTable).where(eq(UserTable.id, id));
    revalidateUserCache(id);
}



export async function insertUserSettings(userSettings: typeof UserSettingsTable.$inferInsert) {
    await db.insert(UserSettingsTable).values(userSettings).onConflictDoNothing();
    revalidateUserSettingsTags(userSettings.userId);
}

export async function updateUserNotificationSettings(userId: string, data: Partial<Omit<typeof UserSettingsTable.$inferInsert, 'userId'>>) {
    await db.insert(UserSettingsTable).values({ userId, ...data }).onConflictDoUpdate({
        set: data,
        target: UserSettingsTable.userId
    })
    revalidateUserSettingsTags(userId)
}