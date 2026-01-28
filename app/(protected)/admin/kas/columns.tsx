"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Kas = {
    id: string
    nama: string
    saldo: any // Decimal
}

export const columns: ColumnDef<Kas>[] = [
    {
        accessorKey: "nama",
        header: "Nama Akun Kas",
    },
    {
        accessorKey: "saldo",
        header: "Saldo Saat Ini",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("saldo"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(amount)
            return <div className="font-bold">{formatted}</div>
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
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
