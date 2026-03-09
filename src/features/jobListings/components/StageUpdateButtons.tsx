import AsyncIf from "@/components/AsyncIf";
import { Button } from "@/components/ui/button";
import { JobListingStatus } from "@/drizzle/schema";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { FC, ReactNode } from "react";
import { getNextJobListingStatus } from "../lib/utils";
import { hasReachedFeaturedJobListingLimit, hasReachJobListingLimit } from "@/services/clerk/lib/planFeaturesHelper";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EyeIcon, EyeOffIcon, StarIcon, StarOffIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import ActionButton from "./ActionButton";
import { deleteJobListing, toggleJobListingFeature, toggleJobListingStatus } from "../actions/actions";

export const StatusUpdateButton: FC<{ status: JobListingStatus, id: string }> = ({ status, id }) => {
    const button = <ActionButton action={toggleJobListingStatus.bind(null, id)} requireAreYouSure={getNextJobListingStatus(status) === 'published'} areYouSureDescription="This will immediately show user job listings to applicants"> {StatusToggleButtonText(status)} </ActionButton>
    return (

        <AsyncIf condition={() => hasOrgUserPermission('org:job_listing:job_listing_change_status')}>
            {getNextJobListingStatus(status) === 'published' ? (
                <AsyncIf condition={async () => {
                    const isMax = await hasReachJobListingLimit();
                    return !isMax
                }}
                    otherwise={
                        <UpgradePopoverButton buttonText={StatusToggleButtonText(status)} popoverText='Upgrade the Plan to Publish more job listings' />
                    }>
                    {button}
                </AsyncIf>
            ) : (button)}
        </AsyncIf>
    )
}


export const FeatureToggleButton: FC<{ isFeatured: boolean, id: string }> = ({ isFeatured, id }) => {
    const button = <ActionButton action={toggleJobListingFeature.bind(null, id)} variant={'outline'}>
        {FeatureToggleText(isFeatured)}
    </ActionButton>
    return (
        <AsyncIf condition={() => hasOrgUserPermission('org:job_listing:job_listing_change_status')}>
            {!isFeatured ? (
                <AsyncIf condition={async () => !(await hasReachedFeaturedJobListingLimit())} otherwise={
                    <UpgradePopoverButton buttonText={FeatureToggleText(isFeatured)} popoverText='Upgrade Your Plan To feature more Job Listings'>
                    </UpgradePopoverButton>
                } >
                    {button}
                </AsyncIf>
            ) : (
                button
            )}
        </AsyncIf>
    )
}

export const DeleteJobListingButton: FC<{ id: string }> = ({ id }) => {
    return (
        <AsyncIf condition={() => hasOrgUserPermission('org:job_listing:delete_job_listings')}>
            <ActionButton action={deleteJobListing.bind(null, id)} variant={'secondary'} requireAreYouSure={true}>
                <Trash2Icon className="size-4 text-red-500" />  Delete
            </ActionButton>
        </AsyncIf>
    )
}


function UpgradePopoverButton({ buttonText, popoverText }: { buttonText: ReactNode, popoverText: ReactNode }) {
    return (
        <Popover>
            <PopoverTrigger asChild >
                <Button variant={"outline"} className="cursor-pointer" >
                    {buttonText}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2">
                {popoverText}
                <Button asChild>
                    <Link href={'/employer/pricing'}> Upgrade Plan </Link>
                </Button>
            </PopoverContent>
        </Popover>
    )
}

function StatusToggleButtonText(status: JobListingStatus) {
    switch (status) {
        case "draft":
        case 'de-listed':
            return (
                <>
                    <EyeIcon className="size-4" />
                    Publish
                </>
            )
        case "published":
            return (
                <>
                    <EyeOffIcon className="size-4" />
                    Delist
                </>
            )
        default:
            throw new Error('Unknown status ')
    }
}



function FeatureToggleText(feature: boolean): ReactNode {
    if (feature) {
        return <><StarOffIcon />UnFeature</>
    }
    return <><StarIcon />Feature</>
}