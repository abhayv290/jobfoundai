
import { getCurrentOrg, getCurrentUser } from '@/services/clerk/lib/getCurrentAuth';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { LogOutIcon } from 'lucide-react';
import { SignOutButton } from '@/services/clerk/components/AuthButtons';
import SidebarOrgsButtonClient from './SidebarOrgsButtonClilent';

const SidebarOrgsButton = async () => {
    const [{ user }, { organizations }] = await Promise.all([getCurrentUser({ allData: true }), getCurrentOrg({ allData: true })]);
    if (!user || !organizations) {
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
        <SidebarOrgsButtonClient user={user} organizations={organizations} />
    )
}

export default SidebarOrgsButton