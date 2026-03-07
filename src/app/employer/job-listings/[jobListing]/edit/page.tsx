import { Card, CardContent } from '@/components/ui/card'
import { getJobListing } from '@/features/jobListings/actions/actions'
import JobListingForm from '@/features/jobListings/components/JobListingForm'
import { getCurrentOrg } from '@/services/clerk/lib/getCurrentAuth'
import { notFound } from 'next/navigation'
import { FC, Suspense } from 'react'

interface pageProps {
    params: Promise<{ jobListing: string }>
}

const EditJobListingsPage: FC<pageProps> = (params) => {
    return (
        <div className='max-w-5xl mx-auto p-4'>
            <h2 className='text-2xl font-bold mb-2'>Edit Job Listing</h2>
            <p className='text-muted-foreground mb-5'>Update the details for this listing.</p>
            <Card>
                <CardContent className="pt-6">
                    <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                        <EditListingContent {...params} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditJobListingsPage
async function EditListingContent({ params }: pageProps) {

    const { jobListing } = await params;
    // console.log(jobListingId);

    const { orgId } = await getCurrentOrg();

    if (!orgId || !jobListing) return notFound();

    const listingData = await getJobListing(jobListing, orgId);

    if (!listingData) return notFound();

    return <JobListingForm jobListing={listingData} />
}