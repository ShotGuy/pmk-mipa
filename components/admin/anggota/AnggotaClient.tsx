"use client"

import { Anggota } from "@prisma/client"
import { DataTable } from "@/components/admin/DataTable"
import { columns } from "@/app/(protected)/admin/anggota/columns" // Import from app directory columns definition
import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
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
import { deleteAnggota } from "@/actions/anggota"

interface AnggotaClientProps {
    data: Anggota[]
    filterOptions: {
        prodi: string[]
    }
}

export function AnggotaClient({ data, filterOptions }: AnggotaClientProps) {
    const router = useRouter()
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const facetedFilters = [
        {
            key: "jenisKelamin",
            title: "Gender",
            options: [
                { label: "Laki-laki", value: "L" },
                { label: "Perempuan", value: "P" },
            ],
        },
        {
            key: "prodi",
            title: "Prodi",
            options: filterOptions.prodi.map(p => ({ label: p, value: p })),
        },
    ]

    const rangeFilters = [
        {
            key: "angkatan",
            title: "Angkatan",
        },
        {
            key: "umur",
            title: "Umur",
        }
    ]

    const handleDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            const res = await deleteAnggota(deleteId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Terjadi Kesalahan", { description: "Gagal menghapus data dari server." })
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    // Enhance columns with Delete Action
    const clientColumns = columns.map(col => {
        if (col.id === "actions") {
            return {
                ...col,
                cell: ({ row }: { row: { original: Anggota } }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/anggota/${row.original.id}`)}
                            title="Edit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-pencil"
                            >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteId(row.original.id)}
                            title="Hapus"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-trash"
                            >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </Button>
                    </div>
                )
            }
        }
        return col
    })

    return (
        <div className="space-y-4">


            <DataTable
                columns={clientColumns}
                data={data}
                searchKey="nama"
                facetedFilters={facetedFilters}
                rangeFilters={rangeFilters}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data Anggota ini akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 focus:ring-red-600"
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
