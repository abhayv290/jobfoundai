import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { and, eq, gte } from "drizzle-orm";
import { JobListingTable, OrgsUserSettings, UserSettingsTable } from "@/drizzle/schema";
import { GetEvents } from "inngest";
import { subDays } from "date-fns";
import { getMatchingJobListings } from "../ai/getMatchingJob";
import { resend } from "@/services/resend/client";
import DailyJobEmails from "@/services/resend/components/DailyJobEmails";
import { env } from "@/data/env/server";
import DailyApplicationEmails from "@/services/resend/components/DailyApplicationEmail";

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
            const matchingIds = await getMatchingJobListings(aiPrompt, jobListings, { maxJobCount: 5 })
            matchedJobListings = jobListings.filter(ls => matchingIds.includes(ls.id))
        }
        if (!matchedJobListings.length) return

        await step.run('send-emails', async () => {
            await resend.emails.send({
                from: 'JobFoundAi <onboarding@resend.abhayvii.dev>',
                to: user.email,
                subject: 'Daily new Jobs',
                react: DailyJobEmails({ userName: user.name, jobListings, serverUrl: env.SERVER_URL })
            })
        })
    }
)


export const prepareDailyUserApplicationNotification = inngest.createFunction(
    { id: 'prepare-daily-application-org-notification', name: 'Prepare Daily User Application Organization Notification' },
    { cron: 'TZ=Asia/Kolkata 0 7 * * *' },
    async ({ step, event }) => {
        const getUsers = step.run('get-users', async () => {
            return await db.query.OrgsUserSettings.findMany({
                where: eq(OrgsUserSettings.newApplicationEmailNotifications, true),
                columns: {
                    userId: true, orgsId: true,
                    newApplicationEmailNotifications: true,
                    minimumRating: true,
                },
                with: {
                    user: {
                        columns: {
                            name: true,
                            email: true,
                        }
                    }
                }
            })
        })

        const getApplications = step.run('get-all-user-applications', async () => {
            return await db.query.JobApplicationTable.findMany({
                where: gte(OrgsUserSettings.createdAt, subDays(event.ts ? new Date(event.ts) : new Date(), 1)),
                columns: { rating: true },
                with: {
                    user: { columns: { name: true } },
                    jobListing: {
                        columns: { id: true, title: true },
                        with: { organizations: { columns: { id: true, name: true } } }
                    }
                }
            })
        })
        const [users, applications] = await Promise.all([
            getUsers, getApplications
        ])
        if (!users.length || !applications.length) {
            return
        }

        const groupedUsers = Object.groupBy(
            users, n => n.userId
        )

        const events = Object.entries(groupedUsers).map(([, settings]) => {
            if (!settings || !settings.length) {
                return null
            }
            const userName = settings[0].user.name
            const userEmail = settings[0].user.email

            const filteredApplications = applications.filter(a => settings.find(s => s.orgsId === a.jobListing.organizations.id && (s.minimumRating == null || (a.rating ?? 0) >= s.minimumRating))).map(a => ({
                orgId: a.jobListing.organizations.id,
                orgName: a.jobListing.organizations.name,
                jobListingId: a.jobListing.id,
                jobListingTitle: a.jobListing.title,
                userName: a.user.name,
                rating: a.rating
            }))

            if (!filteredApplications.length) return null

            return {
                name: 'app/email.daily-application-org-notifications',
                user: { name: userName, email: userEmail },
                data: { applications: filteredApplications }
            } as const satisfies GetEvents<typeof inngest>['app/email.daily-application-org-notifications']
        }).filter(a => a != null)


        await step.sendEvent('send-emails', events);
    }
)

export const sendDailyUserApplicationNotification = inngest.createFunction(
    { id: "send-daily-application-org-notification", name: 'Send Daily User Application Organization Notification', throttle: { limit: 100, period: '1m' } },
    { event: "app/email.daily-application-org-notifications" },
    async ({ step, event }) => {
        const { applications } = event.data
        const user = event.user

        if (!applications.length) return

        await step.run('send-org-email', async () => {
            await resend.emails.send({
                from: 'JobFoundAi <onboarding@resend.abhayvii.dev>',
                to: user.email,
                subject: 'Daily New Job  Applications',
                react: DailyApplicationEmails({ userName: user.name, applications })
            })
        })
    }
)