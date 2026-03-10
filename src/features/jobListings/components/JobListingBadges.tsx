import { Badge } from '@/components/ui/badge';
import { JobListingStatus, JobListingTable } from '@/drizzle/schema'
import { cn } from '@/lib/utils'
import { ComponentProps, FC } from 'react'
import { formatJobListingLocation, formatJobType, formatWage } from '../lib/formatter';
import { BanknoteIcon, Building2Icon, CircleCheckBigIcon, CircleOffIcon, FilePenLine, GraduationCap, HourglassIcon, MapPinIcon, StarIcon } from 'lucide-react';

interface JobBadgesProps {
    jobListing: Pick<typeof JobListingTable.$inferSelect, 'wage' | 'wageInterval' | 'city' | 'stateAbbreviation' | 'experienceLevel' | 'isFeatured' | 'locationRequirement' | 'type' | 'status'>
    className?: string;
}
const JobListingBadges: FC<JobBadgesProps> = ({ jobListing: {
    isFeatured,
    wage,
    wageInterval,
    type,
    status,
    city,
    stateAbbreviation,
    experienceLevel,
    locationRequirement

}, className }) => {
    const badgeProps = {
        variant: 'outline',
        className: cn(isFeatured && 'border-primary/40', className)
    } satisfies ComponentProps<typeof Badge>

    return (
        <>
            {/* Status  */}
            <Badge>{formatJobStatus(status)}</Badge>
            {/* is Featured  */}
            {isFeatured && (
                <Badge {...badgeProps} className='bg-linear-to-l from-purple-800      to-rose-800'><StarIcon /> Featured</Badge>
            )}
            {/* Wage & WageInterval  */}
            {wage && wageInterval && <Badge {...badgeProps}><BanknoteIcon />{formatWage(wage, wageInterval)}</Badge>}

            {/* City & stateAbbreviation  */}
            {(city || stateAbbreviation) && <Badge {...badgeProps}><MapPinIcon /> {formatJobListingLocation(city, stateAbbreviation)}  </Badge>}

            {/* JobType  */}
            <Badge  {...badgeProps}> <HourglassIcon />  {formatJobType(type)}</Badge>

            {/* Experience Level  */}
            <Badge {...badgeProps}   > <GraduationCap /> {experienceLevel}</Badge>

            {/* LocationRequirements  */}
            <Badge {...badgeProps}> <Building2Icon /> {locationRequirement}</Badge>
        </>
    )
}

export default JobListingBadges

export function formatJobStatus(status: JobListingStatus) {
    switch (status) {
        case "draft":
            return <><FilePenLine /> Draft</>
        case "published":
            return <><CircleCheckBigIcon />Active</>

        case "de-listed":
            return <><CircleOffIcon />InActive</>;
        default:
            throw new Error('Unknown Job Status')
    }
}