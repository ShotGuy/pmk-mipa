"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Users,
    UserCheck,
    GitMerge,
    CheckCircle2,
    Pencil,
    Trash,
    Search,
    RotateCcw,
} from "lucide-react"
import { StatusKTB } from "@prisma/client"

import { DataTable } from "@/components/admin/DataTable"
import { columns, KTBWithRelations } from "@/app/(protected)/admin/ktb/columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { deleteKTB } from "@/actions/ktb"

interface KTBClientProps {
    data: KTBWithRelations[]
    metrics: {
        totalKTB: number
        aktifKTB: number
        mergerKTB: number
        totalAnggotaTerbina: number
    }
}

export function KTBClient({ data, metrics }: KTBClientProps) {
    const router = useRouter()

    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
    const [selectedAngkatan, setSelectedAngkatan] = React.useState<string>("all")

    const [deleteId, setDeleteId] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Daftar angkatan unik
    const angkatanList = React.useMemo(() => {
        const unique = Array.from(new Set(data.map((d) => d.angkatan)))
        return unique.sort((a, b) => b - a)
    }, [data])

    // Filtered data
    const filteredData = React.useMemo(() => {
        return data.filter((item) => {
            if (selectedStatus !== "all" && item.status !== selectedStatus) {
                return false
            }

            if (selectedAngkatan !== "all" && item.angkatan.toString() !== selectedAngkatan) {
                return false
            }

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchNama = item.nama.toLowerCase().includes(q)
                const matchPemimpin = item.pemimpin.nama.toLowerCase().includes(q)
                const matchPengurus = item.pengurus.anggota.nama.toLowerCase().includes(q)
                const matchLokasi = item.terbentukDimana?.toLowerCase().includes(q)

                if (!matchNama && !matchPemimpin && !matchPengurus && !matchLokasi) {
                    return false
                }
            }

            return true
        })
    }, [data, selectedStatus, selectedAngkatan, searchQuery])

    const hasActiveFilter =
        selectedStatus !== "all" ||
        selectedAngkatan !== "all" ||
        searchQuery.trim() !== ""

    const resetFilters = () => {
        setSelectedStatus("all")
        setSelectedAngkatan("all")
        setSearchQuery("")
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deleteKTB(deleteId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan pada server saat menghapus KTB")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const clientColumns = React.useMemo(() => {
        return columns.map((col) => {
            if (col.id === "actions") {
                return {
                    ...col,
                    cell: ({ row }: { row: { original: KTBWithRelations } }) => {
                        const ktb = row.original
                        return (
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                                    onClick={() => router.push(`/admin/ktb/${ktb.id}`)}
                                    title="Lihat Detail & Kelola Anggota"
                                >
                                    <Users className="h-3.5 w-3.5 text-primary" />
                                    <span>Anggota</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                    onClick={() => router.push(`/admin/ktb/${ktb.id}/edit`)}
                                    title="Edit KTB"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                    onClick={() => setDeleteId(ktb.id)}
                                    title="Hapus KTB"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    },
                }
            }
            return col
        })
    }, [router])

    return (
        <div className="space-y-6">
            {/* BAGIAN 1: RINGKASAN METRIK KTB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border shadow-xs bg-card/60">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Total Kelompok KTB
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Users className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {metrics.totalKTB}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Kelompok terdaftar di PMK
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-500/20 bg-gradient-to-br from-card to-emerald-50/30 dark:to-emerald-950/20 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            KTB Aktif Berjalan
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {metrics.aktifKTB}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Kelompok rutin bertumbuh
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-amber-500/20 bg-gradient-to-br from-card to-amber-50/30 dark:to-amber-950/20 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            KTB Status Merger
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                            <GitMerge className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                            {metrics.mergerKTB}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Kelompok dilebur ke kelompok lain
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-sky-500/20 bg-gradient-to-br from-card to-sky-50/30 dark:to-sky-950/20 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Anggota Terbina
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                            <UserCheck className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
                            {metrics.totalAnggotaTerbina}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Anggota aktif dalam KTB
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* BAGIAN 2: TOOLBAR FILTER */}
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-xs space-y-4">
                <div className="flex flex-wrap items-end gap-3 justify-between">
                    {/* Pencarian Teks */}
                    <div className="grid gap-1.5 flex-1 min-w-[240px]">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cari Kelompok KTB
                        </label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Cari nama KTB, pemimpin, pendamping..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 bg-card"
                            />
                        </div>
                    </div>

                    {/* Filter Status */}
                    <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Status KTB
                        </label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[150px] h-10 bg-card">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value={StatusKTB.AKTIF}>Aktif Saja</SelectItem>
                                <SelectItem value={StatusKTB.MERGER}>Merger Saja</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filter Angkatan */}
                    <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Angkatan
                        </label>
                        <Select value={selectedAngkatan} onValueChange={setSelectedAngkatan}>
                            <SelectTrigger className="w-[150px] h-10 bg-card">
                                <SelectValue placeholder="Semua Angkatan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Angkatan</SelectItem>
                                {angkatanList.map((a) => (
                                    <SelectItem key={a} value={a.toString()}>
                                        Angkatan {a}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilter && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="h-10 text-xs gap-1.5 border-dashed"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Filter</span>
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                    <span>
                        Menampilkan <strong className="text-foreground">{filteredData.length}</strong> dari {data.length} total kelompok KTB
                    </span>
                    {hasActiveFilter && (
                        <span className="text-primary font-medium">Filter aktif diterapkan</span>
                    )}
                </div>
            </div>

            {/* BAGIAN 3: TABEL KTB */}
            <DataTable
                columns={clientColumns}
                data={filteredData}
                searchKey="nama"
                showSearch={false}
            />

            {/* Alert Dialog: Konfirmasi Hapus KTB */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kelompok KTB?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus kelompok KTB dan riwayat keanggotaan di dalamnya. Jika kelompok sudah memiliki riwayat pengontrolan, Anda disarankan untuk mengubah statusnya menjadi <strong>MERGER</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Menghapus..." : "Ya, Hapus KTB"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
