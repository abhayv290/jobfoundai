/* eslint-disable react-hooks/incompatible-library */
'use client'

import { OrgsUserSettings } from "@/drizzle/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { orgUserSettingSchema } from "../actions/schemas"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ANY_VALUE } from "@/features/jobListings/actions/schemas"
import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { saveOrgUserSettingPreferences } from "../actions/actions"
import LoadingSwap from "@/components/LoadingSwap"
import z from "zod"



export default function OrgUserSettingsForm({ settings }: { settings: Pick<typeof OrgsUserSettings.$inferSelect, 'minimumRating' | 'newApplicationEmailNotifications'> }) {
    const form = useForm({
        resolver: zodResolver(orgUserSettingSchema),
        defaultValues: {
            minimumRating: settings.minimumRating ?? null,
            newApplicationEmailNotifications: settings.newApplicationEmailNotifications ?? false
        }
    })
    const onSubmit = async (data: z.infer<typeof orgUserSettingSchema>) => {
        const res = await saveOrgUserSettingPreferences(data)
        if (res.error) {
            toast.error(res.message)
            return
        }
        toast.success(res.message)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField name="newApplicationEmailNotifications" control={form.control} render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-5 shadow-sm shadow-gray-700/50 rounded-xl">
                        <div className='space-y-2'>
                            <FormLabel className="text-xl font-bold" >New Application Email Notifications</FormLabel>
                            <FormDescription className='text-slate-200/70'> Get Notified when a new Applicant Apply  to your job Listing </FormDescription>
                        </div>
                        <FormControl>
                            <Switch onCheckedChange={field.onChange} checked={field.value} className="scale-125" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                {form.watch('newApplicationEmailNotifications') && (
                    <FormField
                        name="minimumRating"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xl font-bold">Minimum Ratings</FormLabel>
                                <Select
                                    value={field.value?.toString() ?? ANY_VALUE}
                                    onValueChange={(val) => field.onChange(val === ANY_VALUE ? null : Number(val))}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-44">
                                            <SelectValue>
                                                {field.value ? (
                                                    <div className="flex items-center gap-1">
                                                        <RatingIcons rating={field.value} className="text-inherit" />
                                                    </div>
                                                ) : (
                                                    "Any Rating"
                                                )}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        <SelectItem value={ANY_VALUE}>Any Rating</SelectItem>
                                        {Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) => (
                                            <SelectItem key={i} value={(i + 1).toString()}>
                                                <RatingIcons rating={i + 1} />
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Only receive notifications for candidates that meets or exceed this rating.
                                    3-5 star candidates are likely a good fit.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <Button disabled={form.formState.isSubmitting} type="submit" className="w-full" >
                    <LoadingSwap isLoading={form.formState.isSubmitting} >
                        Update Preferences
                    </LoadingSwap>
                </Button>
            </form>
        </Form>
    )
}


function RatingIcons({ rating, className }: { rating: number | null, className?: string }) {
    if (!rating || rating < 1 || rating > 5) {
        return <span className="text-muted-foreground text-sm">Unrated</span>;
    }
    return (
        Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={cn(className, 'text-xl', rating > i ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
        ))
    )
}