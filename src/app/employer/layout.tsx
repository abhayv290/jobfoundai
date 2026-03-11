import AsyncIf from '@/components/AsyncIf'
import SidebarClient from '@/components/sidebar/Sidebar'
import { SidebarNavGroups } from '@/components/sidebar/SidebarNavGroups'
import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { JobListingStatus } from '@/drizzle/schema'
import { getJobListingArray } from '@/features/jobListings/actions/actions'
import { sortJobListingByStatus } from '@/features/jobListings/lib/utils'
import SidebarOrgsButton from '@/features/orgs/components/SidebarOrgsButton'
import { getCurrentOrg } from '@/services/clerk/lib/getCurrentAuth'
import { hasOrgUserPermission } from '@/services/clerk/lib/orgUserPermissions'
import { ClipboardIcon, PlusCircle, PlusIcon, SearchCodeIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
import JobListingMenuGroup from './JobListingMenuGroup'

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
    const { orgId } = await getCurrentOrg();
    if (!orgId) {
        return redirect('/organizations/select')
    }
    return (
        <Suspense>
            <SidebarClient content={
                <>
                    <SidebarGroup>
                        <SidebarGroupLabel className='text-base'>
                            Job Listings
                        </SidebarGroupLabel>
                        <AsyncIf condition={() => hasOrgUserPermission('org:job_listing:create_job_listings')} otherwise={
                            <SidebarGroupAction asChild title='Upgrade Plan'>
                                <Link href={'/employer/pricing'}>
                                    Upgrade
                                </Link>
                            </SidebarGroupAction>
                        }>
                            <SidebarGroupAction asChild title='Add Job Listing' >
                                <Link href={'/employer/job-listings/new'} >
                                    <PlusCircle />
                                    <span className='sr-only'>Add Job Listings</span>
                                </Link>
                            </SidebarGroupAction>
                        </AsyncIf>
                    </SidebarGroup>
                    <SidebarGroupContent className='group-data-[state=collapsed]:hidden'>
                        <JobListingMenu orgId={orgId} />
                    </SidebarGroupContent>
                    <SidebarNavGroups className='mt-auto' items={[
                        { href: '/', icon: <ClipboardIcon />, label: 'JobBoard' },
                        { href: '/ai-search', icon: <SearchCodeIcon />, label: 'AiSearch' },
                    ]}>
                    </SidebarNavGroups>
                </>
            }
                footerButton={
                    <SidebarOrgsButton />
                } >
                <div>
                    {children}
                </div>
            </SidebarClient>
        </Suspense>
    )
}


async function JobListingMenu({ orgId }: { orgId: string }) {
    const jobListings = await getJobListingArray(orgId);
    if (!jobListings.length && (await hasOrgUserPermission('org:job_listing:create_job_listings'))) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={'/employer/job-listings/new'} className='inline-flex gap-2 items-center'><PlusIcon />
                            <span>Add your First Job Listing</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }
    return Object.entries(Object.groupBy(jobListings, j => j.status))
        .sort(([a], [b]) => sortJobListingByStatus(a as JobListingStatus, b as JobListingStatus))
        .map(([status, jobListings]) => (
            <JobListingMenuGroup key={status} jobListings={jobListings} status={status as JobListingStatus} />
        ))

}

