"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react"

export type TransaksiWithKas = {
    id: string
    jenisTransaksi: "PEMASUKAN" | "PENGELUARAN"
    nominal: number
    keterangan: string | null
    idKas: string
    kas: {
        id?: string
        nama: string
    }
    createdAt: Date | string
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export const columns: ColumnDef<TransaksiWithKas>[] = [
    {
        accessorKey: "createdAt",
        header: "Tanggal",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            const formatted = date.toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            return (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{formatted}</span>
                </div>
            )
        },
    },
    {
        id: "kas",
        accessorFn: (row) => row.kas?.nama || "",
        header: "Akun Kas",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm">
                        {row.original.kas?.nama || "Kas Umum"}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "jenisTransaksi",
        header: "Jenis",
        cell: ({ row }) => {
            const jenis = row.original.jenisTransaksi
            const isPemasukan = jenis === "PEMASUKAN"

            return (
                <Badge
                    variant={isPemasukan ? "default" : "destructive"}
                    className={`font-semibold text-xs px-2.5 py-0.5 gap-1 ${
                        isPemasukan
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    }`}
                >
                    {isPemasukan ? (
                        <>
                            <TrendingUp className="w-3 h-3" />
                            <span>Pemasukan</span>
                        </>
                    ) : (
                        <>
                            <TrendingDown className="w-3 h-3" />
                            <span>Pengeluaran</span>
                        </>
                    )}
                </Badge>
            )
        },
    },
    {
        accessorKey: "nominal",
        header: "Nominal",
        cell: ({ row }) => {
            const isPemasukan = row.original.jenisTransaksi === "PEMASUKAN"
            const amount = row.original.nominal

            return (
                <div
                    className={`font-bold font-mono text-sm sm:text-base ${
                        isPemasukan
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                    }`}
                >
                    {isPemasukan ? "+" : "-"} {formatRupiah(amount)}
                </div>
            )
        },
    },
    {
        accessorKey: "keterangan",
        header: "Keterangan",
        cell: ({ row }) => {
            const ket = row.original.keterangan
            if (!ket) return <span className="text-xs text-muted-foreground italic">-</span>
            return (
                <span className="text-xs sm:text-sm text-foreground max-w-[280px] line-clamp-1" title={ket}>
                    {ket}
                </span>
            )
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: () => null, // Overridden in client component
    },
]
