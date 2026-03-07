import { Badge } from '@/components/ui/badge';
import { JobListingTable } from '@/drizzle/schema'
import { cn } from '@/lib/utils'
import { ComponentProps, FC } from 'react'
import { formatJobListingLocation, formatJobStatus, formatJobType, formatWage } from '../lib/formatter';
import { BanknoteIcon, Building2Icon, HourglassIcon, MapPinIcon } from 'lucide-react';

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
            {!isFeatured && (
                <Badge {...badgeProps} className='bg-linear-to-l from-purple-700  to-indigo-700'>Featured</Badge>
            )}
            {/* Wage & WageInterval  */}
            {wage && wageInterval && <Badge {...badgeProps}><BanknoteIcon />{formatWage(wage, wageInterval)}</Badge>}

            {/* City & stateAbbreviation  */}
            {(city || stateAbbreviation) && <Badge {...badgeProps}><MapPinIcon /> {formatJobListingLocation(city, stateAbbreviation)}  </Badge>}

            {/* JobType  */}
            <Badge  {...badgeProps}> <HourglassIcon />   {formatJobType(type)}</Badge>

            {/* Experience Level  */}
            {/* <Badge {...badgeProps} className='capitalize'> {experienceLevel}</Badge> */}

            {/* LocationRequirements  */}
            <Badge {...badgeProps} className='capitalize'> <Building2Icon /> {locationRequirement}</Badge>
        </>
    )
}

export default JobListingBadges