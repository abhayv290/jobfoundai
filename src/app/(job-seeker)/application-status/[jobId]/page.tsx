import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/drizzle/db";
import { JobApplicationTable, JobListingTable, OrganizationTable } from "@/drizzle/schema";
import { ResumeFitSection } from "@/features/jobApplications/components/ApplicationFit";
import JobProgressBar from "@/features/jobApplications/components/ApplicationStatusProgressbar";
import { getJobApplicationGlobalTag, getJobApplicationIdCacheTag, } from "@/features/jobApplications/db/cache/applications";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { eq, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ jobId: string }>
}

export default async function ApplicationStatusPage({ params }: PageProps) {
    const { jobId } = await params
    const { userId } = await getCurrentUser()
    if (!userId) return notFound()
    const applications = await getUserJobApplications(userId)
    if (!applications || !applications.length) {
        return (
            <div className="flex items-center justify-center h-[90vh] flex-col">
                <CardTitle className="text-center text-2xl md:text-3xl">No Applications Found</CardTitle>
                <CardDescription className="text-center text-base text-slate-300/70">Looks like You haven&apos;t applied to any job yet</CardDescription>
            </div>

        )
    }
    return (
        <Suspense>
            <section className="p-5">
                <Card className="mx-auto lg:max-w-5xl md:max-w-3xl h-full px-5">
                    <CardContent className="flex flex-wrap gap-3 items-center justify-between">
                        <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold">Job Application Status</CardTitle>
                        <div className="inline-flex gap-3">
                            <div className="inline-flex items-center gap-1">
                                <span className="text-6xl font-semibold">{applications.length}</span>

                                <span >Total <br /> Applies</span>
                            </div>
                            {/* vertical column  */}
                            <div className="bg-slate-500 w-0.5 rounded-xl"></div>
                            <div className="inline-flex  items-center gap-1">
                                <span className="text-6xl items-center font-semibold">{applications.filter(a => a.status !== 'applied').length}</span>
                                <span >Application <br /> Updates</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <ApplicationStatusComponent application={jobId === 'recent' ? applications[0] : applications.find(a => a.jobId === jobId)} />
            </section>
        </Suspense>
    )
}
export type ApplicationStatus = 'applied' | 'interested' | 'interviewed' | 'hired' | 'denied'
export interface UserJobApplication {
    status: ApplicationStatus
    appliedAt: Date;
    updatedAt: Date;
    rating: number | null;
    coverLetter: string | null;
    jobTittle: string | null;
    jobId: string | null;
    orgName: string | null;
    totalApplicants: number;
    actionedApplicants: number;
}

function ApplicationStatusComponent({ application }: { application: UserJobApplication | undefined }) {
    if (!application) {
        return (
            <Card className="mx-auto px-5">
                <CardTitle className="text-center text-2xl">NO Applications Found</CardTitle>
                <CardDescription className="text-center text-base text-accent">Looks like You haven&apos;t applied to any job yet</CardDescription>
            </Card>
        )
    }
    return (
        <Card className="my-5">
            <CardHeader>
                <CardTitle className="capitalize text-xl sm:text-2xl font-semibold">{application.jobTittle}</CardTitle>
                <CardDescription className="text-accent-foreground text-sm">{application.orgName}</CardDescription>
                <Button asChild variant={'link'} className="text-blue-400 underline-offset-2 flex justify-start">
                    <Link className="text-start w-20" href={'/'} >View Similar jobs</Link>
                </Button>
            </CardHeader>
            <Separator />
            <CardContent >
                <h2 className="text-lg sm:text-xl font-semibold">Application Status</h2>
                <div className="">
                    <JobProgressBar status={application.status} appliedAt={application.appliedAt.toLocaleDateString()} updatedAt={application.updatedAt.toLocaleDateString()} />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold">Activity on this job</h2>
                <div className="shadow-md shadow-slate-700/50 p-5 rounded-xl inline-flex  justify-start gap-5 mb-5">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-4xl font-semibold">{application.totalApplicants}</span>

                        <span className="text-sm">Total <br /> Applications</span>
                    </div>
                    {/* vertical column  */}
                    <div className="bg-slate-500/50 w-0.5 rounded-xl"></div>
                    <div className="inline-flex  items-center gap-2">
                        <span className="text-4xl items-center font-semibold">{application.actionedApplicants}</span>
                        <span className="text-sm">Application <br /> Viewed by Recruiter</span>
                    </div>
                </div>
                <Separator />
                {application.rating && <ResumeFitSection rating={application.rating} />}
                <CardDescription className="text-sm"><strong>Note:</strong> this Analysis is generated by
                    Ai by comparing your resume to the job description</CardDescription>
            </CardContent>
        </Card>
    )
}




export async function getUserJobApplications(userId: string) {
    'use cache'
    cacheTag(getJobApplicationGlobalTag())

    const results = await db.select({
        status: JobApplicationTable.stage,
        appliedAt: JobApplicationTable.createdAt,
        updatedAt: JobApplicationTable.updatedAt,
        rating: JobApplicationTable.rating,
        coverLetter: JobApplicationTable.coverLetter,
        jobTittle: JobListingTable.title,
        jobId: JobListingTable.id,
        orgName: OrganizationTable.name,
        totalApplicants: sql<number>`(
            SELECT count(*) 
            FROM ${JobApplicationTable} 
            WHERE ${JobApplicationTable.jobListingId} = ${JobListingTable.id}
        )`.mapWith(Number),
        actionedApplicants: sql<number>`(
            SELECT count(*) 
            FROM ${JobApplicationTable} 
            WHERE ${JobApplicationTable.jobListingId} = ${JobListingTable.id}
            AND ${JobApplicationTable.stage} != 'applied'
        )`.mapWith(Number),
    })
        .from(JobApplicationTable)
        .leftJoin(JobListingTable, eq(JobApplicationTable.jobListingId, JobListingTable.id))
        .leftJoin(OrganizationTable, eq(JobListingTable.orgId, OrganizationTable.id))
        .where(eq(JobApplicationTable.userId, userId));

    results.map(res => {
        if (res.jobId) {
            cacheTag(getJobApplicationIdCacheTag(userId, res.jobId))
        }
    })
    return results;
}


