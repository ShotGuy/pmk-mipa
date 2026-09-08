"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Pencil,
    Trash,
    TrendingUp,
    TrendingDown,
    Scale,
    Wallet,
    RotateCcw,
    Search,
    CheckCircle2,
} from "lucide-react"
import { type DateRange } from "react-day-picker"

import { DataTable } from "@/components/admin/DataTable"
import { columns, TransaksiWithKas } from "@/app/(protected)/admin/transaksi/columns"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { deleteTransaksi } from "@/actions/transaksi"
import { cn } from "@/lib/utils"

export interface KasAccountItem {
    value: string
    label: string
    saldoTerkini: number
}

interface TransaksiClientProps {
    data: TransaksiWithKas[]
    kasAccounts: KasAccountItem[]
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function TransaksiClient({ data, kasAccounts }: TransaksiClientProps) {
    const router = useRouter()

    // Filter States
    const [selectedKasId, setSelectedKasId] = React.useState<string>("all")
    const [selectedJenis, setSelectedJenis] = React.useState<string>("all")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
    const [searchQuery, setSearchQuery] = React.useState<string>("")

    // Action States
    const [deleteId, setDeleteId] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Total Likuiditas Seluruh Kas
    const totalLikuiditas = React.useMemo(() => {
        return kasAccounts.reduce((acc, curr) => acc + curr.saldoTerkini, 0)
    }, [kasAccounts])

    // Filtered Transactions
    const filteredData = React.useMemo(() => {
        return data.filter((item) => {
            // 1. Filter Akun Kas
            if (selectedKasId !== "all" && item.idKas !== selectedKasId) {
                return false
            }

            // 2. Filter Jenis Transaksi
            if (selectedJenis !== "all" && item.jenisTransaksi !== selectedJenis) {
                return false
            }

            // 3. Filter Rentang Tanggal
            if (dateRange?.from) {
                const txDate = new Date(item.createdAt)
                const from = new Date(dateRange.from)
                from.setHours(0, 0, 0, 0)
                if (txDate < from) return false

                if (dateRange.to) {
                    const to = new Date(dateRange.to)
                    to.setHours(23, 59, 59, 999)
                    if (txDate > to) return false
                }
            }

            // 4. Filter Search Text (Keterangan atau Nama Kas)
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchKeterangan = item.keterangan?.toLowerCase().includes(q)
                const matchKas = item.kas?.nama?.toLowerCase().includes(q)
                if (!matchKeterangan && !matchKas) return false
            }

            return true
        })
    }, [data, selectedKasId, selectedJenis, dateRange, searchQuery])

    // Dynamic Metrics calculated in real-time from filteredData
    const dynamicMetrics = React.useMemo(() => {
        let totalPemasukan = 0
        let totalPengeluaran = 0

        for (const t of filteredData) {
            if (t.jenisTransaksi === "PEMASUKAN") {
                totalPemasukan += t.nominal
            } else if (t.jenisTransaksi === "PENGELUARAN") {
                totalPengeluaran += t.nominal
            }
        }

        return {
            totalPemasukan,
            totalPengeluaran,
            netMutasi: totalPemasukan - totalPengeluaran,
            count: filteredData.length,
        }
    }, [filteredData])

    const hasActiveFilter =
        selectedKasId !== "all" ||
        selectedJenis !== "all" ||
        dateRange !== undefined ||
        searchQuery.trim() !== ""

    const resetAllFilters = () => {
        setSelectedKasId("all")
        setSelectedJenis("all")
        setDateRange(undefined)
        setSearchQuery("")
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deleteTransaksi(deleteId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan pada server saat menghapus transaksi")
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
                    cell: ({ row }: { row: { original: TransaksiWithKas } }) => (
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                onClick={() => router.push(`/admin/transaksi/${row.original.id}`)}
                                title="Edit Transaksi"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => setDeleteId(row.original.id)}
                                title="Hapus Transaksi"
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
        <div className="space-y-6">
            {/* BAGIAN 1: INTERACTIVE QUICK-FILTER CARDS AKUN KAS */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                            <Wallet className="w-4 h-4 text-primary" />
                            <span>Posisi Saldo Kas Terkini</span>
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Klik kartu akun kas di bawah ini untuk memfilter riwayat transaksi akun tersebut secara instan.
                        </p>
                    </div>
                    {selectedKasId !== "all" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedKasId("all")}
                            className="text-xs h-7 text-primary hover:text-primary/80 self-start sm:self-auto"
                        >
                            Tampilkan Semua Kas
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* Card: Semua Kas */}
                    <Card
                        onClick={() => setSelectedKasId("all")}
                        className={cn(
                            "cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-sm relative overflow-hidden",
                            selectedKasId === "all"
                                ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs"
                                : "border-border/80 bg-card/60"
                        )}
                    >
                        <CardHeader className="p-3.5 pb-1 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">
                                Total Seluruh Kas
                            </CardTitle>
                            {selectedKasId === "all" ? (
                                <Badge variant="default" className="text-[10px] h-4 px-1.5 bg-primary">
                                    Aktif
                                </Badge>
                            ) : (
                                <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                        </CardHeader>
                        <CardContent className="p-3.5 pt-1">
                            <div className="text-lg font-bold text-foreground tracking-tight">
                                {formatRupiah(totalLikuiditas)}
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                                {kasAccounts.length} Akun Kas Terdaftar
                            </span>
                        </CardContent>
                    </Card>

                    {/* Cards: Per Akun Kas */}
                    {kasAccounts.map((kas) => {
                        const isSelected = selectedKasId === kas.value
                        return (
                            <Card
                                key={kas.value}
                                onClick={() =>
                                    setSelectedKasId(isSelected ? "all" : kas.value)
                                }
                                className={cn(
                                    "cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-sm relative overflow-hidden",
                                    isSelected
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs"
                                        : "border-border/80 bg-card/60"
                                )}
                            >
                                <CardHeader className="p-3.5 pb-1 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-xs font-semibold text-foreground truncate max-w-[140px]" title={kas.label}>
                                        {kas.label}
                                    </CardTitle>
                                    {isSelected ? (
                                        <Badge variant="default" className="text-[10px] h-4 px-1.5 bg-primary gap-0.5">
                                            <CheckCircle2 className="w-2.5 h-2.5" />
                                            <span>Aktif</span>
                                        </Badge>
                                    ) : (
                                        <div className="p-1 rounded-md bg-muted text-muted-foreground">
                                            <Wallet className="w-3 h-3" />
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="p-3.5 pt-1">
                                    <div className="text-lg font-bold text-foreground tracking-tight">
                                        {formatRupiah(kas.saldoTerkini)}
                                    </div>
                                    <span className="text-[11px] text-muted-foreground">
                                        Saldo saat ini
                                    </span>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* BAGIAN 2: 3 KARTU RINGKASAN METRIK (DINAMIS SESUAI FILTER) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="border-emerald-500/20 bg-gradient-to-br from-card to-emerald-50/40 dark:to-emerald-950/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pemasukan
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            +{formatRupiah(dynamicMetrics.totalPemasukan)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {hasActiveFilter
                                ? `Hasil filter: ${dynamicMetrics.count} transaksi`
                                : "Akumulasi seluruh pemasukan"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-rose-500/20 bg-gradient-to-br from-card to-rose-50/40 dark:to-rose-950/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pengeluaran
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                            <TrendingDown className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                            -{formatRupiah(dynamicMetrics.totalPengeluaran)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {hasActiveFilter
                                ? `Hasil filter: ${dynamicMetrics.count} transaksi`
                                : "Akumulasi seluruh pengeluaran"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-500/20 bg-gradient-to-br from-card to-slate-50/40 dark:to-slate-900/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Net Arus Transaksi
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <Scale className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                                dynamicMetrics.netMutasi >= 0
                                    ? "text-foreground"
                                    : "text-rose-600 dark:text-rose-400"
                            }`}
                        >
                            {formatRupiah(dynamicMetrics.netMutasi)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {dynamicMetrics.netMutasi >= 0
                                ? "Surplus kas pada periode ini"
                                : "Defisit kas pada periode ini"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* BAGIAN 3: TOOLBAR FILTER TERPADU */}
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-xs space-y-4">
                <div className="flex flex-wrap items-end gap-3 justify-between">
                    {/* Date Range Picker (Persis seperti referensi gambar user) */}
                    <DateRangePicker
                        date={dateRange}
                        onDateChange={setDateRange}
                        label="Periode Laporan"
                        placeholder="Pilih rentang tanggal"
                    />

                    {/* Filter Jenis Transaksi */}
                    <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Jenis Transaksi
                        </label>
                        <Select
                            value={selectedJenis}
                            onValueChange={setSelectedJenis}
                        >
                            <SelectTrigger className="w-[150px] h-10 bg-card">
                                <SelectValue placeholder="Semua Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis</SelectItem>
                                <SelectItem value="PEMASUKAN">Pemasukan (+)</SelectItem>
                                <SelectItem value="PENGELUARAN">Pengeluaran (-)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filter Akun Kas */}
                    <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Akun Kas
                        </label>
                        <Select
                            value={selectedKasId}
                            onValueChange={setSelectedKasId}
                        >
                            <SelectTrigger className="w-[170px] h-10 bg-card">
                                <SelectValue placeholder="Semua Kas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kas</SelectItem>
                                {kasAccounts.map((k) => (
                                    <SelectItem key={k.value} value={k.value}>
                                        {k.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pencarian Keterangan */}
                    <div className="grid gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cari Transaksi
                        </label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Cari keterangan transaksi..."
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
                            onClick={resetAllFilters}
                            className="h-10 text-xs gap-1.5 border-dashed"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Filter</span>
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                    <span>
                        Menampilkan <strong className="text-foreground">{filteredData.length}</strong> dari {data.length} total transaksi
                    </span>
                    {hasActiveFilter && (
                        <span className="text-primary font-medium">
                            Filter aktif diterapkan
                        </span>
                    )}
                </div>
            </div>

            {/* BAGIAN 4: TABEL TRANSAKSI */}
            <DataTable
                columns={clientColumns}
                data={filteredData}
                searchKey="keterangan"
                showSearch={false}
            />

            {/* Alert Dialog: Konfirmasi Hapus */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Transaksi ini akan dihapus dari histori dan saldo kas akan dihitung ulang secara otomatis.
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
