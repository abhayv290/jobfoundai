import { FC } from 'react'
import { PricingTable as ClerkPricingTable } from '@clerk/nextjs'

const PricingTable: FC = () => {
    return (
        <ClerkPricingTable for='organization' newSubscriptionRedirectUrl='/employer/pricing' />
    )
}

export default PricingTable