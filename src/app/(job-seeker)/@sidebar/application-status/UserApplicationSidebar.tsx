'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenu, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react'
import { type ApplicationStatus, type UserJobApplication } from '../../application-status/[jobId]/page';


const UserApplicationMenuGroup: FC<{ status: ApplicationStatus, applications: UserJobApplication[] }> = ({ applications, status }) => {
    const { jobId } = useParams();
    return (
        <SidebarMenu>
            <Collapsible defaultOpen={status !== 'applied' || applications.find(apps => apps.jobId === jobId) != null} className='group/collapsible'>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-accent">
                        <span className='capitalize text-md font-semibold ml-2 text-accent-foreground'>{status}</span>
                        <span className='text-2xl ml-auto'>
                            <ChevronRightIcon className=' transition-transform group-data-[state=open]/collapsible:rotate-90' />
                        </span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {applications.map(apps => (
                            <JobListingMenuItem key={apps.jobId} {...apps} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenu>
    )
}

export default UserApplicationMenuGroup


function JobListingMenuItem({ jobId, jobTittle, totalApplicants }: UserJobApplication) {
    const params = useParams();
    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton isActive={params?.jobId === jobId} asChild>
                <Link href={`/application-status/${jobId}`}>
                    <span className='truncate capitalize'>
                        {jobTittle}
                    </span>
                </Link>
            </SidebarMenuSubButton>
            {totalApplicants > 0 && (
                <div className='absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                    {totalApplicants}
                </div>
            )}
        </SidebarMenuSubItem>
    )
}