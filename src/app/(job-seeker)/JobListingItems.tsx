import React, { Suspense } from 'react'
import { and, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { JobListingTable, OrganizationTable } from '@/drizzle/schema';
import Link from 'next/link';
import { convertSearchParamsToString } from '@/lib/convertSearchParamsToString';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { differenceInDays } from 'date-fns'
import { connection } from 'next/server';
import { Badge } from '@/components/ui/badge';
import JobListingBadges from '@/features/jobListings/components/JobListingBadges';
import { searchParamsSchema } from '@/features/jobListings/actions/schemas';
import z from 'zod';
import { cacheTag } from 'next/cache';
import { getJobListingGlobalTag } from '@/features/jobListings/db/cache/jobListing';
import { getOrgIdTag } from '@/features/orgs/db/cache/orgs';

interface Props {
    searchParams: Promise<Record<string, string | string[]>>
    params?: Promise<{ jobListing: string }>
}

const JobListingItems: React.FC<Props> = async ({ searchParams, params }) => {
    const jobListingId = params ? (await params).jobListing : undefined

    const jobListings = await getJobListings(await searchParams, jobListingId)

    const { success, data } = searchParamsSchema.safeParse(await searchParams)

    const search = success ? data : {}

    if (!jobListings.length) {
        return (
            <div className='w-full h-screen flex items-start justify-center'>
                There is no job listing present here
            </div>
        )
    }
    return (
        <Suspense>
            <div className='container flex flex-col gap-5'>
                {jobListings.map(listing => (
                    <Link href={`/job-listings/${listing.id}?${convertSearchParamsToString(search)}`} key={listing.id}>
                        <JobListingCard jobListing={listing} organization={listing.organizations} />
                    </Link>
                ))}
            </div>
        </Suspense>
    )
}
export default JobListingItems

interface ListProps {
    jobListing: Pick<typeof JobListingTable.$inferSelect, 'id' | 'title' | 'status' |
        'wage' | 'city' | 'stateAbbreviation' | 'wageInterval' | 'experienceLevel' |
        'type' | 'postedAt' | 'locationRequirement' | 'isFeatured'>
    organization: Pick<typeof OrganizationTable.$inferInsert, 'avatar' | 'name'>
}
const JobListingCard: React.FC<ListProps> = ({ jobListing, organization }) => {
    const nameInitials = organization?.name.split(' ').slice(0, 4).map(word => word[0]).join('');
    return (
        <Card
            className={cn(
                '@container relative overflow-hidden',
                jobListing.isFeatured && 'p-px bg-linear-to-r from-rose-800 to-purple-800 border-none'
            )}
        >
            {/* Inner wrapper to restore the card background and shape */}
            <div className={cn(
                "h-full w-full rounded-[inherit] bg-card p-5",
                jobListing.isFeatured && "bg-background/95 backdrop-blur-sm"
            )}>
                <CardHeader>
                    <div className='flex gap-4'>
                        <Avatar className='size-14 @max-sm:hidden'>
                            <AvatarImage src={organization.avatar} />
                            <AvatarFallback className='uppercase bg-primary text-primary-foreground'>
                                {nameInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-2 justify-start'>
                            <CardTitle className='capitalize text-xl'>
                                {jobListing.title}
                            </CardTitle>
                            <CardDescription className='text-base'>
                                {organization.name}
                            </CardDescription>
                            {jobListing.postedAt && (
                                <div className='text-sm font-medium text-primary'>
                                    <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                                        <DaySincePosting postedAt={jobListing.postedAt} />
                                    </Suspense>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='flex gap-2 flex-wrap items-center  p-5'>
                    <JobListingBadges jobListing={jobListing} className='capitalize' />
                </CardContent>
            </div>
        </Card>
    )
}

const DaySincePosting: React.FC<{ postedAt: Date }> = async ({ postedAt }) => {
    await connection();
    const daysSince = differenceInDays(postedAt, new Date())

    if (!daysSince) {
        return (
            <Badge>New</Badge>
        )
    }
    return new Intl.RelativeTimeFormat(undefined, {
        style: 'narrow',
        numeric: 'always',
    }).format(daysSince, 'days')
}

async function getJobListings(
    searchParams: z.infer<typeof searchParamsSchema>,
    jobListingId: string | undefined
) {
    'use cache'

    cacheTag(getJobListingGlobalTag())

    const whereConditions: (SQL | undefined)[] = []

    const parsed = searchParamsSchema.safeParse(searchParams)

    if (!parsed.success) {
        throw new Error("Invalid search params")
    }

    const params = parsed.data

    if (params.title) {
        whereConditions.push(ilike(JobListingTable.title, `%${params.title}%`))
    }

    if (params.city) {
        whereConditions.push(ilike(JobListingTable.city, `%${params.city}%`))
    }

    if (params.locationRequirements) {
        whereConditions.push(
            eq(JobListingTable.locationRequirement, params.locationRequirements)
        )
    }

    if (params.experience) {
        whereConditions.push(
            eq(JobListingTable.experienceLevel, params.experience)
        )
    }

    if (params.state) {
        whereConditions.push(
            eq(JobListingTable.stateAbbreviation, params.state)
        )
    }

    if (params.type) {
        whereConditions.push(eq(JobListingTable.type, params.type))
    }

    // jobIds (now guaranteed to be array if schema transform is correct)
    if (params.jobIds?.length) {
        whereConditions.push(
            or(...params.jobIds.map(j => eq(JobListingTable.id, j)))
        )
    }

    const data = await db.query.JobListingTable.findMany({
        where: or(
            jobListingId
                ? and(
                    eq(JobListingTable.id, jobListingId),
                    eq(JobListingTable.status, "published")
                )
                : undefined,
            and(eq(JobListingTable.status, "published"), ...whereConditions)
        ),
        with: {
            organizations: {
                columns: {
                    id: true,
                    name: true,
                    avatar: true
                }
            }
        },
        orderBy: [
            desc(JobListingTable.isFeatured),
            desc(JobListingTable.postedAt)
        ]
    })

    if (data) {
        data.forEach(item => cacheTag(getOrgIdTag(item.organizations.id)))
    }

    return data
}