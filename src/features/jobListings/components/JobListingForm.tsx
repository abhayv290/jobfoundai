'use client'

import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { jobListingSchemas } from '../actions/schemas';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import z from 'zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { experiences, JobListingTable, jobListingType, locationRequirements, wageIntervals } from '@/drizzle/schema';
import { formatJobType, formatWageIntervals } from '../lib/formatter';
import { MarkdownEditor } from '@/components/markdown/MarkdownEditor';
import { Button } from '@/components/ui/button';
import LoadingSwap from '@/components/LoadingSwap';
import { createJobListing, updateJobListing } from '../actions/actions';
import { toast } from 'sonner';
interface Props {
    jobListing?: Pick<typeof JobListingTable.$inferSelect, 'id' | 'title' | 'description' | 'city' | 'stateAbbreviation' | 'experienceLevel' | 'locationRequirement' | 'wage' | 'wageInterval' | 'type'>
}
const JobListingForm: FC<Props> = ({ jobListing }) => {
    const form = useForm<z.infer<typeof jobListingSchemas>>({
        resolver: zodResolver(jobListingSchemas),
        defaultValues: jobListing ?? {
            title: '',
            description: '',
            city: '',
            stateAbbreviation: '',
            wage: null,
            wageInterval: 'yearly',
            type: 'full-time',
            experienceLevel: 'junior',
            locationRequirement: 'office'
        }
    });

    const onSubmit = async (data: z.infer<typeof jobListingSchemas>) => {
        const action = jobListing ? updateJobListing.bind(null, jobListing.id) : createJobListing;
        const res = await action(data)
        if (res.error) {
            toast.error(res.message)
        } else {
            toast.success('Job Listing Created,Redirecting...')
        }
    };
    const NON_SELECT_VALUE = 'none';
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6 container'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-start'>
                    <FormField name='title' control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                                <Input placeholder='Software Engineer' type='text'  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {/* Wage & wage Intervals */}
                    <div>
                        <div className='flex items-end w-full'>
                            <FormField name='wage' control={form.control} render={({ field }) => (
                                <FormItem className='w-full' >
                                    <FormLabel>Compensation:₹</FormLabel>
                                    <FormControl>
                                        <Input type='number' {...field} value={field.value ?? ''}
                                            onChange={e => field.onChange(isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber)}
                                            className='rounded-r-none' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name='wageInterval' control={form.control} render={({ field }) => (
                                <FormItem>
                                    <Select value={field.value ?? ''} onValueChange={field.onChange} >
                                        <FormControl>
                                            <SelectTrigger className='rounded-l-none w-full min-w-32'
                                            >
                                                /<SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {wageIntervals.map(item => (
                                                <SelectItem key={item} value={item}>{formatWageIntervals(item)} </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormDescription className='mt-1'>Optional</FormDescription>
                    </div>
                </div>
                {/* City & States & Location Requirements */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                    <FormField name='city' control={form.control} render={({ field }) => (
                        <FormItem className=''>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder='Noida' type='text' {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name='stateAbbreviation' control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select value={field.value ?? ''} onValueChange={
                                val => field.onChange(val === 'NON_SELECT_VALUE' ? null : val)
                            } >
                                <FormControl>
                                    <SelectTrigger className='w-full truncate'>
                                        /<SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent >
                                    {field.value && <SelectItem value={NON_SELECT_VALUE} className='text-muted-foreground'>Clear</SelectItem>}
                                    <StateSelectionItems />
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name='locationRequirement' control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location Requirement</FormLabel>
                            <Select value={field.value ?? ''} onValueChange={field.onChange} >
                                <FormControl>
                                    <SelectTrigger className='capitalize w-full' >
                                        /<SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {locationRequirements.map(item => (
                                        <SelectItem key={item} value={item} className='capitalize'>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Experience Level & JobListingType  */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <FormField name='experienceLevel' control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <Select value={field.value ?? ''} onValueChange={field.onChange} >
                                <FormControl>
                                    <SelectTrigger className='capitalize w-full' >
                                        /<SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {experiences.map(item => (
                                        <SelectItem key={item} value={item} className='capitalize'>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name='type' control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Type</FormLabel>
                            <Select value={field.value ?? ''} onValueChange={field.onChange} >
                                <FormControl>
                                    <SelectTrigger className='capitalize w-full' >
                                        /<SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {jobListingType.map(item => (
                                        <SelectItem key={item} value={item} className='capitalize'>
                                            {formatJobType(item)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                {/* Job Description  - Markdown Editor  */}
                <FormField name='description' control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                            <MarkdownEditor {...field} markdown={field.value} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button disabled={form.formState.isSubmitting} type='submit' className='w-full cursor-pointer mt-5'>
                    <LoadingSwap isLoading={form.formState.isSubmitting} >
                        Post This Job
                    </LoadingSwap>
                </Button>

            </form>
        </Form >
    );
};

export default JobListingForm;
import states from '@/data/states.json'



function StateSelectionItems() {
    return Object.entries(states).map(([abbreviation, name]) => (
        <SelectItem key={abbreviation} value={abbreviation} >
            {name}
        </SelectItem>
    ))
}


