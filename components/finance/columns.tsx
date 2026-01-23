"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaksi } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Transaksi>[] = [
    {
        accessorKey: "date", // We will likely map 'createdAt' to this or use accessorFn
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tanggal
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        accessorFn: (row) => row.createdAt,
        cell: ({ getValue }) => {
            const date = getValue<Date>()
            return new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }).format(new Date(date))
        }
    },
    {
        accessorKey: "jenisTransaksi",
        header: "Jenis",
        cell: ({ row }) => {
            const type = row.getValue("jenisTransaksi") as string
            return (
                <span className={type === "PEMASUKAN" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {type}
                </span>
            )
        }
    },
    {
        accessorKey: "keterangan",
        header: "Keterangan",
    },
    {
        accessorKey: "nominal",
        header: () => <div className="text-right">Nominal</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("nominal"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
]
