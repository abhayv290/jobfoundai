'use client'
import { FC, ReactNode, useEffect, useState } from 'react'

interface Props {
    children: ReactNode
    breakpoint: string
    otherwise: ReactNode
}
const IsBreakPoint: FC<Props> = ({ children, breakpoint, otherwise }) => {
    const isBreakPoint = useIsBreakPoint(breakpoint);
    return isBreakPoint ? children : otherwise
}

export default IsBreakPoint


function useIsBreakPoint(breakpoint: string) {
    const [isBreakPoint, setIsBreakPoint] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const media = window.matchMedia(`(${breakpoint})`)
        media.addEventListener('change', e => {
            setIsBreakPoint(e.matches)
        }, { signal: controller.signal })

        Promise.resolve().then(() => {
            setIsBreakPoint(media.matches)
        })
        return () => controller.abort()
    }, [breakpoint])

    return isBreakPoint;
}