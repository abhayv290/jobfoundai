import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Suspense } from "react";
import UploadDropzoneClient from "./UploadDropzoneClient";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { notFound } from "next/navigation";
import { getUserResume } from "@/features/jobApplications/db/actions";

import Link from "next/link";
import MarkdownRenderer from "@/features/jobListings/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";

export default function ResumePage() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold" >Upload Your Resume</h1>
            <Card className="p-4">
                <CardContent className="text-2xl font-semibold">
                    <UploadDropzoneClient />
                </CardContent>
                <Suspense>
                    <ResumeDetails />
                </Suspense>
            </Card>
            <Suspense>
                <AiSummaryDetails />
            </Suspense>
        </div>
    )
}


async function ResumeDetails() {
    const { user } = await getCurrentUser({ allData: true })
    if (!user) {
        return notFound()
    }
    const userResume = await getUserResume(user.id)
    if (!userResume) {
        return <div>No Resume Found</div>
    }
    return <CardFooter>
        <Button asChild>
            <Link href={userResume.resumeFileUrl} target='_blank' rel="noopener noreferrer">
                View Resume</Link>
        </Button>
        <CardDescription className="ml-4 text-lg text-muted-foreground lowercase">{user.name?.split(' ')[0]}.pdf</CardDescription>
    </CardFooter>
}

async function AiSummaryDetails() {
    const { userId } = await getCurrentUser()
    if (!userId) return notFound()

    const userResume = await getUserResume(userId)
    if (!userResume || !userResume.aiSummary) {
        return null
    }

    return <Card>
        <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold flex gap-2 items-center"><SparkleIcon /> Ai Summary</CardTitle>
            <CardDescription>AI-generated summary tailored to help you highlight key qualifications and experience</CardDescription>
        </CardHeader>
        <CardContent>
            <MarkdownRenderer source={userResume.aiSummary} className="text-slate-200/80" />
        </CardContent>
    </Card>
}