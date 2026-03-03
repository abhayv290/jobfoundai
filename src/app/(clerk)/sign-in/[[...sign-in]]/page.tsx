import { SignIn } from '@clerk/nextjs'
import { cookies, headers } from 'next/headers'
import React, { Suspense } from 'react'


export default async function page() {
    await headers();
    await cookies();
    return (
        <Suspense>
            <SignIn />
        </Suspense>
    )
}
