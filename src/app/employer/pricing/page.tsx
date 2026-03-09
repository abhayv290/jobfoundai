
import PricingTable from '@/services/clerk/components/PricingTable'
import { FC } from 'react'

const PricingPage: FC = () => {
    return (
        <section className='container flex items-center justify-center  min-h-full p-4'>
            <PricingTable />
        </section>
    )
}

export default PricingPage
