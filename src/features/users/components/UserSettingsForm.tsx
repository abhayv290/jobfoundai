'use client'
import LoadingSwap from "@/components/LoadingSwap"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { UserSettingsTable } from "@/drizzle/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { saveUserNotificationSettings } from "../db/userSettings"
import { toast } from "sonner"
import { notificationSchema } from "@/features/jobListings/actions/schemas"
import { MailCheckIcon, SparklesIcon } from "lucide-react"


export default function UserNotificationForm({
    notifications }: { notifications: Pick<typeof UserSettingsTable.$inferInsert, 'aiPrompt' | 'newJobEmailNotification'> }
) {
    const form = useForm({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            aiPrompt: notifications.aiPrompt ?? '',
            newJobEmailNotification: notifications.newJobEmailNotification ?? false
        }
    })

    const onSubmit = async (data: z.infer<typeof notificationSchema>) => {
        const res = await saveUserNotificationSettings(data)
        if (res.error) {
            toast.error(res.message)
            return;
        }
        toast.success(res.message);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField name='newJobEmailNotification' control={form.control} render={({ field }) => (
                    <FormItem className="flex justify-between items-center  shadow-sm p-5 shadow-gray-700 rounded-xl">
                        <div className="space-y-3">
                            <FormLabel className="text-xl font-bold flex items-center gap-2"><MailCheckIcon /> Daily Email Notifications</FormLabel>
                            <FormDescription className="text-muted-foreground">Receive an email notifications about the interest jobs </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="scale-150 cursor-pointer"
                            />
                        </FormControl>
                    </FormItem>

                )} />
                {(form.formState.isDirty || notifications.newJobEmailNotification) && (
                    <FormField name="aiPrompt" control={form.control} render={({ field }) => (
                        <FormItem className="py-5 border-t rounded-xl space-y-1">
                            <FormLabel className="text-xl font-bold flex items-center gap-2" > <SparklesIcon
                                strokeWidth={1.5}
                                className=''
                            /> Ai Prompt</FormLabel>
                            <FormDescription>Our Ai will use this prompt to filter jobs and send you email notifications that matches your interests</FormDescription>
                            <FormControl>
                                <Textarea {...field} value={field.value ?? ''} className="min-h-32" placeholder="Describe the jobs you&apos;re looking for.example:I am interested in Remote Fullstack development role with the tech stack next or react + express and pays at least 40k INR per month" />
                            </FormControl>
                            <FormDescription>You can leave blank to receive all kind of jobs notifications</FormDescription>
                        </FormItem>
                    )} />
                )}
                <Button className="w-full" disabled={form.formState.isSubmitting} >
                    <LoadingSwap isLoading={form.formState.isSubmitting} >Update Settings</LoadingSwap>
                </Button>
            </form>
        </Form>
    )
}