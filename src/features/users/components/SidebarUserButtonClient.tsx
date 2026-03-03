'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { SignOutButton } from '@/services/clerk/components/AuthButtons';
import { useClerk } from '@clerk/nextjs';
import { ChevronsUpDown, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';


import React from 'react'
interface UserType {
    name: string;
    email: string;
    avatar: string;
}
const SidebarUserButtonClient: React.FC<{ user: UserType }> = ({ user }) => {
    const { isMobile, setOpenMobile } = useSidebar();
    const { openUserProfile } = useClerk();
    return (
        <SidebarMenu >
            <DropdownMenu>
                <DropdownMenuTrigger asChild >
                    <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                        <UserInfo {...user} />
                        <ChevronsUpDown className='ml-auto group-data-[state=collapsed]:hidden' />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    sideOffset={4}
                    align='end'
                    side={isMobile ? 'bottom' : 'right'}
                    className='min-w-64 max-w-80'>
                    <DropdownMenuLabel className='font-normal p-1'>
                        <UserInfo {...user} />
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { openUserProfile(); setOpenMobile(false) }}>
                        <UserIcon className='mr-2' />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/user/settings/notifications'}>
                            <SettingsIcon className='mr-2' />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <SignOutButton>
                        <DropdownMenuItem asChild>
                            <Link href={'/'}>
                                <LogOutIcon className='mr-2' />
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </SignOutButton>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenu>
    )
}

export default SidebarUserButtonClient


function UserInfo(user: UserType) {
    const nameInitials = user.name.split(' ').slice(0, 2).map(str => str[0]).join('');
    return <div className='flex flex-row gap-3 items-center'>
        <Avatar className='rounded-lg  size-10'>
            <AvatarImage src={user.avatar}></AvatarImage>
            <AvatarFallback className='uppercase bg-primary text-primary-foreground'>
                {nameInitials}
            </AvatarFallback>
        </Avatar>
        <div className='flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden'>
            <span className='truncate text-sm font-semibold'>{user.name}</span>
            <span className='truncate text-xs font-semibold'> {user.email}</span>
        </div>
    </div>
}