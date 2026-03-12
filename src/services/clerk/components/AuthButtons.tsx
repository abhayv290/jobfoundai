import { FC, PropsWithChildren, ReactNode, Suspense } from "react"
import { SignedIn as ClerkSignedIn, SignedOut as ClerkSignedOut, SignOutButton as ClerkSignout, } from "@clerk/nextjs"

export const SignedIn = ({ children }: { children: ReactNode }) => {
    return (
        <Suspense>
            <ClerkSignedIn>
                {children}
            </ClerkSignedIn>
        </Suspense>
    )
}


export const SignedOut = ({ children }: { children: ReactNode }) => {
    return (
        <Suspense>
            <ClerkSignedOut>
                {children}
            </ClerkSignedOut>
        </Suspense>
    )
}


export const SignOutButton: FC<PropsWithChildren> = ({ children }) => {
    return (<Suspense>
        <ClerkSignout>
            {children}
        </ClerkSignout>
    </Suspense>)
}

