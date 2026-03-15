
import { Webhook } from "svix";
import { inngest } from "../client";
import { env } from "@/data/env/server";
import { NonRetriableError } from "inngest";
import { deleteUser, insertUser, insertUserSettings, updateUser } from "@/features/users/db/users";
import { deleteOrganization, insertOrganization, updateOrganization } from "@/features/orgs/db/organizations";
import { deleteOrgUserSettings, insertOrgUserSettings } from "@/features/orgs/db/orgUserSettings";


function verifyWebHooks({ raw, headers }: { raw: string, headers: Record<string, string> }) {
    return new Webhook(env.CLERK_WEBHOOK_SECRET).verify(raw, headers)
}


/** User Webhook Functions  */
export const clerkCreateUser = inngest.createFunction(
    { id: 'clerk/db-user-create', name: 'Clerk DB User Create' },
    { event: 'clerk/user.created' },
    async ({ event, step }) => {
        await step.run('verify-webhook', async () => {
            try {
                verifyWebHooks(event.data)
            } catch {
                throw new NonRetriableError('Invalid Webhook',);
            }
        })

        const userId = await step.run('create-user', async () => {
            const userData = event.data.data;
            const email = userData.email_addresses.find(email => email.id === userData.primary_email_address_id);

            if (!email) {
                throw new NonRetriableError('No Email address found');
            }

            await insertUser({
                id: userData.id,
                name: `${userData.first_name} ${userData.last_name}`,
                avatar: userData.image_url,
                email: email.email_address,
                createdAt: new Date(userData.created_at),
                updatedAt: new Date(userData.updated_at)

            })
            return userData.id
        })

        await step.run('create-user-settings', async () => {
            await insertUserSettings({ userId })
        })

    }
)

export const clerkUpdateUser = inngest.createFunction(
    { id: 'clerk/update-db-user', name: 'Clerk Update db User' },
    { event: 'clerk/user.updated' },
    async ({ event, step }) => {
        await step.run('verify-webhook', async () => {
            try {
                verifyWebHooks(event.data)
            } catch {
                throw new NonRetriableError('Invalid Webhook',);
            }
        })

        await step.run('update-user', async () => {
            const userData = event.data.data;
            const email = userData.email_addresses.find(email => email.id === userData.primary_email_address_id)

            if (!email) {
                throw new NonRetriableError('email id not found');
            }

            await updateUser(userData.id, {
                name: `${userData.first_name} ${userData.last_name}`,
                avatar: userData.image_url,
                email: email.email_address,
                updatedAt: new Date(userData.updated_at)
            })

        })
    }
)

export const clerkDeleteUser = inngest.createFunction(
    { id: 'clerk/delete-user', name: 'Clerk Delete DB User' },
    { event: 'clerk/user.deleted' },
    async ({ event, step }) => {
        await step.run('verify-webhook', async () => {
            try {
                verifyWebHooks(event.data)
            } catch {
                throw new NonRetriableError('Invalid Webhook',);
            }
        })
        await step.run('delete-user', async () => {
            const { id } = event.data.data;
            if (!id) {
                throw new NonRetriableError('user does not exist');
            }
            await deleteUser(id);
        })
    }
)

/** Organizations Webhook Functions  */
export const clerkCreateOrganization = inngest.createFunction(
    { id: 'clerk/db-org-create', name: 'Clerk DB Org Create' },
    { event: 'clerk/organization.created' },
    async ({ event, step }) => {
        await step.run('verify-webhook', async () => {
            try {
                verifyWebHooks(event.data)
            } catch {
                throw new NonRetriableError('Invalid Webhook',);
            }
        })

        await step.run('create-organization', async () => {
            const orgData = event.data.data;
            await insertOrganization({
                id: orgData.id,
                name: orgData.name,
                avatar: orgData.image_url ?? '',
                createdAt: new Date(orgData.created_at),
                updatedAt: new Date(orgData.updated_at)
            })
        })
    }
)

export const clerkUpdateOrganization = inngest.createFunction(
    { id: 'clerk/update-db-org', name: 'Clerk Update db Org' },
    { event: 'clerk/organization.updated' },
    async ({ event, step }) => {
        await step.run('verify-webhook', async () => {
            try {
                verifyWebHooks(event.data)
            } catch {
                throw new NonRetriableError('Invalid Webhook',);
            }
        })
        await step.run('update-organization', async () => {
            const orgData = event.data.data;
            await updateOrganization(orgData.id, {
                name: orgData.name,
                avatar: orgData.image_url,
                updatedAt: new Date(orgData.updated_at)
            })
        })
    }
)

export const clerkDeleteOrgs = inngest.createFunction(
    { id: 'clerk/delete-org', name: 'Clerk Delete DB Org' },
    { event: 'clerk/organization.deleted' },
    async ({ event, step }) => {
        await step.run('verify-webhook', async () => {
            try {
                verifyWebHooks(event.data)
            } catch {
                throw new NonRetriableError('Invalid Webhook',);
            }
        })
        await step.run('delete-organization', async () => {
            const { id } = event.data.data;
            if (!id) {
                throw new NonRetriableError('Organization does not exist');
            }
            await deleteOrganization(id);
        })
    }
)

export const clerkCreateOrgMember = inngest.createFunction(
    { name: 'Clerk Create Organization Member', id: 'clerk-create-org-member' },
    { event: 'clerk/organizationMembership.created' },
    async ({ step, event }) => {

        await step.run('create-organization-user-settings', async () => {
            const userId = event.data.data.public_user_data.user_id
            const orgId = event.data.data.organization.id

            await insertOrgUserSettings({
                userId, orgsId: orgId
            })
        })

    }
)

export const clerkDeleteOrgMember = inngest.createFunction(
    { id: 'clerk-delete-org-member', name: 'Clerk Delete Organization Member' },
    { event: 'clerk/organizationMembership.deleted' },
    async ({ step, event }) => {

        await step.run('delete-organization-user-settings', async () => {
            const userId = event.data.data.public_user_data.user_id
            const orgId = event.data.data.organization.id

            await deleteOrgUserSettings(userId, orgId)
        })
    }
)