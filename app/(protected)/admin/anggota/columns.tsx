"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Anggota = {
    id: string
    nama: string
    jenisKelamin: string
    tanggalLahir: Date | null
    noHp: string | null
    prodi: string | null
    angkatan: number | null
    idKTB: string | null
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
        accessorKey: "angkatan",
        filterFn: "inNumberRange",
        header: ({ column }) => {
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
        cell: ({ row }) => <div className="ml-4">{row.original.angkatan || "-"}</div>,
    },
    {
        id: "umur",
        accessorFn: (row) => {
            if (!row.tanggalLahir) return null
            const diff = Date.now() - new Date(row.tanggalLahir).getTime()
            const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
            return age
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Umur
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="ml-4">{row.getValue("umur") || "-"}</div>,
        filterFn: "inNumberRange",
    },
    {
        accessorKey: "noHp",
        header: "No HP",
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
