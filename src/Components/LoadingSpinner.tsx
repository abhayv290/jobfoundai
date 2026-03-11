import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { ComponentProps, FC } from 'react'



const LoadingSpinner: FC<ComponentProps<typeof Loader2Icon>> = ({ className, ...props }) => {
    return (
        <div className='w-full h-full flex items-center justify-center '>
            <Loader2Icon className={cn('animate-spin size-16', className)} {...props} />
        </div>
    )
}

export default LoadingSpinner