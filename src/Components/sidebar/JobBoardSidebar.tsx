import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar'
import JobListingFilterForm from '@/features/jobListings/components/JobListingFilterForm'
import React from 'react'

const JobBoardSidebar: React.FC = () => {
    return (
        <SidebarGroup className='group-data-[state=collapsed]:hidden'>
            <SidebarGroupContent className='px-2' >
                <JobListingFilterForm />
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export default JobBoardSidebar