import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { UserSettingsTable } from "@/drizzle/schema";
import UserNotificationForm from "@/features/users/components/UserSettingsForm";
import { getUserSettingsIdTag } from "@/features/users/db/cache/userSettings";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function UserNotificationPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <NotificationComponent />
        </Suspense>
    )
}

async function NotificationComponent() {
    const { userId } = await getCurrentUser()
    if (!userId) {
        return notFound()
    }
    const notificationSettings = await getNotificationSettings(userId)
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className='text-2xl font-bold mb-6 '>Notification Settings</h1>
            <Card>
                <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>

                        {notificationSettings &&
                            <UserNotificationForm notifications={notificationSettings} />
                        }
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )

}

async function getNotificationSettings(userId: string) {
    'use cache'
    cacheTag(getUserSettingsIdTag(userId))
    return await db.query.UserSettingsTable.findFirst({
        where: eq(UserSettingsTable.userId, userId),
        columns: {
            aiPrompt: true,
            newJobEmailNotification: true
        }
    })
}