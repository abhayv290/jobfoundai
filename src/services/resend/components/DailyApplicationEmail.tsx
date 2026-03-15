
import { Container, Head, Heading, Html, Section, Tailwind, Text } from '@react-email/components'
import tailwindConfig from "../config/tailwindConfig"

import { JobApplicationTable } from '@/drizzle/schema'
import { cn } from '@/lib/utils'

interface Applications extends Pick<typeof JobApplicationTable.$inferSelect, 'rating'> {
    userName: string
    orgId: string
    orgName: string
    jobListingId: string
    jobListingTitle: string
}

export default function DailyApplicationEmails({ userName, applications }: {
    userName: string
    applications: Applications[]

}) {
    return (
        <Tailwind config={tailwindConfig}>
            <Html>
                <Head />
                <Container className="font-sans">
                    <Heading as="h1" >New Applications  </Heading>
                    <Text > Hi , <b>{userName}</b> Here are all the applications that applicants applied recently </Text>
                </Container>

                {Object.entries(Object.groupBy(applications, a => a.orgId)).map(([orgId, orgApps], i) => {
                    if (!orgApps || !orgApps.length) return null
                    return (
                        <OrganizationSection key={orgId} orgName={orgApps[0].orgName} applications={orgApps} noMargin={i === 0} />
                    )
                }
                )}

            </Html>
        </Tailwind>
    )
}

function OrganizationSection({ orgName, applications, noMargin = false }: {
    orgName: string,
    applications: Applications[],
    noMargin?: boolean
}) {
    return (
        <Section className={noMargin ? undefined : 'mt-8'}  >
            <Heading as='h2' className='leading-none font-semibold text-3xl my-4' >
                {orgName}
            </Heading>
            {Object.entries(Object.groupBy(applications, a => a.jobListingId)).map(([jobListingId, jobApps], i) => {
                if (!jobApps || !jobApps.length) return null

                return (
                    <JobListingCard key={jobListingId} title={jobApps[0].jobListingTitle} applications={jobApps} noMargin={i === 0} />
                )
            })}
        </Section>
    )
}

function JobListingCard({ title, applications, noMargin = false }: {
    title: string,
    applications: Applications[],
    noMargin?: boolean
}) {
    return (
        <div className={cn('bg-card text-card-foreground rounded-lg border p-4 border-slate-200/70 border-solid', !noMargin && 'mt-6')}  >
            <Heading as='h3' className='leading-none font-semibold text-3xl my-4'>
                {title}
            </Heading>
            {applications.map(jobs => (
                <Text key={jobs.orgId} >
                    <span >{jobs.userName} :   </span>
                    <RatingIcons rating={jobs.rating} />
                </Text>
            ))}
        </div>
    )
}

function RatingIcons({ rating }: { rating: number | null }) {
    if (!rating || rating < 1 || rating > 5) {
        return null
    }
    return (
        Array.from({ length: 5 }, (_, i: number) => i + 1).map((_, i) => (
            <span key={i} className='text-2xl mb-1.5 mr-1' >
                {rating > i ? <>&#9733;</> : <>&#9734;</>}
            </span>
        ))

    )
}


DailyApplicationEmails.PreviewProps = {
    applications: [
        {
            userName: 'Abhay Vi',
            jobListingId: 'ejriojwf',
            jobListingTitle: 'Software Development Engineer',
            orgId: 'fewjew',
            orgName: 'Reno Solutions',
            rating: 4,
        }
    ],
    userName: 'Abhay Vi',
} satisfies Parameters<typeof DailyApplicationEmails>[0]