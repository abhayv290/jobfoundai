'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import React, { PropsWithChildren } from 'react'
import { SidebarTrigger } from './ui/sidebar';

const AppSidebar: React.FC<PropsWithChildren> = ({ children }) => {
    const isMobile = useIsMobile();
    if (isMobile) {
        return (
            <div className='w-full flex-col gap-5'>
                <div className='p-2 border-b flex items-center gap-2'>
                    <SidebarTrigger />
                    <span className='text-xl font-bold'>JobFoundAi</span>
                </div>
                <div className=''>
                    {children}
                </div>
            </div>
        )
    }
    return (
        <>
            {children}
        </>
    )
}

export default AppSidebar