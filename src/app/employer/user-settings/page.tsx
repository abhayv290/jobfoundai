import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { OrgsUserSettings } from "@/drizzle/schema";
import OrgUserSettingsForm from "@/features/orgs/components/OrgUserSettingsForm";
import { getOrgUserSettingIdTag } from "@/features/orgs/db/cache/orgUserSettings";
import { getCurrentOrg, getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function OrgUserSettingsPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <UserSettingComponent />
        </Suspense>
    )
}

async function UserSettingComponent() {
    const { userId } = await getCurrentUser()
    const { orgId } = await getCurrentOrg()
    if (!userId || !orgId) {
        return notFound()
    }
    const settings = await getOrgUserSettings(userId, orgId)
    console.log('settings', settings)
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className='text-2xl font-bold mb-6 '>Notification Settings</h1>
            <Card>
                <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>
                        {settings && <OrgUserSettingsForm settings={settings} />}
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )

}

async function getOrgUserSettings(userId: string, orgId: string) {
    'use cache'
    cacheTag(getOrgUserSettingIdTag(userId, orgId))

    return db.query.OrgsUserSettings.findFirst({
        where: and(eq(OrgsUserSettings.userId, userId), eq(OrgsUserSettings.orgsId, orgId)),
        columns: {
            newApplicationEmailNotifications: true,
            minimumRating: true
        }
    })
}