'use client'
import LoadingSwap from '@/components/LoadingSwap'
import { MarkdownEditor } from '@/components/markdown/MarkdownEditor'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createJobApplication } from '../db/actions'
import z from 'zod'
import { jobApplicationSchema } from '@/features/jobListings/actions/schemas'



const JobApplicationForm: FC<{ jobListingId: string }> = ({ jobListingId }) => {

    const form = useForm({
        resolver: zodResolver(jobApplicationSchema),
        defaultValues: {
            coverLetter: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof jobApplicationSchema>) => {
        console.log(data)
        const res = await createJobApplication(jobListingId, data)

        if (res.error) {
            toast.error(res.message)
        } else {
            toast.success(res.message)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                <FormField name='coverLetter' control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Cover Letter
                        </FormLabel>
                        <FormControl>
                            <MarkdownEditor  {...field} markdown={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
                    <LoadingSwap isLoading={form.formState.isSubmitting} >
                        Apply
                    </LoadingSwap>
                </Button>
            </form>
        </Form>
    )
}

export default JobApplicationForm