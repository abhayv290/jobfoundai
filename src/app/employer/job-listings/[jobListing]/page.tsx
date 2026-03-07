import LoadingSwap from '@/components/LoadingSwap'
import { Button } from '@/components/ui/button'
import { getJobListing } from '@/features/jobListings/actions/actions'
import JobListingBadges from '@/features/jobListings/components/JobListingBadges'
import MarkdownPartial from '@/features/jobListings/components/MarkdownPartial'
import MarkdownRenderer from '@/features/jobListings/components/MarkdownRenderer'
import { getCurrentOrg } from '@/services/clerk/lib/getCurrentAuth'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, Suspense } from 'react'

interface JobListingProps {
    params: Promise<{ jobListing: string }>
}

export default function page(props: JobListingProps) {
    return (
        <Suspense fallback={'Loading...'}>
            <JobListingPage {...props} />
        </Suspense>
    )
}

const JobListingPage: FC<JobListingProps> = async ({ params }) => {
    const { orgId } = await getCurrentOrg();
    if (!orgId) {
        return null;
    }
    const { jobListing } = await params;

    const myJobListing = await getJobListing(jobListing, orgId);
    if (!myJobListing) {
        return notFound();
    }
    return (
        <div className='@container space-y-6 max-w-6xl mx-auto p-4'>
            <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
                {/* Heading and badging  */}
                <div>
                    <h1 className='text-2xl md:text-3xl font-bold tracking-tight mb-2'>{myJobListing.title}</h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <JobListingBadges jobListing={myJobListing} />
                    </div>
                </div>
                {/* Action buttons only for owners  */}
                <div className='flex items-center gap-2 empty:-mt-4'>
                    <Button asChild variant={'outline'}>
                        <Link href={`/employer/job-listings/${jobListing}/edit`}>
                            <EditIcon /> Edit
                        </Link>
                    </Button>
                </div>

            </div>
            <hr />
            {/* Job Description Markdown renderer  */}
            <MarkdownPartial dialogMarkdown={<MarkdownRenderer source={myJobListing.description} />}
                mainMarkdown={<MarkdownRenderer className='prose-sm' source={myJobListing.description} />}
                dialogTitle='description' />
        </div>
    )
}



