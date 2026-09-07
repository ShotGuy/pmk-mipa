"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Check, X, BookOpen, ScrollText } from "lucide-react"

export type HpdtWithRelation = {
    id: string
    tanggal: Date | string
    isSate: boolean
    isDoa: boolean
    isAttendedKTB: boolean
    isGereja: boolean
    ayatAlkitab: string | null
    judulBuku: string | null
    idPengurus: string
    pengurus: {
        id: string
        jabatan: string
        prodi?: string | null
        anggota: {
            id: string
            nama: string
            prodi?: string | null
            angkatan?: number | null
        }
    }
}

export const StatusIndicator = ({ value, label }: { value: boolean; label?: string }) => {
    return value ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Check className="w-3.5 h-3.5" />
            {label || "Ya"}
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <X className="w-3.5 h-3.5" />
            {label || "Tidak"}
        </span>
    )
}

export const columns: ColumnDef<HpdtWithRelation>[] = [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => {
            const date = new Date(row.original.tanggal)
            return (
                <div className="font-medium whitespace-nowrap">
                    {date.toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    })}
                </div>
            )
        },
    },
    {
        id: "pengurus",
        accessorFn: (row) => row.pengurus?.anggota?.nama || "",
        header: "Nama Pengurus",
        cell: ({ row }) => {
            const p = row.original.pengurus
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{p?.anggota?.nama || "Unknown"}</span>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {p?.jabatan ? p.jabatan.replace(/_/g, " ") : "PENGURUS"}
                        </Badge>
                        {p?.prodi || p?.anggota?.prodi ? (
                            <span>• {p?.prodi || p?.anggota?.prodi}</span>
                        ) : null}
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "isSate",
        header: "Saat Teduh",
        cell: ({ row }) => <StatusIndicator value={row.original.isSate} />
    },
    {
        accessorKey: "isDoa",
        header: "Doa Malam",
        cell: ({ row }) => <StatusIndicator value={row.original.isDoa} />
    },
    {
        accessorKey: "isAttendedKTB",
        header: "KTB",
        cell: ({ row }) => <StatusIndicator value={row.original.isAttendedKTB} />
    },
    {
        accessorKey: "isGereja",
        header: "Gereja",
        cell: ({ row }) => <StatusIndicator value={row.original.isGereja} />
    },
    {
        id: "catatan",
        header: "Bacaan & Refleksi",
        cell: ({ row }) => {
            const { ayatAlkitab, judulBuku } = row.original
            if (!ayatAlkitab && !judulBuku) {
                return <span className="text-xs text-muted-foreground italic">-</span>
            }
            return (
                <div className="flex flex-col gap-1 max-w-[200px]">
                    {ayatAlkitab && (
                        <div className="text-xs flex items-center gap-1 truncate text-sky-700 dark:text-sky-400 font-medium" title={ayatAlkitab}>
                            <ScrollText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{ayatAlkitab}</span>
                        </div>
                    )}
                    {judulBuku && (
                        <div className="text-xs flex items-center gap-1 truncate text-amber-700 dark:text-amber-400 font-medium" title={judulBuku}>
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{judulBuku}</span>
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Aksi",
        cell: () => null,
    },
]
