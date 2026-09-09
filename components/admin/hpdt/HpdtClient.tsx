"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Sun,
    Moon,
    Users,
    Calendar,
    BookOpen,
    ScrollText,
    Pencil,
    Trash,
    Loader2,
    CheckCircle2,
    XCircle,
    Church,
    HeartHandshake,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DataTable } from "@/components/admin/DataTable"
import { columns, HpdtWithRelation, StatusIndicator } from "@/app/(protected)/admin/hpdt/columns"
import {
    getHPDTOverview,
    getHPDTDetailByPengurus,
    deleteHPDT,
} from "@/actions/hpdt"

const MONTHS = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
]

export type OverviewData = {
    month: number
    year: number
    elapsedDays: number
    daysInMonth: number
    avgSatePercentage: number
    avgDoaPercentage: number
    totalPengurus: number
    pengurusStats: Array<{
        idPengurus: string
        nama: string
        jabatan: string
        prodi: string
        totalSate: number
        totalDoa: number
        totalKtb: number
        totalGereja: number
        satePercentage: number
        doaPercentage: number
        totalRecordedDays: number
        elapsedDays: number
        daysInMonth: number
    }>
}

interface HpdtClientProps {
    initialOverview: OverviewData
    initialLogs: HpdtWithRelation[]
    pengurusList: Array<{
        value: string
        label: string
        nama: string
        jabatan: string
    }>
    currentPengurusId?: string
    userRole?: string
}

export function HpdtClient({
    initialOverview,
    initialLogs,
    pengurusList,
    currentPengurusId,
    userRole,
}: HpdtClientProps) {
    const router = useRouter()

    // State for Tab 1 (Rekap Performa)
    const [selectedMonth, setSelectedMonth] = React.useState<number>(initialOverview.month)
    const [selectedYear, setSelectedYear] = React.useState<number>(initialOverview.year)
    const [overview, setOverview] = React.useState<OverviewData>(initialOverview)
    const [isPendingOverview, startOverviewTransition] = React.useTransition()
    const [searchPengurus, setSearchPengurus] = React.useState("")

    // State for Journal Detail Dialog (from Tab 1)
    const [journalPengurus, setJournalPengurus] = React.useState<{ id: string; nama: string } | null>(null)
    const [journalEntries, setJournalEntries] = React.useState<HpdtWithRelation[]>([])
    const [isLoadingJournal, setIsLoadingJournal] = React.useState(false)

    // State for Tab 2 (Log Harian)
    const [logs] = React.useState<HpdtWithRelation[]>(initialLogs)
    const [filterPengurusId, setFilterPengurusId] = React.useState<string>("all")
    const [selectedDetailLog, setSelectedDetailLog] = React.useState<HpdtWithRelation | null>(null)

    // State for Delete
    const [deleteId, setDeleteId] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Handle Month/Year Change
    const handlePeriodChange = (month: number, year: number) => {
        setSelectedMonth(month)
        setSelectedYear(year)
        startOverviewTransition(async () => {
            const res = await getHPDTOverview(month, year)
            if (res.success && res.data) {
                setOverview(res.data)
            } else {
                toast.error(res.message || "Gagal memperbarui rekapitulasi")
            }
        })
    }

    // Handle Open Journal modal for a specific Pengurus
    const handleOpenJournal = async (idPengurus: string, nama: string) => {
        setJournalPengurus({ id: idPengurus, nama })
        setIsLoadingJournal(true)
        try {
            const res = await getHPDTDetailByPengurus(idPengurus, selectedMonth, selectedYear)
            if (res.success && res.data) {
                setJournalEntries(res.data as unknown as HpdtWithRelation[])
            } else {
                toast.error("Gagal memuat catatan jurnal")
                setJournalEntries([])
            }
        } catch {
            toast.error("Terjadi kesalahan saat memuat jurnal")
            setJournalEntries([])
        } finally {
            setIsLoadingJournal(false)
        }
    }

    // Handle Delete
    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deleteHPDT(deleteId)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan saat menghapus data")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    // Filtered pengurus stats for search input
    const filteredPengurusStats = React.useMemo(() => {
        if (!searchPengurus.trim()) return overview.pengurusStats
        const q = searchPengurus.toLowerCase()
        return overview.pengurusStats.filter(
            (p) =>
                p.nama.toLowerCase().includes(q) ||
                p.jabatan.toLowerCase().includes(q) ||
                p.prodi.toLowerCase().includes(q)
        )
    }, [overview.pengurusStats, searchPengurus])

    // Filtered logs for Tab 2
    const filteredLogs = React.useMemo(() => {
        if (filterPengurusId === "all") return logs
        return logs.filter((l) => l.idPengurus === filterPengurusId)
    }, [logs, filterPengurusId])

    // Setup action buttons for Tab 2 DataTable
    const clientColumns = React.useMemo(() => {
        return columns.map((col) => {
            if (col.id === "catatan") {
                return {
                    ...col,
                    cell: ({ row }: { row: { original: HpdtWithRelation } }) => {
                        const { ayatAlkitab, judulBuku } = row.original
                        if (!ayatAlkitab && !judulBuku) {
                            return <span className="text-xs text-muted-foreground italic">-</span>
                        }
                        return (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs gap-1.5 bg-background hover:bg-accent"
                                onClick={() => setSelectedDetailLog(row.original)}
                            >
                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                                <span>Lihat Catatan</span>
                            </Button>
                        )
                    }
                }
            }

            if (col.id === "actions") {
                return {
                    ...col,
                    cell: ({ row }: { row: { original: HpdtWithRelation } }) => {
                        const canModify =
                            userRole === "ADMIN" ||
                            (currentPengurusId && row.original.idPengurus === currentPengurusId)

                        if (!canModify) {
                            return null
                        }

                        return (
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                    onClick={() => router.push(`/admin/hpdt/${row.original.id}`)}
                                    title="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                    onClick={() => setDeleteId(row.original.id)}
                                    title="Hapus"
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
    }, [router, currentPengurusId, userRole])

    // Years available in dropdown (current year - 2 to current year + 1)
    const currentYear = new Date().getFullYear()
    const yearOptions = [currentYear - 1, currentYear, currentYear + 1]

    return (
        <div className="space-y-6">
            <Tabs defaultValue="rekap" className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <TabsList className="grid w-full sm:w-[380px] grid-cols-2">
                        <TabsTrigger value="rekap" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Rekap Performa</span>
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="flex items-center gap-2">
                            <ScrollText className="w-4 h-4" />
                            <span>Log Harian & Riwayat</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* TAB 1: REKAPITULASI PERFORMA PENGURUS */}
                <TabsContent value="rekap" className="space-y-6 mt-6">
                    {/* Month & Year Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-muted-foreground">Periode Rekap:</span>
                            <Select
                                value={String(selectedMonth)}
                                onValueChange={(val) => handlePeriodChange(Number(val), selectedYear)}
                                disabled={isPendingOverview}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m) => (
                                        <SelectItem key={m.value} value={String(m.value)}>
                                            {m.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={String(selectedYear)}
                                onValueChange={(val) => handlePeriodChange(selectedMonth, Number(val))}
                                disabled={isPendingOverview}
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {isPendingOverview && (
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Memperbarui...
                                </span>
                            )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Hari berjalan: <strong className="text-foreground">{overview.elapsedDays}</strong> dari {overview.daysInMonth} hari
                        </div>
                    </div>

                    {/* KPI Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Card className="border-emerald-500/20 bg-gradient-to-br from-card to-emerald-50/40 dark:to-emerald-950/20 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Rata-rata Saat Teduh
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <Sun className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight text-foreground">
                                    {overview.avgSatePercentage}%
                                </div>
                                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(overview.avgSatePercentage, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Tingkat kedisiplinan saat teduh seluruh pengurus
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-indigo-500/20 bg-gradient-to-br from-card to-indigo-50/40 dark:to-indigo-950/20 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Rata-rata Doa Malam
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                    <Moon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight text-foreground">
                                    {overview.avgDoaPercentage}%
                                </div>
                                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(overview.avgDoaPercentage, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Tingkat kepatuhan doa malam seluruh pengurus
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-500/20 bg-gradient-to-br from-card to-slate-50/40 dark:to-slate-900/20 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Pengurus Dipantau
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    <Users className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight text-foreground">
                                    {overview.totalPengurus} <span className="text-base font-normal text-muted-foreground">Orang</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                    <span>
                                        Periode {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Badan Pengurus aktif dengan kewajiban pencatatan HPDT
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table of Pengurus Performance */}
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                            <div>
                                <CardTitle className="text-lg">Tabel Kedisiplinan Pengurus</CardTitle>
                                <CardDescription>
                                    Rekapitulasi aktivitas rohani setiap pengurus pada bulan {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                                </CardDescription>
                            </div>
                            <div className="w-full sm:w-64">
                                <Input
                                    placeholder="Cari nama pengurus..."
                                    value={searchPengurus}
                                    onChange={(e) => setSearchPengurus(e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[260px]">Pengurus</TableHead>
                                            <TableHead className="text-center">Hari Tercatat</TableHead>
                                            <TableHead className="w-[180px]">Saat Teduh</TableHead>
                                            <TableHead className="w-[180px]">Doa Malam</TableHead>
                                            <TableHead className="text-center">KTB</TableHead>
                                            <TableHead className="text-center">Gereja</TableHead>
                                            <TableHead className="text-right pr-6">Catatan Jurnal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPengurusStats.length > 0 ? (
                                            filteredPengurusStats.map((p) => (
                                                <TableRow key={p.idPengurus} className="hover:bg-muted/40 transition-colors">
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-foreground">{p.nama}</span>
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                                    {p.jabatan.replace(/_/g, " ")}
                                                                </Badge>
                                                                {p.prodi && <span>• {p.prodi}</span>}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="font-medium text-sm">
                                                            {p.totalRecordedDays}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">/{p.elapsedDays} hr</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                                                    {p.totalSate} hari
                                                                </span>
                                                                <span className="text-muted-foreground">{p.satePercentage}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-emerald-500 rounded-full"
                                                                    style={{ width: `${Math.min(p.satePercentage, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="font-medium text-indigo-700 dark:text-indigo-400">
                                                                    {p.totalDoa} hari
                                                                </span>
                                                                <span className="text-muted-foreground">{p.doaPercentage}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-indigo-500 rounded-full"
                                                                    style={{ width: `${Math.min(p.doaPercentage, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                                                            <HeartHandshake className="w-3 h-3" />
                                                            {p.totalKtb}x
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                                                            <Church className="w-3 h-3" />
                                                            {p.totalGereja}x
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 text-xs gap-1.5 hover:border-primary"
                                                            onClick={() => handleOpenJournal(p.idPengurus, p.nama)}
                                                        >
                                                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                                                            <span>Buka Jurnal</span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                                                    Tidak ada data pengurus yang cocok.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: LOG HARIAN & RIWAYAT */}
                <TabsContent value="logs" className="space-y-6 mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm">
                        {pengurusList.length > 1 ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground">Filter Pengurus:</span>
                                <Select
                                    value={filterPengurusId}
                                    onValueChange={setFilterPengurusId}
                                >
                                    <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Pilih pengurus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Pengurus</SelectItem>
                                        {pengurusList.map((p) => (
                                            <SelectItem key={p.value} value={p.value}>
                                                {p.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Pengurus:</span>
                                <Badge variant="secondary" className="font-medium text-xs px-2.5 py-1">
                                    {pengurusList[0]?.nama || "Saya"}
                                </Badge>
                            </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                            Menampilkan <strong className="text-foreground">{filteredLogs.length}</strong> entri log terkini
                        </div>
                    </div>

                    <DataTable
                        columns={clientColumns}
                        data={filteredLogs}
                        searchKey="pengurus"
                    />
                </TabsContent>
            </Tabs>

            {/* MODAL 1: JURNAL REFLEKSI BULANAN (DARI TAB 1) */}
            <Dialog open={!!journalPengurus} onOpenChange={(open) => !open && setJournalPengurus(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <span>Jurnal Refleksi: {journalPengurus?.nama}</span>
                        </DialogTitle>
                        <DialogDescription>
                            Catatan HPDT & renungan harian pada bulan {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 my-2">
                        {isLoadingJournal ? (
                            <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span className="text-sm">Memuat catatan jurnal...</span>
                            </div>
                        ) : journalEntries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground text-center">
                                <ScrollText className="w-8 h-8 opacity-40" />
                                <p className="text-sm">Belum ada catatan HPDT untuk pengurus ini pada periode terpilih.</p>
                            </div>
                        ) : (
                            journalEntries.map((entry) => {
                                const entryDate = new Date(entry.tanggal)
                                return (
                                    <div
                                        key={entry.id}
                                        className="p-4 rounded-xl border bg-card/60 hover:bg-card transition-colors space-y-3"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                                            <span className="font-semibold text-sm">
                                                {entryDate.toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </span>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <StatusIndicator value={entry.isSate} label="Sate" />
                                                <StatusIndicator value={entry.isDoa} label="Doa" />
                                                {entry.isAttendedKTB && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                                                        <HeartHandshake className="w-3 h-3" />
                                                        KTB
                                                    </span>
                                                )}
                                                {entry.isGereja && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                                                        <Church className="w-3 h-3" />
                                                        Gereja
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            {entry.ayatAlkitab ? (
                                                <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-900/50 text-sky-900 dark:text-sky-200">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
                                                        <ScrollText className="w-3.5 h-3.5" />
                                                        <span>Ayat Alkitab yang Dibaca</span>
                                                    </div>
                                                    <p className="text-xs whitespace-pre-wrap">{entry.ayatAlkitab}</p>
                                                </div>
                                            ) : null}

                                            {entry.judulBuku ? (
                                                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        <span>Buku Rohani yang Dibaca</span>
                                                    </div>
                                                    <p className="text-xs whitespace-pre-wrap">{entry.judulBuku}</p>
                                                </div>
                                            ) : null}

                                            {!entry.ayatAlkitab && !entry.judulBuku && (
                                                <p className="text-xs text-muted-foreground italic">
                                                    Tidak ada catatan ayat alkitab atau judul buku khusus pada hari ini.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* MODAL 2: LIHAT DETAIL REFLEKSI TUNGGAL (DARI TAB 2) */}
            <Dialog open={!!selectedDetailLog} onOpenChange={(open) => !open && setSelectedDetailLog(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <span>Catatan Renungan HPDT</span>
                        </DialogTitle>
                        <DialogDescription>
                            {selectedDetailLog &&
                                `${selectedDetailLog.pengurus?.anggota?.nama} • ${new Date(
                                    selectedDetailLog.tanggal
                                ).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}`}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedDetailLog && (
                        <div className="space-y-4 pt-2 text-sm">
                            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/40 border">
                                <div className="flex items-center gap-2">
                                    {selectedDetailLog.isSate ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span className="text-xs">Saat Teduh</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedDetailLog.isDoa ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span className="text-xs">Doa Malam</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedDetailLog.isAttendedKTB ? (
                                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span className="text-xs">KTB</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedDetailLog.isGereja ? (
                                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span className="text-xs">Ibadah Gereja</span>
                                </div>
                            </div>

                            {selectedDetailLog.ayatAlkitab && (
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                        <ScrollText className="w-3.5 h-3.5 text-sky-600" />
                                        Ayat Alkitab yang Dibaca:
                                    </span>
                                    <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-900/50 text-sky-900 dark:text-sky-200 text-xs">
                                        {selectedDetailLog.ayatAlkitab}
                                    </div>
                                </div>
                            )}

                            {selectedDetailLog.judulBuku && (
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                                        Buku Rohani yang Dibaca:
                                    </span>
                                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
                                        {selectedDetailLog.judulBuku}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG: DELETE CONFIRMATION */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Catatan HPDT?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Catatan HPDT untuk tanggal tersebut akan dihapus permanen dari sistem.
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
