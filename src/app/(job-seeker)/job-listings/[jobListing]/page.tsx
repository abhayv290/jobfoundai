import IsBreakPoint from "@/components/IsBreakPoint"
import LoadingSpinner from "@/components/LoadingSpinner"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { FC, Suspense } from "react"
import ClientSheet from "./ClientSheet"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import JobListingItems from "../../JobListingItems"
import { getJobListingById } from "@/features/jobListings/actions/actions"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { convertSearchParamsToString } from "@/lib/convertSearchParamsToString"
import { Badge, XIcon } from "lucide-react"
import JobListingBadges from "@/features/jobListings/components/JobListingBadges"
import MarkdownRenderer from "@/features/jobListings/components/MarkdownRenderer"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SignUpButton } from "@clerk/nextjs"
import { getJobApplication, getUserResume } from "@/features/jobApplications/db/actions"
import { connection } from "next/server"
import { differenceInDays } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import JobApplicationForm from "@/features/jobApplications/components/JobApplicationForm"



interface Props {
    params: Promise<{ jobListing: string }>
    searchParams: Promise<Record<string, string | string[]>>
}
export default function JobListingHomePage({ params, searchParams }: Props) {
    return (
        <ResizablePanelGroup autoSave="job-board-panel" dir="horizontal">
            {/* Panel 1: Always Visible (Left Side) */}
            <ResizablePanel id="left" defaultSize={60} minSize={30}>
                <div className="p-4 h-screen overflow-y-auto no-scrollbar">
                    <Suspense fallback={<LoadingSpinner />}>
                        <JobListingItems params={params} searchParams={searchParams} />
                    </Suspense>
                </div>
            </ResizablePanel>
            <IsBreakPoint
                breakpoint='min-width:1024px'
                otherwise={
                    <ClientSheet>
                        <SheetContent className="px-4" showCloseButton={false}>
                            <SheetHeader className="sr-only">
                                <SheetTitle>Job Listing Details</SheetTitle>
                            </SheetHeader>
                            <Suspense fallback={<LoadingSpinner />}>
                                <JobListingDetails searchParams={searchParams} params={params} />
                            </Suspense>
                        </SheetContent>
                    </ClientSheet>
                }
            >
                {/* Panel 2: Only Visible on Desktop */}
                <ResizableHandle withHandle className="w-1 bg-border hover:bg-primary transition-colors" />
                {/* 2. The Right Panel */}
                <ResizablePanel id="right" defaultSize={40} minSize={30}>
                    <div className="p-4 h-screen overflow-y-auto border-l no-scrollbar">
                        <Suspense fallback={<LoadingSpinner />}>
                            <JobListingDetails params={params} searchParams={searchParams} />
                        </Suspense>
                    </div>
                </ResizablePanel>
            </IsBreakPoint>
        </ResizablePanelGroup>
    )
}

const JobListingDetails: FC<Props> = async ({ params, searchParams }) => {
    const jobListingId = params ? (await params).jobListing : undefined
    if (!jobListingId) return notFound()

    const jobListing = await getJobListingById(jobListingId)
    if (!jobListing) return notFound()

    const nameInitials = jobListing.organizations.name?.split(' ').slice(0, 4).map(i => [i]).join('')
    return (
        <div className="@container space-y-5">
            <div className="space-y-4">
                <div className="flex gap-4 items-start">
                    <Avatar>
                        <AvatarImage src={jobListing.organizations.avatar} alt={jobListing.organizations.name}>
                        </AvatarImage>
                        <AvatarFallback>
                            {nameInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {jobListing.title}
                        </h1>
                        <p className="text-base text-muted-foreground">
                            {jobListing.organizations.name}
                        </p>
                        {jobListing.postedAt && (
                            <div className="text-lg font-semibold">
                                <Suspense>
                                    Posted :  <DaySincePosting postedAt={jobListing.postedAt} />
                                </Suspense>
                            </div>
                        )}
                    </div>
                    <div className="ml-auto flex-items-center gap-4">
                        <Button size={'icon'} variant={'outline'} asChild >
                            <Link href={`/?${convertSearchParamsToString(await searchParams)}`}>
                                <span className="sr-only">Close</span>
                                <XIcon />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className='space-x-2 space-y-2 ml-5'>
                    <JobListingBadges jobListing={jobListing} className="capitalize  border-slate-300/40" />
                </div>
                {/* Job Apply  */}
                <Suspense fallback={<Button disabled>Apply</Button>}>
                    <ApplyButton id={jobListing.id} />
                </Suspense>
                <hr />
                <MarkdownRenderer source={jobListing.description} />
            </div>
        </div>
    )
}

const DaySincePosting: React.FC<{ postedAt: Date }> = async ({ postedAt }) => {
    await connection();
    const daysSince = differenceInDays(postedAt, new Date())

    if (!daysSince) {
        return (
            <Badge>New</Badge>
        )
    }
    return new Intl.RelativeTimeFormat(undefined, {
        style: 'narrow',
        numeric: 'always',
    }).format(daysSince, 'days')
}

const ApplyButton: FC<{ id: string }> = async ({ id }) => {
    const { userId } = await getCurrentUser()
    if (!userId) {
        return <Popover>
            <PopoverTrigger asChild className="ml-2">
                <Button className="rounded-2xl  text-lg">Apply</Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-4">
                You need to create an Account before applying for a job
                <Button asChild>
                    <SignUpButton />
                </Button>
            </PopoverContent>
        </Popover>
    }
    const application = await getJobApplication(id, userId)
    if (application) {
        const formatter = new Intl.RelativeTimeFormat(undefined, { style: 'short', numeric: 'always' })
        await connection()
        const difference = differenceInDays(application.createdAt, new Date())
        return (
            <div className="text-muted-foreground text-sm">
                You Already applied for this job {difference === 0 ? 'Today' : formatter.format(difference, 'days')}
            </div>
        )
    }
    const userResume = await getUserResume(userId)
    if (!userResume) {
        return <Popover>
            <PopoverTrigger asChild className="ml-2">
                <Button className="rounded-2xl  text-lg">Apply</Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-3">
                You Need to Upload a Resume before Applying
                <Button asChild>
                    <Link href={'/user-settings/resume'}>Upload Resume</Link>
                </Button>
            </PopoverContent>
        </Popover>
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-2xl  text-lg">Apply</Button>
            </DialogTrigger>
            <DialogContent className='md:max-w-3xl max-h-[98%] overflow-hidden flex flex-col'>
                <DialogHeader>
                    <DialogTitle>Application</DialogTitle>
                    <DialogDescription>
                        Applying for a job is irreversible , You can only apply once per job
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                    <JobApplicationForm jobListingId={id} />
                </div>
            </DialogContent>


        </Dialog>
    )
}