import { JobListingTable } from "@/drizzle/schema"
import { Button, Container, Head, Heading, Html, Section, Tailwind, Text } from '@react-email/components'
import tailwindConfig from "../config/tailwindConfig"
import { formatJobListingLocation, formatJobType, formatWage, } from "@/features/jobListings/lib/formatter"
import { env } from "@/data/env/server"


interface Jobs extends Pick<typeof JobListingTable.$inferInsert, 'id' | 'title' | 'city' |
    'stateAbbreviation' | 'type' | 'locationRequirement' | 'experienceLevel' |
    'wage' | 'wageInterval'> {
    organizationName: string
}

export default function DailyJobEmails({ userName, jobListings, serverUrl }: {
    userName: string
    jobListings: Jobs[]
    serverUrl: string
}) {
    return (
        <Tailwind config={tailwindConfig}>
            <Html>
                <Head />
                <Container className="font-sans">``
                    <Heading as="h1" >New Jobs </Heading>
                    <Text > Hi , <b>{userName}</b> Here are all the jobs that meets your criteria </Text>
                </Container>
                <Section>
                    {jobListings.map(jobs => (
                        <div key={jobs.id} className='bg-card text-card-foreground rounded-lg border p-4 border-primary border-solid mb-5' >
                            <Text className='leading-none  font-semibold text-xl my-0 capitalize' >
                                {jobs.title}
                            </Text>
                            <Text className="text-muted-foreground mb-2 mt-0">
                                {jobs.organizationName}
                            </Text>
                            <div className="mb-5">
                                {getBadges(jobs).map(badge => (
                                    <div key={badge} className="inline-block rounded-md border-solid border font-medium w-fit text-foreground text-sm px-3 py-1 capitalize mb-1 mr-1">
                                        <strong>
                                            {badge}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                            <Button href={`${serverUrl}/job-listings/${jobs.id}`} target="_blank" className="rounded-md text-sm  focus-visible:border-ring bg-primary text-primary-foreground px-4 py-2" >
                                <b>View</b>
                            </Button>
                        </div>
                    ))}
                </Section>
            </Html>
        </Tailwind>
    )
}


function getBadges(jobs: Jobs) {
    const badges = [
        formatJobType(jobs.type),
        jobs.experienceLevel,
        jobs.locationRequirement,
    ]
    if (jobs.city && jobs.stateAbbreviation) {
        badges.unshift(formatJobListingLocation(jobs.city, jobs.stateAbbreviation))
    }
    if (jobs.wage && jobs.wageInterval) {
        badges.unshift(formatWage(jobs.wage, jobs.wageInterval))
    }
    return badges
}

DailyJobEmails.PreviewProps = {
    jobListings: [
        {
            id: 'sjewjjfjd',
            title: 'frontend developer',
            wage: 50000,
            wageInterval: 'monthly',
            city: 'Noida',
            stateAbbreviation: 'UP',
            locationRequirement: 'office',
            type: 'full-time',
            experienceLevel: 'fresher',
            organizationName: 'Reno Solutions'
        }
    ],
    userName: 'Abhay Vi',
    serverUrl: env.SERVER_URL
} satisfies Parameters<typeof DailyJobEmails>[0]