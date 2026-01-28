"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { DataTable } from "@/components/admin/DataTable"
import { columns, JenisKegiatan } from "@/app/(protected)/admin/jenis-kegiatan/columns"
import { JenisForm } from "./JenisForm"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
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
import { deleteJenisKegiatan } from "@/actions/jenis-kegiatan"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JenisKegiatanClientProps {
    data: JenisKegiatan[]
}

export function JenisKegiatanClient({ data }: JenisKegiatanClientProps) {
    const [open, setOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<JenisKegiatan | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [alertOpen, setAlertOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deleteJenisKegiatan(deleteId)
            if (res.success) {
                toast.success(res.message, { description: "Jenis kegiatan telah dihapus permanen." })
                setAlertOpen(false)
            } else {
                toast.error("Gagal Menghapus", { description: res.message })
            }
        } catch (error) {
            toast.error("Terjadi Kesalahan", { description: "Gagal menghapus data dari server." })
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const clientColumns: ColumnDef<JenisKegiatan>[] = [
        {
            accessorKey: "nama",
            header: "Nama Jenis",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                            onClick={() => {
                                setSelectedItem(row.original)
                                setOpen(true)
                            }}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => {
                                setDeleteId(row.original.id)
                                setAlertOpen(true)
                            }}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Master Jenis Kegiatan"
                addLabel="Tambah Jenis"
                onAdd={() => {
                    setSelectedItem(null)
                    setOpen(true)
                }}
            />

            <DataTable
                columns={clientColumns}
                data={data}
                searchKey="nama"
            />

            {/* Create / Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? "Edit Jenis Kegiatan" : "Tambah Jenis Kegiatan"}</DialogTitle>
                        <DialogDescription>
                            {selectedItem ? "Ubah detail jenis kegiatan." : "Buat kategori baru untuk kegiatan."}
                        </DialogDescription>
                    </DialogHeader>
                    {/* Key forces remount when item changes to reset form default values */}
                    <JenisForm
                        key={selectedItem?.id || "new"}
                        initialData={selectedItem}
                        onSuccess={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data yang dihapus akan hilang dari database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault() // Prevent modal closing handled by auto-events
                                handleDelete()
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
