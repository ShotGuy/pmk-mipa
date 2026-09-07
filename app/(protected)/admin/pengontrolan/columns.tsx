"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, FileText, Pencil, Trash, CheckCircle2, AlertCircle, Clock, GitMerge } from "lucide-react"
import { StatusPengontrolan } from "@prisma/client"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface PengontrolanWithRelations {
    id: string
    tanggal: Date
    bahan: string | null
    status: StatusPengontrolan
    keterangan: string | null
    createdAt: Date
    ktb: {
        id: string
        nama: string
        angkatan: number
        status: string
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
    }
}

export const columns: ColumnDef<PengontrolanWithRelations>[] = [
    {
        accessorKey: "tanggal",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-3"
            >
                Tanggal
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.tanggal)
            return (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-xs sm:text-sm">
                        {format(date, "dd MMM yyyy", { locale: localeId })}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                        {format(date, "EEEE", { locale: localeId })}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "ktb.nama",
        id: "ktb",
        header: "Kelompok KTB",
        cell: ({ row }) => {
            const ktb = row.original.ktb
            return (
                <div className="flex flex-col">
                    <Link
                        href={`/admin/ktb/${ktb.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                    >
                        {ktb.nama}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">
                        PKTB: {ktb.pemimpin.nama} • Angkatan {ktb.angkatan}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "ktb.pengurus.anggota.nama",
        id: "pengurus",
        header: "Pengurus Pendamping",
        cell: ({ row }) => {
            const pengurus = row.original.ktb.pengurus
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground text-xs sm:text-sm">
                        {pengurus.anggota.nama}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                        {pengurus.jabatan.replace(/_/g, " ").toLowerCase()}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Kondisi Kelompok",
        cell: ({ row }) => {
            const status = row.original.status
            switch (status) {
                case StatusPengontrolan.AKTIF:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1 text-xs"
                        >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>AKTIF</span>
                        </Badge>
                    )
                case StatusPengontrolan.MACET:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 gap-1 text-xs"
                        >
                            <AlertCircle className="w-3 h-3" />
                            <span>MACET</span>
                        </Badge>
                    )
                case StatusPengontrolan.VAKUM:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 gap-1 text-xs"
                        >
                            <Clock className="w-3 h-3" />
                            <span>VAKUM</span>
                        </Badge>
                    )
                case StatusPengontrolan.MERGER:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 gap-1 text-xs"
                        >
                            <GitMerge className="w-3 h-3" />
                            <span>MERGER</span>
                        </Badge>
                    )
                default:
                    return <Badge variant="secondary">{status}</Badge>
            }
        },
    },
    {
        accessorKey: "bahan",
        header: "Bahan yang Dibahas",
        cell: ({ row }) => {
            const bahan = row.original.bahan
            return bahan ? (
                <span className="text-xs sm:text-sm font-medium text-foreground max-w-[200px] truncate block" title={bahan}>
                    {bahan}
                </span>
            ) : (
                <span className="text-xs text-muted-foreground italic">Tidak dicatat</span>
            )
        },
    },
    {
        accessorKey: "keterangan",
        header: "Catatan Monitoring",
        cell: ({ row }) => {
            const ket = row.original.keterangan
            if (!ket) {
                return <span className="text-xs text-muted-foreground italic">-</span>
            }

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <FileText className="w-3.5 h-3.5 text-primary" />
                            <span className="max-w-[140px] truncate">{ket}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="left" className="max-w-sm p-4 shadow-lg">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-primary" />
                                <span>Catatan Pengontrolan:</span>
                            </h4>
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {ket}
                            </p>
                        </div>
                    </PopoverContent>
                </Popover>
            )
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: () => null, // Overridden in PengontrolanClient
    },
]
