"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    PaginationState,
    useReactTable,
    getFacetedUniqueValues,
    ColumnFiltersState,
    Table as TableType
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,

} from "@/components/ui/table"

import { ComponentType, ReactNode, useState } from "react"
import { DataTablePagination } from "./DatatablePagination"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    initialFilter?: ColumnFiltersState
    noResultsMessage?: ReactNode
    ToolbarComponent?: ComponentType<{ table: TableType<TData> }>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    initialFilter,
    noResultsMessage = 'No Results..',
    ToolbarComponent
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialFilter ?? []);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            columnFilters
        },

        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })
    return (
        <div className="space-y-2 w-full">
            {ToolbarComponent && <ToolbarComponent table={table} key={JSON.stringify(columnFilters)} />}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getPaginationRowModel().rows.length ? (
                            table.getPaginationRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {noResultsMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </div>
            <DataTablePagination table={table} key={`${pagination.pageIndex}-${pagination.pageSize}`} />
        </div>
    )
}