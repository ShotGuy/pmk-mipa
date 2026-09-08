"use client"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table } from "@tanstack/react-table"

interface AdminToolbarProps<TData> {
    table: Table<TData>
    searchKey: string
    filterOptions?: { label: string; value: string }[] // For column selection?
}

export function AdminToolbar<TData>({
    table,
    searchKey,
    filterOptions
}: AdminToolbarProps<TData>) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Cari..."
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {filterOptions && (
                    <Select
                    // Logic to change searchKey or add secondary filter?
                    // For now, let's just show the dropdown as requested "Filter yang berupa dropdown"
                    // Maybe this selects WHICH column to search?
                    // Or acts as a faceted filter for a specific column?
                    // "Filter ini merupakan seluruh atribut yang ada di sebuah entitas"
                    >
                        <SelectTrigger className="h-8 w-[150px]">
                            <SelectValue placeholder="Filter..." />
                        </SelectTrigger>
                        <SelectContent>
                            {filterOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    )
}
