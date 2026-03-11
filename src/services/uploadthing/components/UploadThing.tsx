'use client'
import { ComponentProps } from "react";
import { type CustomFileRouter } from "../router";
import { generateUploadDropzone } from '@uploadthing/react'
import { cn } from "@/lib/utils";
import { toast } from "sonner";



export const UploadDropzoneComponent = generateUploadDropzone<CustomFileRouter>();



export function UploadDropzone({ className, onClientUploadComplete, onUploadError, ...props }: ComponentProps<typeof UploadDropzoneComponent>) {
    return <UploadDropzoneComponent {...props}
        className={cn('border-dashed border-2 border-purple-700/20 rounded-xl  flex items-center justify-center', className)}
        onClientUploadComplete={res => {
            res.forEach(({ serverData }) => {
                toast.success(serverData.message)
            })
            onClientUploadComplete?.(res)
        }}
        onUploadError={err => {
            toast.error(err.message)
            onUploadError?.(err)
        }}
    />
}