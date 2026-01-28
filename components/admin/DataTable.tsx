"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Filter } from "lucide-react"

export type FacetedFilterConfig = {
    key: string
    title: string
    options: { label: string; value: string }[]
}

export type RangeFilterConfig = {
    key: string
    title: string
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    facetedFilters?: FacetedFilterConfig[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey = "name",
    facetedFilters,
    rangeFilters
}: DataTableProps<TData, TValue> & { rangeFilters?: RangeFilterConfig[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})



    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center py-4 gap-4">
                <div className="relative max-w-sm w-full">
                    {/* Add Search Icon if available, input element already has padding */}
                    <Input
                        placeholder={`Cari berdasarkan ${searchKey}...`}
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm pl-8" // Add padding for icon
                    />
                    {/* Position absolute icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>

                <div className="flex flex-wrap gap-2">
                    {facetedFilters?.map((filter) => (
                        <Select
                            key={filter.key}
                            value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? "all"}
                            onValueChange={(value) => {
                                table.getColumn(filter.key)?.setFilterValue(value === "all" ? undefined : value)
                            }}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder={`Filter ${filter.title}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua {filter.title}</SelectItem>
                                {filter.options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2">
                    {rangeFilters?.map((filter) => {
                        const column = table.getColumn(filter.key)
                        const filterValue = column?.getFilterValue() as [number, number] | undefined

                        return (
                            <Popover key={filter.key}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="border-dashed">
                                        <Filter className="mr-2 h-4 w-4" />
                                        {filter.title}
                                        {filterValue?.[0] ? ` >= ${filterValue[0]}` : ""}
                                        {filterValue?.[1] ? ` <= ${filterValue[1]}` : ""}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Filter {filter.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Masukkan rentang nilai untuk filter.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid gap-2">
                                                <label htmlFor="min" className="text-sm font-medium">Min</label>
                                                <Input
                                                    id="min"
                                                    type="number"
                                                    placeholder="Dari"
                                                    value={(filterValue as [number, number])?.[0] ?? ""}
                                                    onChange={(e) =>
                                                        column?.setFilterValue((old: [number, number] | undefined) => [
                                                            e.target.value ? Number(e.target.value) : undefined,
                                                            old?.[1],
                                                        ])
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <label htmlFor="max" className="text-sm font-medium">Max</label>
                                                <Input
                                                    id="max"
                                                    type="number"
                                                    placeholder="Sampai"
                                                    value={(filterValue as [number, number])?.[1] ?? ""}
                                                    onChange={(e) =>
                                                        column?.setFilterValue((old: [number, number] | undefined) => [
                                                            old?.[0],
                                                            e.target.value ? Number(e.target.value) : undefined,
                                                        ])
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    })}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
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
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground flex items-center gap-4">
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
