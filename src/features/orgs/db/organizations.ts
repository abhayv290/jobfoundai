'use server'
import { db } from "@/drizzle/db";
import { OrganizationTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateOrgCache } from "./cache/orgs";

export async function insertOrganization(org: typeof OrganizationTable.$inferInsert) {
    await db.insert(OrganizationTable).values(org).onConflictDoNothing();
    revalidateOrgCache(org.id);
}


export async function updateOrganization(id: string, org: Partial<typeof OrganizationTable.$inferInsert>) {
    await db.update(OrganizationTable).set(org).where(eq(OrganizationTable.id, id));
    revalidateOrgCache(id);
}

export async function deleteOrganization(id: string) {
    await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id));
    revalidateOrgCache(id);
}