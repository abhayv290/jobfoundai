import React from 'react'
export default function ClerkLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='w-screen flex h-screen items-center justify-center'>
            {children}
        </div>
    )
}