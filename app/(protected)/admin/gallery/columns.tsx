"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Gallery = {
    id: string
    photos: string // URL
    isPublish: boolean
    kegiatan: { nama: string }
}

export const columns: ColumnDef<Gallery>[] = [
    {
        accessorKey: "photos",
        header: "Preview",
        cell: ({ row }) => (
            <div className="w-20 h-12 relative overflow-hidden rounded bg-gray-100">
                <img
                    src={row.original.photos}
                    alt="Gallery"
                    className="object-cover w-full h-full"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/100?text=No+Image')}
                />
            </div>
        )
    },
    {
        accessorKey: "kegiatan.nama",
        id: "kegiatan",
        header: "Kegiatan",
    },
    {
        accessorKey: "isPublish",
        header: "Published",
        cell: ({ row }) => (
            <div className={row.original.isPublish ? "text-green-600 font-medium" : "text-gray-400"}>
                {row.original.isPublish ? "Yes" : "Draft"}
            </div>
        )
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
