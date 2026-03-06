import { db } from "@/drizzle/db";
import { OrganizationTable, UserTable } from "@/drizzle/schema";
import { getOrgIdTag } from "@/features/orgs/db/cache/orgs";
import { getUserIdTag } from "@/features/users/db/cache/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

export async function getCurrentUser({ allData = false } = {}) {
    const { userId } = await auth();
    return {
        userId,
        user: (allData && userId != null) ? await getUser(userId) : undefined
    }
}

async function getUser(id: string) {
    'use cache'
    cacheTag(getUserIdTag(id));
    // console.log(" [DB] Fetching fresh user created...");
    return await db.query.UserTable.findFirst({
        where: eq(UserTable.id, id)
    })
}




export async function getCurrentOrg({ allData = false } = {}) {
    const { orgId } = await auth();
    return {
        orgId,
        organizations: (allData && orgId != null) ? await getOrg(orgId) : undefined
    }
}

async function getOrg(orgId: string) {
    'use cache'
    cacheTag(getOrgIdTag(orgId))
    return await db.query.OrganizationTable.findFirst({
        where: eq(OrganizationTable.id, orgId)
    })
}