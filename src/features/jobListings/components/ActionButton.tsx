'use client'
import LoadingSwap from '@/components/LoadingSwap';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button'
import { ComponentPropsWithRef, FC, useTransition } from 'react'
import { toast } from 'sonner';

interface Props extends Omit<ComponentPropsWithRef<typeof Button>, 'onClick'> {
    action: () => Promise<{ error: boolean, message?: string }>;
    requireAreYouSure?: boolean;
    areYouSureDescription?: string;
}

const ActionButton: FC<Props> = ({ action, requireAreYouSure = false, areYouSureDescription = 'This action cannot be undone', ...props }) => {
    const [isLoading, startTransition] = useTransition();
    const performAction = () => {
        startTransition(async () => {
            const data = await action();
            if (data.error) {
                toast.error(data.message ?? 'Some Error Occurred')
            }
        })
    }
    if (requireAreYouSure) {
        return (
            <AlertDialog open={isLoading ? true : undefined}>
                <AlertDialogTrigger asChild className='cursor-pointer'>
                    <Button variant={'outline'}  {...props} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are You Sure ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {areYouSureDescription}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer' variant={'outline'}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={isLoading} onClick={performAction} className='cursor-pointer' variant={'outline'}>
                            <LoadingSwap isLoading={isLoading} >
                                Yes
                            </LoadingSwap>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }
    return (
        <Button {...props} variant='outline' disabled={isLoading} onClick={performAction} className='cursor-pointer'>
            <LoadingSwap isLoading={isLoading} className='inline-flex gap-2 items-center'>
                {props.children}
            </LoadingSwap>
        </Button>
    )
}

export default ActionButton