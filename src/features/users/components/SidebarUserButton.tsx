import { auth } from '@clerk/nextjs/server'

import SidebarUserButtonClient from './SidebarUserButtonClient';

const SidebarUserButton = async () => {
    const { userId } = auth();
    return (
        <SidebarUserButtonClient user={{ email: 'hello@gmail.com', name: 'hello there', avatar: 'url' }} />
    )
}

export default SidebarUserButton