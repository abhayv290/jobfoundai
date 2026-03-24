import SidebarClient from '@/components/sidebar/Sidebar'
import { SidebarNavGroups } from '@/components/sidebar/SidebarNavGroups'
import SidebarUserButton from '@/features/users/components/SidebarUserButton'
import { BriefcaseBusiness, LayoutDashboardIcon, LogInIcon, SearchCodeIcon } from 'lucide-react'
import { ReactNode } from 'react'

export default function JobSeekerLayout({ children, sidebar }: { children: ReactNode, sidebar: ReactNode }) {
    return (
        <SidebarClient content={
            <>
                {sidebar}
                <SidebarNavGroups className='mt-auto' items={[
                    { href: '/ai-search', icon: <SearchCodeIcon />, label: 'AiSearch' },
                    { href: '/application-status/recent', icon: <BriefcaseBusiness />, label: 'Application Status' },
                    { href: '/employer', icon: <LayoutDashboardIcon />, label: 'Employee Dashboard', authStatus: 'signedIn' },
                    { href: '/sign-in', icon: <LogInIcon />, label: 'Sign In', authStatus: 'signedOut' },
                ]}>
                </SidebarNavGroups>
            </>
        }
            footerButton={
                <SidebarUserButton />
            } >
            <div className='min-h-screen'>
                {children}
            </div>
        </SidebarClient>
    )
}
