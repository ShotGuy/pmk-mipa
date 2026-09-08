"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Pencil, Trash } from "lucide-react"

import { DataTable } from "@/components/admin/DataTable"
import { columns, KegiatanWithRelation } from "@/app/(protected)/admin/kegiatan/columns"
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
import { deleteKegiatan } from "@/actions/kegiatan"

interface KegiatanClientProps {
    data: KegiatanWithRelation[]
    jenisOptions: { label: string; value: string }[]
}

export function KegiatanClient({ data, jenisOptions }: KegiatanClientProps) {
    const router = useRouter()
    const [deleteId, setDeleteId] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    const facetedFilters = [
        ...(jenisOptions.length > 0
            ? [
                  {
                      key: "jenis",
                      title: "Jenis Kegiatan",
                      options: jenisOptions,
                  },
              ]
            : []),
    ]

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deleteKegiatan(deleteId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan pada server saat menghapus kegiatan")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    // Enhance columns with functional Edit & Delete handlers
    const clientColumns = React.useMemo(() => {
        return columns.map((col) => {
            if (col.id === "actions") {
                return {
                    ...col,
                    cell: ({ row }: { row: { original: KegiatanWithRelation } }) => (
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                onClick={() => router.push(`/admin/kegiatan/${row.original.id}`)}
                                title="Edit Kegiatan"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => setDeleteId(row.original.id)}
                                title="Hapus Kegiatan"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ),
                }
            }
            return col
        })
    }, [router])

    return (
        <>
            <DataTable
                columns={clientColumns}
                data={data}
                searchKey="nama"
                facetedFilters={facetedFilters}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data kegiatan ini akan dihapus permanen dari sistem.
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
