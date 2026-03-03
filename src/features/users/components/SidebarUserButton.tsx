// import { auth } from '@clerk/nextjs/server'

import { getCurrentUser } from '@/services/clerk/lib/getCurrentAuth';
import SidebarUserButtonClient from './SidebarUserButtonClient';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { LogOutIcon } from 'lucide-react';
import { SignOutButton } from '@/services/clerk/components/AuthButtons';

const SidebarUserButton = async () => {
    const { user } = await getCurrentUser({ allData: true });

    if (!user) {
        return (
            <SignOutButton>
                <SidebarMenuButton>
                    <LogOutIcon />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SignOutButton>
        )
    }
    return (
        <SidebarUserButtonClient user={user} />
    )
}

export default SidebarUserButton