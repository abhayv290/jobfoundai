'use client'
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { cn } from "@/lib/utils";
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    headingsPlugin,
    InsertTable,
    InsertThematicBreak,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    MDXEditorMethods,
    MDXEditorProps,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin
} from "@mdxeditor/editor";
import { Ref } from "react";

import '@mdxeditor/editor/style.css'

export const markdownClassNames = "max-w-none prose prose-neutral  font-sans"

export default function InternalMarkdownEditor({
    ref,
    className,
    ...props
}: MDXEditorProps & { ref?: Ref<MDXEditorMethods> }) {
    const isDarkMode = useIsDarkMode();
    return (
        <MDXEditor
            ref={ref}
            {...props}
            className={cn(markdownClassNames, isDarkMode && "dark-theme prose-invert", className)}
            suppressHtmlProcessing
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <div className="flex flex-wrap gap-1 items-center dark-theme">
                            <BlockTypeSelect />
                            <span className="w-px h-6 bg-border mx-1" />
                            <BoldItalicUnderlineToggles />
                            <ListsToggle />
                            <InsertThematicBreak />
                            <InsertTable />
                        </div>
                    )
                })
            ]}
        />
    )
}