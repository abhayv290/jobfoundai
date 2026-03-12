import { inngest } from "../client";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { env } from "@/data/env/server";
import { updateUserResume } from "@/features/users/db/userResume";

export const createAiSummary = inngest.createFunction({
    id: 'create-ai-summary',
    name: 'Create Ai Summary',
}, {
    event: 'app/resume.uploaded'
}, async ({ step, event }) => {
    const { id: userId } = event.user

    const userResume = await step.run('get-user-resume', async () => (
        await db.query.UserResumeTable.findFirst({
            where: eq(UserResumeTable.userId, userId),
            columns: {
                resumeFileUrl: true
            }
        })
    ))
    if (!userResume) return;
    const res = await step.ai.infer('create-ai-summery', {
        model: step.ai.models.anthropic({
            model: 'claude-sonnet-4-0',
            defaultParameters: {
                max_tokens: 2048,
                temperature: 0.5,
            },
            apiKey: env.CLOUDE_API_KEY
        }),
        body: {
            messages: [
                {
                    role: 'user', content: [
                        {
                            type: 'document', source: {
                                type: 'url',
                                url: userResume.resumeFileUrl
                            }
                        },
                        { type: 'text', text: 'Summarize the following resume and extract all the following key skills , experiences   and qualifications.The Summary should include all the information that a hiring manage would need to about the candidate in order to determine whether the candidate is good fit for the job or not.The Summary should be formatted as markdown ,do not return any other text .If the file does not look like a resume return the text N/A' }
                    ]
                }
            ]
        }
    })

    await step.run('save-ai-summary-to-db', async () => {
        const message = res.content[0]
        if (message.type !== 'text' || message.text === 'N/A') return

        await updateUserResume(userId, { aiSummary: message.text })
    })
})