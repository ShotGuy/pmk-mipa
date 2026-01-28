"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Kegiatan = {
    id: string
    nama: string
    tanggal: Date
    lokasi: string | null
    waktu: Date | null
    pembicara: string | null
    jenisKegiatan: { nama: string }
}

export const columns: ColumnDef<Kegiatan>[] = [
    {
        accessorKey: "nama",
        header: "Nama Kegiatan",
    },
    {
        accessorKey: "jenisKegiatan.nama",
        id: "jenis",
        header: "Jenis",
    },
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggal"))
            return <div>{date.toLocaleDateString('id-ID')}</div>
        },
    },
    {
        accessorKey: "lokasi",
        header: "Lokasi",
    },
    {
        accessorKey: "pembicara",
        header: "Pembicara",
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
