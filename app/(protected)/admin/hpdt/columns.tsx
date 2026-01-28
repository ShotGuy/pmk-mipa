"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export type Hpdt = {
    id: string
    tanggal: Date
    isSate: boolean
    isDoa: boolean
    isAttendedKTB: boolean
    isGereja: boolean
    ayatAlkitab: string | null
    judulBuku: string | null
    anggota: { nama: string }
}

const BooleanCell = ({ value }: { value: boolean }) => (
    <div className="flex justify-center">
        {value ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-300" />}
    </div>
)

export const columns: ColumnDef<Hpdt>[] = [
    {
        accessorKey: "anggota.nama",
        id: "anggota",
        header: "Nama Anggota",
    },
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggal"))
            return <div>{date.toLocaleDateString('id-ID')}</div>
        },
    },
    {
        accessorKey: "isSate",
        header: "Sate",
        cell: ({ row }) => <BooleanCell value={row.original.isSate} />
    },
    {
        accessorKey: "isDoa",
        header: "Doa",
        cell: ({ row }) => <BooleanCell value={row.original.isDoa} />
    },
    {
        accessorKey: "isAttendedKTB",
        header: "KTB",
        cell: ({ row }) => <BooleanCell value={row.original.isAttendedKTB} />
    },
    {
        accessorKey: "isGereja",
        header: "Gereja",
        cell: ({ row }) => <BooleanCell value={row.original.isGereja} />
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
