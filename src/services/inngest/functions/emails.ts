import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { and, eq, gte } from "drizzle-orm";
import { JobListingTable, UserSettingsTable } from "@/drizzle/schema";
import { GetEvents } from "inngest";
import { subDays } from "date-fns";
import { getMatchingJobListings } from "../ai/getMatchingJob";
import { resend } from "@/services/resend/client";
import DailyJobEmails from "@/services/resend/components/DailyJobEmails";
import { env } from "@/data/env/server";

export const prepareDailyJobNotification = inngest.createFunction(
    { id: 'prepare-daily-job-email-notifications', name: 'Prepare Daily Job Email Notifications' },
    { cron: 'TZ=Asia/Kolkata 0 7 * * *' },
    async ({ step, event }) => {
        const getUsers = step.run('get-users', async () => {
            return await db.query.UserSettingsTable.findMany({
                where: eq(UserSettingsTable.newJobEmailNotification, true),
                columns: {
                    userId: true,
                    newJobEmailNotification: true,
                    aiPrompt: true
                },
                with: {
                    user: {
                        columns: {
                            email: true,
                            name: true
                        }
                    }
                }
            })
        })
        const getJobListings = step.run('get-all-jobListings', async () => {
            return await db.query.JobListingTable.findMany({
                where: and(eq(JobListingTable.status, 'published'), gte(JobListingTable.postedAt, subDays(event.ts ? new Date(event.ts) : new Date(), 1))),
                columns: {
                    createdAt: false,
                    postedAt: false,
                    updatedAt: false,
                    status: false,
                    orgId: false,
                },
                with: {
                    organizations: {
                        columns: {
                            name: true
                        }
                    }
                }
            })
        })
        const [users, jobs] = await Promise.all([
            getUsers, getJobListings
        ])
        if (!users.length || !jobs.length) return;

        const events = users.map(nt => {
            return {
                name: 'app/email.daily-jobs-notifications',
                user: {
                    name: nt.user.name, email: nt.user.email
                },
                data: {
                    aiPrompt: nt.aiPrompt ?? undefined,
                    jobListings: jobs.map(j => {
                        return { ...j, organizationName: j.organizations.name }
                    })
                },
            } as const satisfies GetEvents<typeof inngest>['app/email.daily-jobs-notifications']
        })
        await step.sendEvent('send-emails', events)
    }
)

export const sendDailyEmailNotifications = inngest.createFunction(
    {
        id: 'send-daily-email-notifications',
        name: 'Send Daily Job Email Notifications',
        throttle: {
            limit: 5, period: '1m'
        }
    },
    { event: 'app/email.daily-jobs-notifications' },
    async ({ step, event }) => {
        const { jobListings, aiPrompt } = event.data
        const user = event.user

        if (!jobListings.length) return

        let matchedJobListings: typeof jobListings = []
        if (!aiPrompt || aiPrompt.trim() === '') {
            matchedJobListings = jobListings
        } else {
            const matchingIds = await getMatchingJobListings(aiPrompt, jobListings)
            matchedJobListings = jobListings.filter(ls => matchingIds.includes(ls.id))
        }
        if (!matchedJobListings.length) return

        await step.run('send-emails', async () => {
            await resend.emails.send({
                from: 'JobFoundAi <onboarding@resend.dev>',
                to: user.email,
                subject: 'Daily new Jobs',
                react: DailyJobEmails({ userName: user.name, jobListings, serverUrl: env.SERVER_URL })
            })
        })

    }
)