'use client'
import { ReactNode, Suspense } from "react"
import { SignOutButton as ClerkSignout, } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
export const SignedIn = ({ children }: { children: ReactNode }) => {
    const { userId } = useAuth()
    if (!userId) return null
    return <>{children}</>
}

export const SignedOut = ({ children }: { children: ReactNode }) => {
    const { userId } = useAuth()
    if (userId) return null
    return <>{children}</>
}

export const SignOutButton = ({ children }: { children: ReactNode }) => {
    return (<Suspense>
        <ClerkSignout>
            {children}
        </ClerkSignout>
    </Suspense>)
}

