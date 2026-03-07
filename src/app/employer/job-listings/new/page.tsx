import { Card, CardContent } from '@/components/ui/card'
import JobListingForm from '@/features/jobListings/components/JobListingForm'
import { FC } from 'react'


const NewJobListingsPage: FC = () => {
    return (
        <div className='max-w-5xl mx-auto p-4'>
            <h2 className='text-2xl font-bold mb-2'>
                New Job Listing
            </h2>
            <p className='text-muted-foreground mb-5'>This does not posted a Listing yet . It just saved a draft</p>
            <Card>
                <CardContent>
                    <JobListingForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default NewJobListingsPage
