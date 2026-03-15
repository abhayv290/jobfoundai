import { JobApplicationTable, JobListingTable } from "@/drizzle/schema";
import { DeletedObjectJSON, OrganizationJSON, OrganizationMembershipJSON, UserJSON } from "@clerk/nextjs/server";
import { EventSchemas, Inngest } from "inngest";


type ClerkWebHookData<T> = {
    data: {
        data: T,
        raw: string,
        headers: Record<string, string>
    }
}
type Events = {
    'clerk/user.created': ClerkWebHookData<UserJSON>;
    'clerk/user.updated': ClerkWebHookData<UserJSON>;
    'clerk/user.deleted': ClerkWebHookData<DeletedObjectJSON>;
    'clerk/organization.created': ClerkWebHookData<OrganizationJSON>;
    'clerk/organization.updated': ClerkWebHookData<OrganizationJSON>;
    'clerk/organization.deleted': ClerkWebHookData<DeletedObjectJSON>;
    'clerk/organizationMembership.created': ClerkWebHookData<OrganizationMembershipJSON>;
    'clerk/organizationMembership.deleted': ClerkWebHookData<OrganizationMembershipJSON>
    'app/jobApplication.created': {
        data: {
            jobListingId: string
            userId: string
        }
    },
    'app/resume.uploaded': {
        user: { id: string }
    },
    'app/email.daily-jobs-notifications': {
        data: {
            aiPrompt?: string
            jobListings: (Omit<typeof JobListingTable.$inferSelect, 'createdAt' | 'updatedAt'
                | 'postedAt' | 'status' | 'orgId'> & { organizationName: string })[]
        },
        user: {
            email: string, name: string
        }
    },
    'app/email.daily-application-org-notifications': {
        user: {
            name: string, email: string
        },
        data: {
            applications: (Pick<typeof JobApplicationTable.$inferSelect, 'rating'> & {
                userName: string, orgId: string, orgName: string, jobListingId: string,
                jobListingTitle: string
            })[]
        }
    }
}

// Create a client to send and receive events
export const inngest = new Inngest({ id: "job-found-ai", schemas: new EventSchemas().fromRecord<Events>() });