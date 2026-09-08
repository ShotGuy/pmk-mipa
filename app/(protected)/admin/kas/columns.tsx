"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Wallet, TrendingUp, TrendingDown } from "lucide-react"

export type KasWithBalance = {
    id: string
    nama: string
    saldoAwal: number
    totalPemasukan: number
    totalPengeluaran: number
    saldoTerkini: number
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export const columns: ColumnDef<KasWithBalance>[] = [
    {
        accessorKey: "nama",
        header: "Nama Akun Kas",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                        <Wallet className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">
                        {row.original.nama}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "saldoAwal",
        header: "Saldo Awal",
        cell: ({ row }) => {
            return (
                <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                    {formatRupiah(row.original.saldoAwal)}
                </span>
            )
        },
    },
    {
        accessorKey: "totalPemasukan",
        header: "Total Masuk (+)",
        cell: ({ row }) => {
            const amount = row.original.totalPemasukan
            return (
                <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span>{formatRupiah(amount)}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "totalPengeluaran",
        header: "Total Keluar (-)",
        cell: ({ row }) => {
            const amount = row.original.totalPengeluaran
            return (
                <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400">
                    <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                    <span>{formatRupiah(amount)}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "saldoTerkini",
        header: "Saldo Terkini",
        cell: ({ row }) => {
            const amount = row.original.saldoTerkini
            const isNegative = amount < 0
            return (
                <div
                    className={`font-bold text-sm sm:text-base ${
                        isNegative
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-foreground"
                    }`}
                >
                    {formatRupiah(amount)}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: () => null, // Overridden in client component
    },
]
