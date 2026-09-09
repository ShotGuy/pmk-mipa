"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    BookOpenCheck,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Pencil,
    Trash,
    Search,
    RotateCcw,
} from "lucide-react"
import { StatusPengontrolan } from "@prisma/client"
import { type DateRange } from "react-day-picker"

import { DataTable } from "@/components/admin/DataTable"
import { columns, PengontrolanWithRelations } from "@/app/(protected)/admin/pengontrolan/columns"
import { DateRangePicker } from "@/components/ui/date-range-picker"
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
import { deletePengontrolan } from "@/actions/pengontrolan"

interface PengontrolanClientProps {
    data: PengontrolanWithRelations[]
    metrics: {
        total: number
        terkontrolMingguIni: number
        aktif: number
        macetAtauVakum: number
    }
    ktbOptions: {
        value: string
        label: string
    }[]
    isReadOnly?: boolean
}

export function PengontrolanClient({ data, metrics, ktbOptions, isReadOnly = false }: PengontrolanClientProps) {
    const router = useRouter()

    const [selectedKTBId, setSelectedKTBId] = React.useState<string>("all")
    const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
    const [searchQuery, setSearchQuery] = React.useState("")

    const [deleteId, setDeleteId] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Filter data
    const filteredData = React.useMemo(() => {
        return data.filter((item) => {
            // 1. Filter KTB
            if (selectedKTBId !== "all" && item.ktb.id !== selectedKTBId) {
                return false
            }

            // 2. Filter Status
            if (selectedStatus !== "all" && item.status !== selectedStatus) {
                return false
            }

            // 3. Filter Date Range
            if (dateRange?.from) {
                const itemDate = new Date(item.tanggal)
                const from = new Date(dateRange.from)
                from.setHours(0, 0, 0, 0)
                if (itemDate < from) return false

                if (dateRange.to) {
                    const to = new Date(dateRange.to)
                    to.setHours(23, 59, 59, 999)
                    if (itemDate > to) return false
                }
            }

            // 4. Search Query (Bahan, Keterangan, Nama KTB, Pemimpin, Pendamping)
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchBahan = item.bahan?.toLowerCase().includes(q)
                const matchKet = item.keterangan?.toLowerCase().includes(q)
                const matchKtb = item.ktb.nama.toLowerCase().includes(q)
                const matchPemimpin = item.ktb.pemimpin.nama.toLowerCase().includes(q)
                const matchPengurus = item.ktb.pengurus.anggota.nama.toLowerCase().includes(q)

                if (!matchBahan && !matchKet && !matchKtb && !matchPemimpin && !matchPengurus) {
                    return false
                }
            }

            return true
        })
    }, [data, selectedKTBId, selectedStatus, dateRange, searchQuery])

    const hasActiveFilter =
        selectedKTBId !== "all" ||
        selectedStatus !== "all" ||
        dateRange !== undefined ||
        searchQuery.trim() !== ""

    const resetFilters = () => {
        setSelectedKTBId("all")
        setSelectedStatus("all")
        setDateRange(undefined)
        setSearchQuery("")
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deletePengontrolan(deleteId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan pada server saat menghapus catatan")
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
                    cell: ({ row }: { row: { original: PengontrolanWithRelations } }) => {
                        const item = row.original
                        return (
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                    onClick={() => router.push(`/admin/pengontrolan/${item.id}`)}
                                    title="Edit Catatan Pengontrolan"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                    onClick={() => setDeleteId(item.id)}
                                    title="Hapus Catatan Pengontrolan"
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
    }, [router, isReadOnly])

    return (
        <div className="space-y-6">
            {/* BAGIAN 1: METRIK RINGKASAN PENGONTROLAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border shadow-xs bg-card/60">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Total Pengontrolan
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <BookOpenCheck className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {metrics.total}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Akumulasi laporan monitoring
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-sky-500/20 bg-gradient-to-br from-card to-sky-50/30 dark:to-sky-950/20 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Terkontrol Minggu Ini
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
                            {metrics.terkontrolMingguIni}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            7 hari terakhir
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-500/20 bg-gradient-to-br from-card to-emerald-50/30 dark:to-emerald-950/20 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Kondisi KTB Aktif
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {metrics.aktif}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Sesi pengontrolan aktif rutin
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-rose-500/20 bg-gradient-to-br from-card to-rose-50/30 dark:to-rose-950/20 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Perlu Perhatian (Macet / Vakum)
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                            {metrics.macetAtauVakum}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Kendala jadwal / berhenti sementara
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* BAGIAN 2: TOOLBAR FILTER TERPADU */}
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-xs space-y-4">
                <div className="flex flex-wrap items-end gap-3 justify-between">
                    {/* Date Range Picker 2-Bulan */}
                    <DateRangePicker
                        date={dateRange}
                        onDateChange={setDateRange}
                        label="Periode Tanggal"
                        placeholder="Pilih rentang tanggal"
                    />

                    {/* Filter Status */}
                    <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Status Kondisi
                        </label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[160px] h-10 bg-card">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value={StatusPengontrolan.AKTIF}>Aktif Rutin</SelectItem>
                                <SelectItem value={StatusPengontrolan.MACET}>Macet</SelectItem>
                                <SelectItem value={StatusPengontrolan.VAKUM}>Vakum</SelectItem>
                                <SelectItem value={StatusPengontrolan.MERGER}>Merger</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filter Kelompok KTB */}
                    <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Kelompok KTB
                        </label>
                        <Select value={selectedKTBId} onValueChange={setSelectedKTBId}>
                            <SelectTrigger className="w-[200px] h-10 bg-card">
                                <SelectValue placeholder="Semua KTB" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kelompok KTB</SelectItem>
                                {ktbOptions.map((k) => (
                                    <SelectItem key={k.value} value={k.value}>
                                        {k.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pencarian Bahan / Keterangan */}
                    <div className="grid gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cari Pengontrolan
                        </label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Cari bahan, keterangan, pemimpin..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 bg-card"
                            />
                        </div>
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
                        Menampilkan <strong className="text-foreground">{filteredData.length}</strong> dari {data.length} total laporan pengontrolan
                    </span>
                    {hasActiveFilter && (
                        <span className="text-primary font-medium">Filter aktif diterapkan</span>
                    )}
                </div>
            </div>

            {/* BAGIAN 3: TABEL PENGONTROLAN */}
            <DataTable
                columns={clientColumns}
                data={filteredData}
                searchKey="bahan"
                showSearch={false}
            />

            {/* ALERT DIALOG: KONFIRMASI HAPUS PENGONTROLAN */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Catatan Pengontrolan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus catatan jurnal monitoring pengontrolan ini secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Menghapus..." : "Ya, Hapus Catatan"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
