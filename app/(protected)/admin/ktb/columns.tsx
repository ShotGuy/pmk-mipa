"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Users } from "lucide-react"
import { StatusKTB } from "@prisma/client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface KTBWithRelations {
    id: string
    nama: string
    angkatan: number
    terbentukDimana: string | null
    status: StatusKTB
    createdAt: Date
    pemimpin: {
        id: string
        nama: string
        prodi: string | null
        angkatan: number | null
    }
    pengurus: {
        id: string
        jabatan: string
        anggota: {
            nama: string
        }
    }
    anggotaKTB: {
        id: string
        isAktif: boolean
        createdAt: Date
        anggota: {
            id: string
            nama: string
            prodi: string | null
            angkatan: number | null
        }
    }[]
}

export const columns: ColumnDef<KTBWithRelations>[] = [
    {
        accessorKey: "nama",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-3"
            >
                Nama Kelompok
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const ktb = row.original
            return (
                <div className="flex flex-col">
                    <Link
                        href={`/admin/ktb/${ktb.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                        <span>{ktb.nama}</span>
                    </Link>
                    <span className="text-[11px] text-muted-foreground">
                        {ktb.terbentukDimana ? `Momen: ${ktb.terbentukDimana}` : "Tempat terbentuk: -"}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "angkatan",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Angkatan
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium text-center sm:text-left">
                {row.original.angkatan}
            </div>
        ),
    },
    {
        accessorKey: "pemimpin.nama",
        id: "pemimpin",
        header: "Pemimpin (PKTB)",
        cell: ({ row }) => {
            const p = row.original.pemimpin
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{p.nama}</span>
                    <span className="text-[11px] text-muted-foreground">
                        {p.prodi || "-"} {p.angkatan ? `'${String(p.angkatan).slice(-2)}` : ""}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "pengurus.anggota.nama",
        id: "pengurus",
        header: "Badan Pengurus Pendamping",
        cell: ({ row }) => {
            const bp = row.original.pengurus
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{bp.anggota.nama}</span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                        {bp.jabatan.replace(/_/g, " ").toLowerCase()}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return status === StatusKTB.AKTIF ? (
                <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                    AKTIF
                </Badge>
            ) : (
                <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 inline-block" />
                    MERGER
                </Badge>
            )
        },
    },
    {
        id: "anggotas",
        header: "Anggota Dinaungi",
        cell: ({ row }) => {
            const allMembers = row.original.anggotaKTB || []
            const activeMembers = allMembers.filter((m) => m.isAktif)
            const pastMembers = allMembers.filter((m) => !m.isAktif)

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary/10 transition-colors gap-1.5 text-xs py-1"
                        >
                            <Users className="w-3.5 h-3.5 text-primary" />
                            <span>
                                {activeMembers.length} Aktif
                                {pastMembers.length > 0 && ` (${pastMembers.length} Riwayat)`}
                            </span>
                        </Badge>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="max-w-xs p-3 shadow-md">
                        <p className="font-semibold text-xs mb-1.5 text-foreground">
                            Anggota KTB {row.original.nama}:
                        </p>
                        {activeMembers.length === 0 ? (
                            <p className="text-[11px] text-muted-foreground">Belum ada anggota aktif.</p>
                        ) : (
                            <ul className="text-[11px] list-disc list-inside space-y-0.5 text-muted-foreground">
                                {activeMembers.slice(0, 5).map((m) => (
                                    <li key={m.id} className="text-foreground">
                                        {m.anggota.nama}
                                    </li>
                                ))}
                                {activeMembers.length > 5 && (
                                    <li className="text-muted-foreground italic">
                                        +{activeMembers.length - 5} lainnya...
                                    </li>
                                )}
                            </ul>
                        )}
                        <div className="mt-2 pt-2 border-t text-right">
                            <Link
                                href={`/admin/ktb/${row.original.id}`}
                                className="text-[11px] text-primary hover:underline font-medium"
                            >
                                Kelola Anggota &rarr;
                            </Link>
                        </div>
                    </PopoverContent>
                </Popover>
            )
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: () => null, // Will be overridden in KTBClient with router & delete handler
    },
]
