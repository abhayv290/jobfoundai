import { OrganizationList } from '@clerk/nextjs';
import { connection } from 'next/server';
import { Suspense } from 'react'

interface Props {
    searchParams: Promise<{ redirect?: string }>
}

export default function page(props: Props) {
    return (
        <Suspense>
            <OrganizationPage {...props} />
        </Suspense>
    )
}

async function OrganizationPage({ searchParams }: Props) {
    await connection()
    const { redirect } = await searchParams;
    const redirectUrl = redirect ?? '/employer';
    return (
        <OrganizationList hidePersonal skipInvitationScreen afterCreateOrganizationUrl={redirectUrl} afterSelectOrganizationUrl={redirectUrl} />
    )
}