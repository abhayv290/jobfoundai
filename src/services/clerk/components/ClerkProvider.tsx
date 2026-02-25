'use client'
import React from 'react'
import { ClerkProvider as OgClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useIsDarkMode } from '@/hooks/useIsDarkMode';

export default function ClerkProvider({ children }: { children: React.ReactNode }) {
    const isDarkMode = useIsDarkMode();
    return (

        <OgClerkProvider appearance={isDarkMode ? { baseTheme: [dark] } : undefined}>
            {children}
        </OgClerkProvider>

    )
}
