import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { FC, ReactNode } from 'react'

const LoadingSwap: FC<{ isLoading: boolean, children: ReactNode, className?: string }> = ({ isLoading, children, className }) => {
    return (
        <div className='grid items-center justify-items-center'>
            <div className={cn('col-start-1  col col-end-1 row-start-1  row-end-1', isLoading ? 'invisible' : 'visible', className)}>
                {children}
            </div>
            <div className={cn('col-start-1  cole-end-1  row-start-1 row-end-1', isLoading ? 'visible' : 'invisible', className)}>
                <Loader2Icon className='animate-spin' />
            </div>

        </div>
    )
}

export default LoadingSwap