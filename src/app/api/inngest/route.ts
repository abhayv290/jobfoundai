import { serve } from "inngest/next";
import { inngest } from "@/services/inngest/client";
import { clerkCreateOrganization, clerkCreateUser, clerkDeleteOrgs, clerkDeleteUser, clerkUpdateOrganization, clerkUpdateUser } from "@/services/inngest/functions/clerk";
import { createAiSummary } from "@/services/inngest/functions/resume";
import { rankApplication } from "@/services/inngest/functions/jobApplicant";


// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        clerkCreateUser,
        clerkUpdateUser,
        clerkDeleteUser,
        clerkCreateOrganization,
        clerkUpdateOrganization,
        clerkDeleteOrgs,
        createAiSummary,
        rankApplication,
        /* your functions will be passed here later! */
    ],
});