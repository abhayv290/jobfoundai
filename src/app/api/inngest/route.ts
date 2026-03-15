import { serve } from "inngest/next";
import { inngest } from "@/services/inngest/client";
import { clerkCreateOrganization, clerkCreateOrgMember, clerkCreateUser, clerkDeleteOrgMember, clerkDeleteOrgs, clerkDeleteUser, clerkUpdateOrganization, clerkUpdateUser } from "@/services/inngest/functions/clerk";
import { createAiSummary } from "@/services/inngest/functions/resume";
import { rankApplication } from "@/services/inngest/functions/jobApplicant";
import { prepareDailyJobNotification, prepareDailyUserApplicationNotification, sendDailyEmailNotifications, sendDailyUserApplicationNotification } from "@/services/inngest/functions/emails";


// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        clerkCreateUser,
        clerkUpdateUser,
        clerkDeleteUser,
        clerkCreateOrganization,
        clerkUpdateOrganization,
        clerkCreateOrgMember,
        clerkDeleteOrgMember,
        clerkDeleteOrgs,
        createAiSummary,
        rankApplication,
        prepareDailyJobNotification,
        sendDailyEmailNotifications,
        prepareDailyUserApplicationNotification,
        sendDailyUserApplicationNotification
        /* your functions will be passed here later! */
    ],
});