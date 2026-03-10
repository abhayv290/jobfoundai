'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ANY_VALUE, jobListingFilterSchemas } from '../actions/schemas'
import { Experience, experiences, jobListingType, JobListingType, LocationRequirement, locationRequirements } from '@/drizzle/schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import z from 'zod'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatJobType } from '../lib/formatter'
import { Button } from '@/components/ui/button'
import LoadingSwap from '@/components/LoadingSwap'
import { StateSelectionItems } from './JobListingForm'
import { useSidebar } from '@/components/ui/sidebar'


const JobListingFilterForm: FC = () => {
    const searchParams = useSearchParams()
    const router = useRouter();
    const path = usePathname();
    const { setOpenMobile } = useSidebar();

    const form = useForm({
        resolver: zodResolver(jobListingFilterSchemas),
        defaultValues: {
            title: searchParams.get('title') ?? '',
            city: searchParams.get('city') ?? '',
            state: searchParams.get('state') ?? '',
            experience: (searchParams.get('experience') as Experience) ?? ANY_VALUE,
            locationRequirements: (searchParams.get('locationRequirements') as LocationRequirement) ?? ANY_VALUE,
            type: (searchParams.get('type') as JobListingType) ?? ANY_VALUE
        }
    })
    const onSubmit = (data: z.infer<typeof jobListingFilterSchemas>) => {
        const newParams = new URLSearchParams();
        if (data.title) newParams.set('title', data.title)
        if (data.city) newParams.set('city', data.city)
        if (data.experience && data.experience !== ANY_VALUE) newParams.set('experience', data.experience)
        if (data.type && data.type !== ANY_VALUE) newParams.set('type', data.type)
        if (data.locationRequirements && data.locationRequirements !== ANY_VALUE) newParams.set('locationRequirements', data.locationRequirements)
        if (data.state && data.state !== ANY_VALUE) newParams.set('state', data.state)
        router.push(`${path}?${newParams.toString()}`)
        setOpenMobile(false)

    }

    const resetFilter = () => {
        form.reset();
        router.push(`${path}`)
        setOpenMobile(false)
    }
    return (
        <Form   {...form} >
            <form action="" onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField name='title' control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Job Title
                        </FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}>
                </FormField>
                <FormField name='locationRequirements' control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location Requirement</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}  >
                            <FormControl>
                                <SelectTrigger className='w-full capitalize'>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={ANY_VALUE} > Any </SelectItem>
                                {locationRequirements.map(lr => (
                                    <SelectItem key={lr} value={lr} className='capitalize'>
                                        {lr}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} >

                </FormField>
                <FormField name='experience' control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}  >
                            <FormControl>
                                <SelectTrigger className='w-full capitalize'>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={ANY_VALUE} > Any </SelectItem>
                                {experiences.map(ex => (
                                    <SelectItem key={ex} value={ex} className='capitalize'>
                                        {ex}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} >

                </FormField>
                <FormField name='type' control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}  >
                            <FormControl>
                                <SelectTrigger className='w-full'>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={ANY_VALUE} > Any </SelectItem>
                                {jobListingType.map(t => (
                                    <SelectItem key={t} value={t} >
                                        {formatJobType(t)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} >
                </FormField>
                <FormField name='city' control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            City
                        </FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}></FormField>
                <FormField name='type' control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>State </FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}  >
                            <FormControl>
                                <SelectTrigger className='w-full'>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={ANY_VALUE} > Any </SelectItem>
                                <StateSelectionItems />
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} >
                </FormField>
                <div className='flex gap-2 justify-between'>
                    <Button type='submit' disabled={form.formState.isSubmitting} className='w-[45%] cursor-pointer'>
                        <LoadingSwap isLoading={form.formState.isSubmitting}>
                            Filter
                        </LoadingSwap>
                    </Button>
                    <Button onClick={resetFilter} type='reset' disabled={form.formState.isSubmitting || !form.formState.isDirty} className='w-[45%] disabled:opacity-75'>
                        <LoadingSwap isLoading={form.formState.isSubmitting}>
                            Clear
                        </LoadingSwap>
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default JobListingFilterForm