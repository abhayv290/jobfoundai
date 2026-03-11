'use client'
import { Sheet } from '@/components/ui/sheet'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, PropsWithChildren, useState } from 'react'

const ClientSheet: FC<PropsWithChildren> = ({ children }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(true)

    return <Sheet open={isOpen} onOpenChange={open => {
        if (open) return
        setIsOpen(false)
        router.push(`/?${searchParams.toString()}`)
    }} modal>
        {children}
    </Sheet>
}

export default ClientSheet