import { Column } from "@tanstack/react-table";
import { Key, ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { cn } from "@/lib/utils";



interface FacetedProps<TData, TValue, OValue> {
    column?: Column<TData, TValue>
    title?: string
    disabled?: boolean
    options: {
        label: ReactNode
        value: OValue
        key: Key
    }[]
}


export function DataTableFacetedFilter<TData, TValue, OValue>({ title, column, disabled, options }: FacetedProps<TData, TValue, OValue>) {
    const facets = column?.getFacetedUniqueValues()
    const selectedValues = new Set(column?.getFilterValue() as OValue[])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={disabled} variant={'outline'} size={'sm'} >
                    {selectedValues.size > 0 && (
                        <Badge className="" variant={'secondary'}>{selectedValues.size}</Badge>
                    )}
                    {title}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w56 p-0" align="start">
                <Command>
                    <CommandList>
                        <CommandEmpty>No Result Found</CommandEmpty>
                        <CommandGroup>
                            {options.map(op => {
                                const selected = selectedValues.has(op.value)
                                return <CommandItem key={op.key} onSelect={() => {
                                    if (selected) {
                                        selectedValues.delete(op.value)
                                    } else {
                                        selectedValues.add(op.value)
                                    }
                                    const flVals = [...selectedValues]
                                    column?.setFilterValue(flVals.length > 0 ? flVals : undefined)
                                }}>
                                    <div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm">
                                        <div
                                            className={cn(
                                                "flex size-4 items-center justify-center rounded-sm border transition-colors",
                                                selected
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : "border-input"
                                            )}
                                        >
                                            {selected && <CheckIcon className="size-3" />}
                                        </div>
                                        <span className="text-sm font-medium leading-none">
                                            {op.label}
                                        </span>
                                        {facets?.get(op.value) && (
                                            <span className="ml-auto flex size-4 items-center justify-center font-mono text-[10px] text-muted-foreground">
                                                {facets.get(op.value)}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => column?.setFilterValue(undefined)}
                                        className="justify-center text-center cursor-pointer font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>

            </PopoverContent>
        </Popover>
    )
}