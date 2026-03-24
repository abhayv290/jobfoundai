import { inngest } from "../client";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { env } from "@/data/env/server";
import { updateUserResume } from "@/features/users/db/userResume";
import { resumeSummaryPrompt } from "@/data/constants";

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
                temperature: 0.3,
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
                        { type: 'text', text: resumeSummaryPrompt }
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