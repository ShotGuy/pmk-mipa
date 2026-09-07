"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Mic } from "lucide-react"

export type KegiatanWithRelation = {
    id: string
    nama: string
    tanggal: Date | string
    lokasi: string | null
    waktu: Date | string | null
    pembicara: string | null
    idJenisKegiatan: string
    jenisKegiatan: {
        id: string
        nama: string
    }
}

// Format waktu helper (from Date/string to HH:mm)
function formatTime(waktu: Date | string | null): string | null {
    if (!waktu) return null
    const d = new Date(waktu)
    if (isNaN(d.getTime())) return null
    const hours = String(d.getUTCHours()).padStart(2, "0")
    const minutes = String(d.getUTCMinutes()).padStart(2, "0")
    return `${hours}:${minutes}`
}

export const columns: ColumnDef<KegiatanWithRelation>[] = [
    {
        accessorKey: "nama",
        header: "Nama Kegiatan",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-sm">
                        {row.original.nama}
                    </span>
                    {row.original.pembicara && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mic className="w-3 h-3 text-primary/70" />
                            <span>{row.original.pembicara}</span>
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        id: "jenis",
        accessorFn: (row) => row.jenisKegiatan?.nama || "",
        header: "Jenis Kegiatan",
        cell: ({ row }) => {
            const namaJenis = row.original.jenisKegiatan?.nama || "Umum"
            return (
                <Badge variant="secondary" className="font-medium text-xs">
                    {namaJenis}
                </Badge>
            )
        },
    },
    {
        accessorKey: "tanggal",
        header: "Jadwal Pelaksanaan",
        cell: ({ row }) => {
            const date = new Date(row.original.tanggal)
            const formattedDate = date.toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            const formattedTime = formatTime(row.original.waktu)

            return (
                <div className="flex flex-col gap-0.5 text-xs">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                        <Calendar className="w-3.5 h-3.5 text-primary/80" />
                        <span>{formattedDate}</span>
                    </div>
                    {formattedTime && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formattedTime} WITA</span>
                        </div>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "lokasi",
        header: "Lokasi",
        cell: ({ row }) => {
            const lokasi = row.original.lokasi
            if (!lokasi) return <span className="text-xs text-muted-foreground italic">-</span>
            return (
                <div className="flex items-center gap-1 text-xs text-muted-foreground max-w-[200px] truncate" title={lokasi}>
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{lokasi}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: () => null, // Will be overridden in client component
    },
]
