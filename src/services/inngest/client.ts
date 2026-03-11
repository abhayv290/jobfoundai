import { DeletedObjectJSON, OrganizationJSON, UserJSON } from "@clerk/nextjs/server";
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
    'app/jobApplication.created': {
        data: {
            jobListingId: string
            userId: string
        }
    },
    'app/resume.uploaded': {
        user: { id: string }
    }
}

// Create a client to send and receive events
export const inngest = new Inngest({ id: "job-found-ai", schemas: new EventSchemas().fromRecord<Events>() });