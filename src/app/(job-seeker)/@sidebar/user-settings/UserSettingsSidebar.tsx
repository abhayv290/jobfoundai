import { SidebarNavGroups } from '@/components/sidebar/SidebarNavGroups'
import { BellIcon, FileUserIcon } from 'lucide-react'
import { FC } from 'react'

const UserSettingsSidebar: FC = () => {
    return (
        <SidebarNavGroups items={[
            { href: '/user-settings/notifications', icon: <BellIcon />, label: 'User Notification' },
            { href: '/user-settings/resume', icon: <FileUserIcon />, label: 'User Resume' }
        ]} >

        </SidebarNavGroups>
    )
}

export default UserSettingsSidebar