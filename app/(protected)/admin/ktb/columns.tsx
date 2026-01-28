"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define shape including relation
export type KTB = {
    id: string
    angkatan: number
    terbentukDimana: string | null
    pemimpin: { nama: string } // Simplify for UI
    createdAt: Date
}

export const columns: ColumnDef<KTB>[] = [
    {
        accessorKey: "angkatan",
        header: ({ column }) => {
            // Sortable Angkatan
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Angkatan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "pemimpin.nama", // Dot notation for relation
        id: "pemimpin",
        header: "Pemimpin",
    },
    {
        accessorKey: "terbentukDimana",
        header: "Lokasi Terbentuk",
    },
    {
        id: "actions",
        header: "Actions",
        cell: () => {
            return (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]
