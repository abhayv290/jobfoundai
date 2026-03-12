'use client'

import LoadingSwap from "@/components/LoadingSwap"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { getJobListingAiSearchResults } from "@/features/jobListings/actions/actions"
import { jobListingAiSearchSchema } from "@/features/jobListings/actions/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function JobListingAiSearchForm() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(jobListingAiSearchSchema),
        defaultValues: {
            query: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof jobListingAiSearchSchema>) => {
        const res = await getJobListingAiSearchResults(data)
        if (res.error) {
            toast.error(res.message)
            return;
        }
        const searchParams = new URLSearchParams()
        res.jobIds.forEach(ids => searchParams.append('jobIds', ids))
        router.push(`/?${searchParams.toString()}`)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" >
                <FormField name="query" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Search Query</FormLabel>
                        <FormControl>
                            <Textarea {...field} className="min-h-32" />
                        </FormControl>
                        <FormDescription>Describe the type of job you&apos;re looking for. Be specific about roles, skills, experience level, or any other preferences.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                    <LoadingSwap isLoading={form.formState.isSubmitting}>
                        Search
                    </LoadingSwap>
                </Button>
            </form>
        </Form>
    )
}
