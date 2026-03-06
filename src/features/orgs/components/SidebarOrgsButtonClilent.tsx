'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { SignOutButton } from '@/services/clerk/components/AuthButtons';
import { useClerk } from '@clerk/nextjs';
import { ArrowLeftRightIcon, Building2Icon, ChevronsUpDown, CreditCardIcon, LogOutIcon, UserRoundCogIcon } from 'lucide-react';
import Link from 'next/link';


import React from 'react'
interface UserType {
    name: string;
    email: string;
    avatar: string;
}
interface OrgsType {
    name: string;
    avatar: string | undefined;
}
interface SidebarOrgProps {
    user: UserType;
    organizations: OrgsType;
}
const SidebarOrgsButtonClient: React.FC<SidebarOrgProps> = ({ user, organizations }) => {
    const { isMobile, setOpenMobile } = useSidebar();
    const { openOrganizationProfile } = useClerk();
    return (
        <SidebarMenu >
            <DropdownMenu>
                <DropdownMenuTrigger asChild >
                    <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                        <OrgsInfo user={user} organizations={organizations} />
                        <ChevronsUpDown className='ml-auto group-data-[state=collapsed]:hidden' />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    sideOffset={4}
                    align='end'
                    side={isMobile ? 'bottom' : 'right'}
                    className='min-w-64 max-w-80'>
                    <DropdownMenuLabel className='font-normal p-1'>
                        <OrgsInfo user={user} organizations={organizations} />
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { openOrganizationProfile(); setOpenMobile(false) }}>
                        <Building2Icon className='mr-2' />
                        Manage Organization
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/employer/user-settings'}>
                            <UserRoundCogIcon className='mr-2' />
                            User Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/employer/pricing'}>
                            <CreditCardIcon className='mr-2' />
                            Change Plan
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href='/employer/switch-organizations'>
                            <ArrowLeftRightIcon />
                            Switch Organization
                        </Link>
                    </DropdownMenuItem>
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

export default SidebarOrgsButtonClient


function OrgsInfo({ user, organizations }: { user: UserType, organizations: OrgsType }) {
    const nameInitials = organizations.name.split(' ').slice(0, 2).map(str => str[0]).join('');
    return <div className='flex flex-row gap-3 items-center'>
        <Avatar className='rounded-lg  size-10'>
            <AvatarImage src={organizations.avatar ?? undefined}></AvatarImage>
            <AvatarFallback className='uppercase bg-primary text-primary-foreground'>
                {nameInitials}
            </AvatarFallback>
        </Avatar>
        <div className='flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden'>
            <span className='truncate text-sm font-semibold'>{organizations.name || 'hello'}</span>
            <span className='truncate text-xs font-semibold'> {user.email || 'hello@gmail.com'}</span>
        </div>
    </div>
}