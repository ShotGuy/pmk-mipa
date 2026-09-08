"use client"

import { ColumnDef } from "@tanstack/react-table"
import { StatusKehadiran } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Trash, MessageCircle, Info, Sparkles, UserCheck } from "lucide-react"

export interface KehadiranWithRelations {
    id: string
    nama: string
    status: StatusKehadiran
    prodi: string | null
    angkatan: number | null
    noHp: string | null
    jenisKelamin: string | null
    tauPmkDariMana: string | null
    idAnggota: string | null
    createdAt: Date
    anggota?: {
        id: string
        nama: string
        prodi: string | null
        angkatan: number | null
        noHp: string | null
    } | null
    kegiatan?: {
        id: string
        nama: string
        tanggal: Date
    }
}

interface ColumnProps {
    onDelete: (id: string, nama: string) => void
}

export const getColumns = ({ onDelete }: ColumnProps): ColumnDef<KehadiranWithRelations>[] => [
    {
        accessorKey: "createdAt",
        header: "Waktu Absen",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            const timeStr = date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })
            const dateStr = date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            return (
                <div className="flex flex-col">
                    <span className="font-mono font-medium text-xs text-foreground">{timeStr} WIB</span>
                    <span className="text-[11px] text-muted-foreground">{dateStr}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "nama",
        header: "Nama & Kategori",
        cell: ({ row }) => {
            const isAnggota = Boolean(row.original.idAnggota)
            const status = row.original.status

            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-foreground">{row.original.nama}</span>
                        {row.original.jenisKelamin && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                                ({row.original.jenisKelamin})
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {status === "APMK" && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px] px-1.5 py-0 font-normal">
                                <UserCheck className="w-2.5 h-2.5 mr-1" />
                                APMK
                            </Badge>
                        )}
                        {status === "AKTB" && (
                            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-[10px] px-1.5 py-0 font-normal">
                                <UserCheck className="w-2.5 h-2.5 mr-1" />
                                AKTB
                            </Badge>
                        )}
                        {status === "NON_APMK" && (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-[10px] px-1.5 py-0 font-normal">
                                <Sparkles className="w-2.5 h-2.5 mr-1" />
                                Pengunjung / Tamu
                            </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                            • {isAnggota ? "Anggota Resmi" : "Tamu Luar"}
                        </span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "prodi",
        header: "Prodi & Angkatan",
        cell: ({ row }) => {
            const prodi = row.original.prodi || "-"
            const angkatan = row.original.angkatan

            return (
                <div className="text-xs">
                    <div className="font-medium text-foreground">{prodi}</div>
                    {angkatan && (
                        <div className="text-[11px] text-muted-foreground">Angkatan {angkatan}</div>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "noHp",
        header: "Kontak WA",
        cell: ({ row }) => {
            const noHp = row.original.noHp

            if (!noHp) {
                return <span className="text-xs text-muted-foreground">-</span>
            }

            // Clean number for wa.me link
            let cleanPhone = noHp.replace(/\D/g, "")
            if (cleanPhone.startsWith("0")) {
                cleanPhone = "62" + cleanPhone.slice(1)
            }

            return (
                <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-mono"
                >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{noHp}</span>
                </a>
            )
        },
    },
    {
        accessorKey: "tauPmkDariMana",
        header: "Info Tamu",
        cell: ({ row }) => {
            const info = row.original.tauPmkDariMana

            if (!info) {
                return <span className="text-xs text-muted-foreground">-</span>
            }

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                        >
                            <Info className="w-3.5 h-3.5" />
                            <span className="max-w-[120px] truncate">{info}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3 text-xs" align="start">
                        <div className="font-semibold mb-1 text-foreground">Tau Info PMK Dari:</div>
                        <p className="text-muted-foreground leading-relaxed">{info}</p>
                    </PopoverContent>
                </Popover>
            )
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(row.original.id, row.original.nama)}
                        title="Hapus rekaman presensi"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]
