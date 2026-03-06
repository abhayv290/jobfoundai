import SidebarClient from '@/components/sidebar/Sidebar'
import { SidebarNavGroups } from '@/components/sidebar/SidebarNavGroups'
import { SidebarGroup, SidebarGroupAction, SidebarGroupLabel } from '@/components/ui/sidebar'
import SidebarOrgsButton from '@/features/orgs/components/SidebarOrgsButton'
import { getCurrentOrg } from '@/services/clerk/lib/getCurrentAuth'
import { ClipboardIcon, PlusCircle, SearchCodeIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

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
                        <SidebarGroupLabel>
                            Job Listings
                        </SidebarGroupLabel>
                        <SidebarGroupAction asChild title='Add Job Listing'>
                            <Link href={'/employer/job-listings-new'}>
                                <PlusCircle />
                                <span className='sr-only'>Add Job Listings</span>
                            </Link>
                        </SidebarGroupAction>
                    </SidebarGroup>
                    <SidebarNavGroups classname='mt-auto' items={[
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
