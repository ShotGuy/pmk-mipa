"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { DataTable } from "@/components/admin/DataTable"
import { KasForm } from "./KasForm"
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
import { deleteKas } from "@/actions/kas"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Kas = {
    id: string
    nama: string
    saldo: number // Received as number from Page component
}

interface KasClientProps {
    data: Kas[]
}

export function KasClient({ data }: KasClientProps) {
    const [open, setOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Kas | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [alertOpen, setAlertOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deleteKas(deleteId)
            if (res.success) {
                toast.success(res.message, { description: "Data kas telah dihapus permanen." })
                setAlertOpen(false)
            } else {
                toast.error("Gagal Menghapus", { description: res.message })
            }
        } catch {
            toast.error("Terjadi Kesalahan", { description: "Gagal menghapus data dari server." })
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const columns: ColumnDef<Kas>[] = [
        {
            accessorKey: "nama",
            header: "Nama Kas",
        },
        {
            accessorKey: "saldo",
            header: "Saldo",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("saldo"))
                const formatted = new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                }).format(amount)
                return <div className="font-medium">{formatted}</div>
            },
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
                title="Manajemen Kas"
                addLabel="Tambah Kas"
                onAdd={() => {
                    setSelectedItem(null)
                    setOpen(true)
                }}
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="nama"
            />

            {/* Create / Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? "Edit Data Kas" : "Tambah Kas Baru"}</DialogTitle>
                        <DialogDescription>
                            {selectedItem ? "Ubah detail kas." : "Buat akun kas penyimpanan baru."}
                        </DialogDescription>
                    </DialogHeader>
                    {/* Key forces remount when item changes to reset form default values */}
                    <KasForm
                        key={selectedItem?.id || "new"}
                        initialData={selectedItem}
                        onSuccess={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Jika kas ini memiliki riwayat transaksi, penghapusan mungkin akan gagal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
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
