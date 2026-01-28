"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Pengontrolan = {
    id: string
    tanggal: Date
    bahan: string | null
    status: string // Enum
    keterangan: string | null
    ktb: { id: string } // Maybe show Leader name of KTB?
}

export const columns: ColumnDef<Pengontrolan>[] = [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggal"))
            return <div>{date.toLocaleDateString('id-ID')}</div>
        },
    },
    {
        accessorKey: "bahan",
        header: "Bahan",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "keterangan",
        header: "Keterangan",
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
