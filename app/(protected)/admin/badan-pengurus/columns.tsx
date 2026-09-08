"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Jabatan } from "@prisma/client"
import { JABATAN_LABELS } from "@/components/admin/badan-pengurus/BadanPengurusForm"

export type BadanPengurusWithRelation = {
    id: string
    jabatan: Jabatan
    masaJabatan: string
    status: boolean
    prodi: string | null
    socialMedia: string | null
    anggota: {
        id: string
        nama: string
        prodi: string | null
        angkatan: number | null
    }
}

export const columns: ColumnDef<BadanPengurusWithRelation>[] = [
    {
        accessorKey: "anggota.nama",
        id: "anggota",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-4"
            >
                Nama Pengurus
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-foreground">{row.original.anggota?.nama}</span>
                <span className="text-xs text-muted-foreground">
                    {row.original.anggota?.angkatan ? `Angkatan ${row.original.anggota.angkatan}` : ""}
                    {row.original.prodi ? ` • ${row.original.prodi}` : ""}
                </span>
            </div>
        )
    },
    {
        accessorKey: "jabatan",
        header: "Jabatan",
        cell: ({ row }) => {
            const jabatan = row.original.jabatan
            const label = JABATAN_LABELS[jabatan] || jabatan
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {label}
                </span>
            )
        }
    },
    {
        accessorKey: "masaJabatan",
        header: "Periode",
        cell: ({ row }) => <span className="font-medium text-sm">{row.original.masaJabatan}</span>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const isAktif = row.original.status
            return (
                <Badge variant={isAktif ? "default" : "secondary"}>
                    {isAktif ? "Aktif" : "Demisioner"}
                </Badge>
            )
        }
    },
    {
        accessorKey: "socialMedia",
        header: "Sosial Media",
        cell: ({ row }) => {
            const sosmed = row.original.socialMedia
            if (!sosmed) return <span className="text-muted-foreground text-xs">-</span>
            return (
                <span className="text-xs font-mono text-muted-foreground truncate max-w-[150px] inline-block">
                    {sosmed}
                </span>
            )
        }
    },
    {
        id: "actions",
        header: "Aksi",
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
