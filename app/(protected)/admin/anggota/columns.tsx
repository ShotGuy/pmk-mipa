"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Anggota = {
    id: string
    nama: string
    jenisKelamin: string
    tanggalLahir: Date
    noHp: string | null
    prodi: string | null
    createdAt: Date
    updatedAt: Date
}

export const columns: ColumnDef<Anggota>[] = [
    {
        accessorKey: "nama",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "jenisKelamin",
        header: "L/P",
    },
    {
        accessorKey: "prodi",
        header: "Prodi",
    },
    {
        accessorKey: "noHp",
        header: "No HP",
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
