"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Kehadiran = {
    id: string
    nama: string
    status: string // Enum
    prodi: string | null
    angkatan: number | null
    kegiatan: { nama: string }
    createdAt: Date
}

export const columns: ColumnDef<Kehadiran>[] = [
    {
        accessorKey: "nama",
        header: "Nama",
    },
    {
        accessorKey: "kegiatan.nama",
        id: "kegiatan",
        header: "Kegiatan",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <div className="font-mono text-xs">{row.original.status}</div>
    },
    {
        accessorKey: "prodi",
        header: "Prodi",
    },
    {
        accessorKey: "angkatan",
        header: "Angkatan",
    },
    {
        accessorKey: "createdAt",
        header: "Waktu Absen",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div>{date.toLocaleString('id-ID')}</div> // Show time too
        },
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
