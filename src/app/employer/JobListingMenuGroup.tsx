'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenu, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { JobListingStatus, JobListingTable } from '@/drizzle/schema'
import { formatJobStatus } from '@/features/jobListings/components/JobListingBadges';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react'

interface JobListing extends Pick<typeof JobListingTable.$inferSelect, 'id' | 'title'> {
    applicationCount: number;
}
const JobListingMenuGroup: FC<{ status: JobListingStatus, jobListings: JobListing[] }> = ({ status, jobListings }) => {
    const { jobListing } = useParams();
    return (
        <SidebarMenu>
            <Collapsible defaultOpen={status !== 'de-listed' || jobListings.find(job => job.id === jobListing) != null} className='group/collapsible'>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-accent">
                        {formatJobStatus(status)}
                        <span className='text-2xl ml-auto'>
                            <ChevronRightIcon className=' transition-transform group-data-[state=open]/collapsible:rotate-90' />
                        </span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {jobListings.map(listing => (
                            <JobListingMenuItem key={listing.id} {...listing} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenu>
    )
}

export default JobListingMenuGroup


function JobListingMenuItem({ id, title, applicationCount }: JobListing) {
    const { jobListing } = useParams();
    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton isActive={jobListing === id} asChild>
                <Link href={`/employer/job-listings/${id}`}>
                    <span className='truncate capitalize'>
                        {title}
                    </span>
                </Link>
            </SidebarMenuSubButton>
            {applicationCount > 0 && (
                <div className='absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                    {2}
                </div>
            )}
        </SidebarMenuSubItem>
    )
}