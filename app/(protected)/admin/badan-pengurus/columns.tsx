"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type BadanPengurus = {
    id: string
    masaJabatan: string
    status: boolean
    prodi: string | null
    anggota: { nama: string }
}

export const columns: ColumnDef<BadanPengurus>[] = [
    {
        accessorKey: "anggota.nama",
        id: "anggota",
        header: "Nama",
    },
    {
        accessorKey: "prodi",
        header: "Prodi",
    },
    {
        accessorKey: "masaJabatan",
        header: "Periode",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className={row.original.status ? "text-green-600" : "text-gray-500"}>
                {row.original.status ? "Aktif" : "Non-Aktif"}
            </div>
        )
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
