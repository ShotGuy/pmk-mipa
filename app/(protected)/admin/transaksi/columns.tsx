"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Transaksi = {
    id: string
    jenisTransaksi: string
    nominal: any
    keterangan: string | null
    kas: { nama: string }
    createdAt: Date
}

export const columns: ColumnDef<Transaksi>[] = [
    {
        accessorKey: "createdAt",
        header: "Tanggal",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div>{date.toLocaleDateString('id-ID')}</div>
        },
    },
    {
        accessorKey: "jenisTransaksi",
        header: "Jenis",
        cell: ({ row }) => {
            const jenis = row.getValue("jenisTransaksi") as string
            return (
                <div className={jenis === 'PEMASUKAN' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {jenis}
                </div>
            )
        }
    },
    {
        accessorKey: "nominal",
        header: "Nominal",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("nominal"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(amount)
            return <div className="font-mono">{formatted}</div>
        },
    },
    {
        accessorKey: "keterangan",
        header: "Keterangan",
    },
    {
        accessorKey: "kas.nama",
        id: "kas",
        header: "Akun Kas",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
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
