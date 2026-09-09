"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Pencil,
    Trash,
    Wallet,
    Landmark,
    TrendingUp,
    TrendingDown,
    ArrowLeftRight,
} from "lucide-react"

import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { DataTable } from "@/components/admin/DataTable"
import { columns, KasWithBalance } from "@/app/(protected)/admin/kas/columns"
import { KasForm } from "./KasForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface KasClientProps {
    data: KasWithBalance[]
    metrics: {
        totalSaldoTerkini: number
        totalSaldoAwal: number
        totalPemasukanAll: number
        totalPengeluaranAll: number
        totalAkunKas: number
    }
    isReadOnly?: boolean
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function KasClient({ data, metrics, isReadOnly = false }: KasClientProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState<KasWithBalance | null>(null)
    const [deleteId, setDeleteId] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deleteKas(deleteId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan pada server saat menghapus kas")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const clientColumns = React.useMemo(() => {
        if (isReadOnly) {
            return columns.filter((col) => col.id !== "actions")
        }
        return columns.map((col) => {
            if (col.id === "actions") {
                return {
                    ...col,
                    cell: ({ row }: { row: { original: KasWithBalance } }) => (
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                onClick={() => {
                                    setSelectedItem(row.original)
                                    setIsModalOpen(true)
                                }}
                                title="Edit Akun Kas"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => setDeleteId(row.original.id)}
                                title="Hapus Akun Kas"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ),
                }
            }
            return col
        })
    }, [isReadOnly])

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen Kas & Rekening"
                description="Kelola akun kas, rekening bank, dan pantau saldo keuangan PMK MIPA"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Kas" },
                ]}
                {...(!isReadOnly
                    ? {
                          addLabel: "Tambah Kas",
                          onAdd: () => {
                              setSelectedItem(null)
                              setIsModalOpen(true)
                          },
                      }
                    : {})}
            />

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="border-emerald-500/20 bg-gradient-to-br from-card to-emerald-50/40 dark:to-emerald-950/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Saldo Terkini
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            {formatRupiah(metrics.totalSaldoTerkini)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Total uang kas PMK saat ini dari seluruh akun aktif
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-sky-500/20 bg-gradient-to-br from-card to-sky-50/40 dark:to-sky-950/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Akun Kas Terdaftar
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                            <Landmark className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            {metrics.totalAkunKas}{" "}
                            <span className="text-base font-normal text-muted-foreground">
                                Akun
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Rekening bank, dompet kas operasional, dan kas khusus
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-500/20 bg-gradient-to-br from-card to-slate-50/40 dark:to-slate-900/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Arus Mutasi Transaksi
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <ArrowLeftRight className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                Masuk:
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {formatRupiah(metrics.totalPemasukanAll)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                                Keluar:
                            </span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                                {formatRupiah(metrics.totalPengeluaranAll)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <DataTable
                columns={clientColumns}
                data={data}
                searchKey="nama"
            />

            {/* Modal Dialog: Tambah / Edit Kas */}
            <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) setSelectedItem(null)
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-primary" />
                            <span>{selectedItem ? "Edit Akun Kas" : "Tambah Akun Kas Baru"}</span>
                        </DialogTitle>
                        <DialogDescription>
                            {selectedItem
                                ? "Perbarui informasi nama atau saldo awal akun kas."
                                : "Daftarkan rekening bank, dompet fisik, atau pos kas PMK MIPA baru."}
                        </DialogDescription>
                    </DialogHeader>
                    <KasForm
                        key={selectedItem?.id || "new"}
                        initialData={selectedItem}
                        onSuccess={() => {
                            setIsModalOpen(false)
                            setSelectedItem(null)
                        }}
                        onCancel={() => {
                            setIsModalOpen(false)
                            setSelectedItem(null)
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Alert Dialog: Konfirmasi Hapus */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Akun Kas?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Akun kas ini akan dihapus dari sistem jika tidak memiliki riwayat transaksi terkait.
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
        </div>
    )
}
