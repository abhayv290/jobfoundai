import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "../clerk/lib/getCurrentAuth";
import { inngest } from "../inngest/client";
import { getUserResumeFileKey, upsertUserResume } from "@/features/users/db/userResume";
import { uploadThing } from "./client";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const customFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    resumeUploader: f({
        pdf: {
            maxFileSize: "8MB",
            maxFileCount: 1,
        },
    }, { awaitServerData: true })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            const { userId } = await getCurrentUser()
            if (!userId) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const { userId } = metadata;

            const resumeFileKey = await getUserResumeFileKey(userId)

            await upsertUserResume(userId, {
                resumeFileUrl: file.ufsUrl,
                resumeFileKey: file.key
            })
            // Delete Old Resume 
            if (resumeFileKey != null) {
                await uploadThing.deleteFiles(resumeFileKey)
            }
            // Sending the resume file to Ai for Processing
            // await inngest.send({
            //     name: 'app/resume.uploaded', user: { id: userId, }
            // })
            return { message: 'Resume Uploaded Successfully' };
        }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;

