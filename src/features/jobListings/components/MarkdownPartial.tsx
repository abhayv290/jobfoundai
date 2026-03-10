'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface PartialProps {
    mainMarkdown: ReactNode;
    dialogMarkdown: ReactNode;
    dialogTitle: string;

}
const MarkdownPartial: FC<PartialProps> = ({ mainMarkdown, dialogMarkdown, dialogTitle }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const markdownRef = useRef<HTMLDivElement>(null);

    const checkOverflow = (node: HTMLDivElement) => {
        setIsOverflowing(node.scrollHeight > node.clientHeight);
    }
    useEffect(() => {
        const controller = new AbortController()
        window.addEventListener('resize', () => {
            if (markdownRef.current == null) return
            checkOverflow(markdownRef.current)
        }, { signal: controller.signal })
        return () => controller.abort();
    }, []);

    useLayoutEffect(() => {
        if (markdownRef.current == null) return
        checkOverflow(markdownRef.current)
    }, [])
    return (
        <>
            <div ref={markdownRef} className='max-h-100 overflow-hidden relative' >
                {mainMarkdown}
                {isOverflowing && (
                    <div className='bg-linear-to-t from-background to-transparent to-50% inset-0 absolute  pointer-event-none' />

                )}
            </div>
            {isOverflowing && (
                <Dialog >
                    <DialogTrigger asChild>
                        <Button variant={'ghost'} className='underline -ml-3'>Read More</Button>
                    </DialogTrigger>
                    <DialogContent className='md:max-w-3xl lg:max-w-4xl max-h-[98%] overflow-hidden flex flex-col'>
                        <DialogHeader>
                            <DialogTitle aria-describedby={dialogTitle}>
                                {dialogTitle}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {dialogMarkdown}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default MarkdownPartial