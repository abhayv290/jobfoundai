'use client'
import { applicationStages, ApplicationStages, JobApplicationTable, UserResumeTable, UserTable } from "@/drizzle/schema"
import { ReactNode, useMemo, useOptimistic, useState, useTransition } from "react"
import { ColumnDef, Table } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/datatable/Datatable"
import { DataTableColumnHeader } from "@/components/datatable/DatatableSortable"
import { sortApplicationByStage } from "../lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react"
import { updateApplicationRating, updateApplicationStage } from "../db/actions"
import { toast } from "sonner"
import { StageIcons, RatingIcons } from "./StageIcons"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { DataTableFacetedFilter } from "@/components/datatable/DataTableFacetedFilter"

interface Application extends Pick<typeof JobApplicationTable.$inferSelect, |
    'createdAt' | 'rating' | 'jobListingId' | 'stage'> {
    coverLetterMarkdown: ReactNode | null
    user: Pick<typeof UserTable.$inferSelect, 'avatar' | 'name' | 'id'> & {
        resume: Pick<typeof UserResumeTable.$inferSelect, 'resumeFileUrl'> & { MarkdownResumeSummary: ReactNode | null } | null
    }
}


function getColumns(canUpdateRating: boolean, canUpdateStage: boolean): ColumnDef<Application>[] {
    return [
        {
            accessorFn: row => row.user.name, header: 'Name', cell: ({ row }) => {
                const user = row.original.user
                const nameInitials = user.name.split(' ').slice(0, 2).map(n => n.charAt(0).toUpperCase()).join('')
                return (
                    <div className='flex items-center gap-2' >
                        <Avatar className='rounded-full size-7'>
                            <AvatarImage src={user.avatar} alt='avatar' />
                            <AvatarFallback className='uppercase bg-primary text-primary-foreground text-xs' >
                                {nameInitials}
                            </AvatarFallback>
                        </Avatar>
                        <span className='text-base font-medium'>{user.name}</span>
                    </div>
                )
            }
        }
        , {
            accessorKey: 'stage',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Stage" />
            ),
            sortingFn: ({ original: a }, { original: b }) => {
                return sortApplicationByStage(a.stage, b.stage)
            },
            filterFn: ({ original }, _, val) => {
                return val.includes(original.stage)
            },
            cell: ({ row }) => (
                <StageCell canUpdate={canUpdateStage} stage={row.original.stage} jobListingId={row.original.jobListingId} userId={row.original.user.id} />
            )
        },
        {
            accessorKey: 'rating',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Rating' />,
            filterFn: ({ original }, _, val) => {
                return val.includes(original.rating)
            },
            cell: ({ row }) => (
                <RatingCell canUpdate={canUpdateRating} rating={row.original.rating} jobListingId={row.original.jobListingId} userId={row.original.user.id} />
            )
        },
        {
            accessorKey: 'createdAt',
            accessorFn: row => row.createdAt,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Applied On' />
            ),
            cell: ({ row }) => (
                <span>{row.original.createdAt.toLocaleDateString()}</span>
            )
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const jobListing = row.original
                const resume = row.original.user.resume
                return <ActionCell coverLetterMarkdown={jobListing.coverLetterMarkdown} resumeMarkdown={resume?.MarkdownResumeSummary} resumeFileUrl={resume?.resumeFileUrl} userName={row.original.user.name} />
            }
        }
    ]
}


export default function ApplicationTable({ applications, canUpdateRating, canUpdateStage, disableToolbar = false }: {
    applications: Application[],
    canUpdateRating: boolean,
    canUpdateStage: boolean,
    disableToolbar?: boolean
}) {
    const columns = useMemo(
        () => getColumns(canUpdateRating, canUpdateStage),
        [canUpdateRating, canUpdateStage]
    )
    return (
        <DataTable columns={columns} data={applications} noResultsMessage={'No Results Found'} ToolbarComponent={disableToolbar ? DisabledToolbar : Toolbar} initialFilter={[
            { id: 'stage', value: applicationStages.filter(a => a !== 'denied') },
            { id: 'rating', value: [1, 2, 3, 4, 5] }
        ]} />
    )
}

function DisabledToolbar<T>({ table, disabled = true }: {
    table: Table<T>,
    disabled?: boolean
}) {
    return null
}

function Toolbar<T>({ table, disabled = false }: {
    table: Table<T>,
    disabled?: boolean
}) {
    const hiddenRows = table.getCoreRowModel().rows.length - table.getRowCount()

    return (
        <div className="flex items-center gap-2">
            {table.getColumn('stage') && (
                <DataTableFacetedFilter key={JSON.stringify(table.getState().columnFilters)} title="Stage" column={table.getColumn('stage')} disabled={false} options={applicationStages.toSorted(sortApplicationByStage).map(ap => ({
                    label: <StageDetails stage={ap} />,
                    key: ap,
                    value: ap,
                }))} />

            )}
            {table.getColumn('rating') && (
                <DataTableFacetedFilter key={'rating'} title="Rating" column={table.getColumn('rating')} disabled={false} options={[1, 2, 3, 4, 5].map(ap => ({
                    label: <RatingIcons rating={ap} />,
                    key: ap,
                    value: ap,
                }))} />
            )}

            {hiddenRows > 0 && (
                <div className="text-sm text-muted-foreground ml-2">
                    {hiddenRows} {hiddenRows > 1 ? 'rows' : 'row'} hidden
                </div>
            )}
        </div>
    )
}



function StageCell({ stage, jobListingId, userId, canUpdate }: {
    stage: ApplicationStages,
    jobListingId: string,
    userId: string,
    canUpdate: boolean
}) {
    const [optimisticStage, setOptimisticStage] = useOptimistic(
        stage,
        (_, newStage: ApplicationStages) => newStage
    )
    const [isPending, startTransition] = useTransition()

    if (!canUpdate) {
        return <StageDetails stage={stage} />
    }

    const handleStageChange = (newStage: ApplicationStages) => {
        if (newStage === stage) return

        startTransition(async () => {
            setOptimisticStage(newStage)
            try {
                const res = await updateApplicationStage(userId, jobListingId, newStage)
                if (res?.error) {
                    toast.error(res.message || "Failed to update stage")
                } else {
                    toast.success(res.message || "Stage updated")
                }
            } catch {
                toast.error("A network error occurred")
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isPending}>
                <Button
                    variant='ghost'
                    className={cn('-ml-3 transition-opacity', isPending && 'opacity-50')}
                >
                    <StageDetails stage={optimisticStage} />
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {applicationStages.toSorted(sortApplicationByStage).map(s => (
                    <DropdownMenuItem
                        key={s}
                        onClick={() => handleStageChange(s)}
                        className={cn(s === optimisticStage && "bg-accent")}
                    >
                        <StageDetails stage={s} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
function StageDetails({ stage }: { stage: ApplicationStages }) {
    return (
        <div className='flex gap-2 items-center text-inherit'>
            <StageIcons stage={stage} />
            <div className='capitalize '>  {stage} </div>
        </div>
    )
}

function RatingCell({ rating, jobListingId, userId, canUpdate }: {
    rating: number | null,
    jobListingId: string,
    userId: string,
    canUpdate: boolean
}) {
    const [optimisticRating, setOptimisticRating] = useOptimistic(
        rating,
        (_, newRating: number | null) => newRating
    )
    const [isPending, startTransition] = useTransition()

    if (!canUpdate) {
        return <RatingIcons rating={optimisticRating} className="text-inherit" />
    }

    const handleRatingUpdate = (newRating: number) => {
        startTransition(async () => {
            setOptimisticRating(newRating)
            try {
                const res = await updateApplicationRating(userId, jobListingId, newRating)
                if (res?.error) {
                    toast.error(res.message || "Failed to update rating")
                } else {
                    toast.success('Rating updated')
                }
            } catch {
                toast.error("An unexpected error occurred")
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isPending}>
                <Button variant='ghost' className={cn('-ml-3 transition-all', isPending && 'opacity-50')}>
                    <RatingIcons rating={optimisticRating} className="text-inherit" />
                    <ChevronDownIcon className="ml-1 h-3 w-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {[1, 2, 3, 4, 5].map((val) => (
                    <DropdownMenuItem
                        key={val}
                        onClick={() => handleRatingUpdate(val)}
                        className={cn(val === optimisticRating && "bg-accent")}
                    >
                        <RatingIcons rating={val} className="text-inherit" />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}



function ActionCell({ coverLetterMarkdown, resumeFileUrl, userName, resumeMarkdown }: {
    coverLetterMarkdown: ReactNode | null,
    resumeMarkdown: ReactNode | null,
    userName: string,
    resumeFileUrl: string | null | undefined
}) {
    const [openModel, setOpenModel] = useState<'resume' | 'coverLetter' | null>(null)
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} size={'icon'}>
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontalIcon size={5} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {(resumeFileUrl || resumeMarkdown) ? (
                        <DropdownMenuItem onClick={() => setOpenModel('resume')}>
                            View Resume
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuLabel className='text-muted-foreground'>
                            No Resume found
                        </DropdownMenuLabel>
                    )}
                    {coverLetterMarkdown && (
                        <DropdownMenuItem onClick={() => setOpenModel('coverLetter')}>
                            View CoverLetter
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {coverLetterMarkdown && (
                <Dialog open={openModel === 'coverLetter'} onOpenChange={o => setOpenModel(o ? 'coverLetter' : null)} >
                    <DialogContent className="lg:max-w-5xl md:max-w-3xl max-h-[99%] overflow-hidden flex flex-col" >
                        <DialogHeader>
                            <DialogTitle>CoverLetter</DialogTitle>
                            <DialogDescription>{userName}</DialogDescription>
                        </DialogHeader>
                        <div className="overflow-y-auto flex-1">{coverLetterMarkdown}</div>
                    </DialogContent>
                </Dialog>
            )}
            {(resumeFileUrl && resumeMarkdown) && (
                <Dialog open={openModel === 'resume'} onOpenChange={o => setOpenModel(o ? 'resume' : null)} >
                    <DialogContent className="lg:max-w-5xl md:max-w-3xl max-h-[99%] overflow-hidden flex flex-col" >
                        <DialogHeader>
                            <DialogTitle>Resume Ai Summary</DialogTitle>
                            <DialogDescription>{userName}</DialogDescription>
                            <Button asChild className="w-32">
                                <Link href={resumeFileUrl} target="_blank" rel="noopener noreferrer">View Resume File</Link>
                            </Button>
                        </DialogHeader>
                        <Separator />
                        <div className="overflow-y-auto flex-1">{resumeMarkdown}</div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

































































































































