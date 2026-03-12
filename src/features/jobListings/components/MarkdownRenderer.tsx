import { markdownClassNames } from '@/components/markdown/_MarkdownEditor'
import { cn } from '@/lib/utils'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm';

import { FC } from 'react'

const MarkdownRenderer: FC<MDXRemoteProps & { className?: string }> = ({ className, options, ...props }) => {
    return (
        <div className={cn(markdownClassNames, className, 'prose-invert')}>
            <MDXRemote  {...props} options={{
                mdxOptions: {
                    remarkPlugins: [remarkGfm, ...(options?.mdxOptions?.remarkPlugins ?? [])],
                    ...options?.mdxOptions,
                }
            }} />

        </div>
    )
}
export default MarkdownRenderer