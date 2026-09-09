"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Pencil, Trash } from "lucide-react"

import { DataTable } from "@/components/admin/DataTable"
import { columns, BadanPengurusWithRelation } from "@/app/(protected)/admin/badan-pengurus/columns"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteBadanPengurus } from "@/actions/badan-pengurus"
import { JABATAN_LABELS } from "./BadanPengurusForm"

interface BadanPengurusClientProps {
    data: BadanPengurusWithRelation[]
    periodeOptions: { label: string; value: string }[]
    isReadOnly?: boolean
}

export function BadanPengurusClient({ data, periodeOptions, isReadOnly = false }: BadanPengurusClientProps) {
    const router = useRouter()
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const facetedFilters = [
        {
            key: "status",
            title: "Status",
            options: [
                { label: "Aktif", value: "true" },
                { label: "Demisioner", value: "false" },
            ]
        },
        {
            key: "jabatan",
            title: "Jabatan",
            options: Object.entries(JABATAN_LABELS).map(([key, label]) => ({
                label,
                value: key
            }))
        },
        ...(periodeOptions.length > 0 ? [{
            key: "masaJabatan",
            title: "Periode",
            options: periodeOptions
        }] : [])
    ]

    const handleDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            const res = await deleteBadanPengurus(deleteId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan pada server saat menghapus data")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    // Enhance columns with functional Edit & Delete handlers
    const clientColumns = isReadOnly
        ? columns.filter(col => col.id !== "actions")
        : columns.map(col => {
            if (col.id === "actions") {
                return {
                    ...col,
                    cell: ({ row }: { row: { original: BadanPengurusWithRelation } }) => (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => router.push(`/admin/badan-pengurus/${row.original.id}`)}
                                title="Edit"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeleteId(row.original.id)}
                                title="Hapus"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                }
            }
            return col
        })

    return (
        <>
            <DataTable
                columns={clientColumns}
                data={data}
                searchKey="anggota"
                facetedFilters={facetedFilters}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Badan Pengurus?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data pengurus ini akan dihapus dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
