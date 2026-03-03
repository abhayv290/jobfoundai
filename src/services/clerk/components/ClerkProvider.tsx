'use client'
import React, { Suspense } from 'react'
import { ClerkProvider as OgClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useIsDarkMode } from '@/hooks/useIsDarkMode';

export default function ClerkProvider({ children }: { children: React.ReactNode }) {
    const isDarkMode = useIsDarkMode();
    return (
        <Suspense>
            <OgClerkProvider appearance={isDarkMode ? { baseTheme: [dark] } : undefined}>
                {children}
            </OgClerkProvider>
        </Suspense>
    )
}
