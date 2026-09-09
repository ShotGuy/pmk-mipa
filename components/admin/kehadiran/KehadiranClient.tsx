"use client"

import { useState, useMemo, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"

const emptySubscribe = () => () => {}
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { DataTable } from "@/components/admin/DataTable"
import { getColumns, KehadiranWithRelations } from "@/app/(protected)/admin/kehadiran/columns"
import {
    togglePresensiKegiatan,
    deleteKehadiran,
    getKehadiranByKegiatan,
    getKehadiranMetrics,
} from "@/actions/kehadiran"
import { StandeeQRDialog } from "./StandeeQRDialog"
import { ManualKehadiranDialog } from "./ManualKehadiranDialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
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
import { toast } from "sonner"
import {
    Users,
    UserCheck,
    Sparkles,
    Percent,
    QrCode,
    UserPlus,
    Lock,
    Unlock,
    Search,
    RotateCcw,
    CalendarDays,
    ChevronsUpDown,
    Check,
} from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface KegiatanItem {
    id: string
    nama: string
    tanggal: Date
    lokasi: string | null
    waktu: Date | null
    isPresensiOpen: boolean
    presensiToken: string | null
    jenisKegiatanNama: string
    totalKehadiran: number
}

interface AnggotaOption {
    id: string
    nama: string
    prodi: string | null
    angkatan: number | null
    isAKTB?: boolean
}

interface KehadiranClientProps {
    kegiatanList: KegiatanItem[]
    initialKegiatanId: string
    initialData: KehadiranWithRelations[]
    initialMetrics: {
        totalHadir: number
        totalAnggotaHadir: number
        totalPengunjung: number
        totalAnggotaPMK: number
        persentaseHadir: number
    }
    anggotaOptions: AnggotaOption[]
    isReadOnly?: boolean
}

export function KehadiranClient({
    kegiatanList,
    initialKegiatanId,
    initialData,
    initialMetrics,
    anggotaOptions,
    isReadOnly = false,
}: KehadiranClientProps) {
    const router = useRouter()
    const [selectedKegiatanId, setSelectedKegiatanId] = useState<string>(initialKegiatanId)
    const [data, setData] = useState<KehadiranWithRelations[]>(initialData)
    const [metrics, setMetrics] = useState(initialMetrics)
    const [isSwitching, setIsSwitching] = useState(false)
    const isMounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    )

    // Combobox state
    const [openKegiatanCombobox, setOpenKegiatanCombobox] = useState(false)
    const [kegiatanTab, setKegiatanTab] = useState<"ALL" | "OPEN" | "THIS_MONTH">("ALL")

    // Dialog state
    const [openStandee, setOpenStandee] = useState(false)
    const [openManual, setOpenManual] = useState(false)

    // Delete state
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteName, setDeleteName] = useState<string>("")
    const [isDeleting, setIsDeleting] = useState(false)

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [searchQuery, setSearchQuery] = useState<string>("")

    // Current selected kegiatan
    const currentKegiatan = useMemo(() => {
        return kegiatanList.find((k) => k.id === selectedKegiatanId) || kegiatanList[0]
    }, [kegiatanList, selectedKegiatanId])

    const [isPresensiOpen, setIsPresensiOpen] = useState(currentKegiatan?.isPresensiOpen || false)

    // Switch activity
    const handleSelectKegiatan = async (id: string) => {
        if (id === selectedKegiatanId) {
            setOpenKegiatanCombobox(false)
            return
        }

        setSelectedKegiatanId(id)
        setOpenKegiatanCombobox(false)
        setIsSwitching(true)
        try {
            const target = kegiatanList.find((k) => k.id === id)
            if (target) {
                setIsPresensiOpen(target.isPresensiOpen)
            }
            const [newData, newMetrics] = await Promise.all([
                getKehadiranByKegiatan(id),
                getKehadiranMetrics(id),
            ])
            setData(newData as KehadiranWithRelations[])
            setMetrics(newMetrics)
        } catch {
            toast.error("Gagal Memuat Data Kegiatan")
        } finally {
            setIsSwitching(false)
        }
    }

    // Toggle presensi
    const handleTogglePresensi = async () => {
        if (!currentKegiatan) return
        try {
            const res = await togglePresensiKegiatan(currentKegiatan.id)
            if (res.success && res.isPresensiOpen !== undefined) {
                setIsPresensiOpen(res.isPresensiOpen)
                currentKegiatan.isPresensiOpen = res.isPresensiOpen
                if (res.presensiToken) {
                    currentKegiatan.presensiToken = res.presensiToken
                }
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Terjadi kesalahan saat mengubah status presensi.")
        }
    }

    // Refresh after manual entry
    const refreshData = async () => {
        if (!currentKegiatan) return
        const [newData, newMetrics] = await Promise.all([
            getKehadiranByKegiatan(currentKegiatan.id),
            getKehadiranMetrics(currentKegiatan.id),
        ])
        setData(newData as KehadiranWithRelations[])
        setMetrics(newMetrics)
        router.refresh()
    }

    // Delete handler
    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const res = await deleteKehadiran(deleteId)
            if (res.success) {
                toast.success(res.message)
                await refreshData()
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Gagal menghapus rekaman kehadiran.")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
            setDeleteName("")
        }
    }

    // Smart categorization of Kegiatan list
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const categorizedKegiatan = useMemo(() => {
        const isThisMonth = (d: Date) => {
            const date = new Date(d)
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        }

        let baseList = kegiatanList

        if (kegiatanTab === "OPEN") {
            baseList = kegiatanList.filter((k) => k.isPresensiOpen)
        } else if (kegiatanTab === "THIS_MONTH") {
            baseList = kegiatanList.filter((k) => isThisMonth(k.tanggal))
        }

        const openGroup = baseList.filter((k) => k.isPresensiOpen)
        const thisMonthGroup = baseList.filter((k) => !k.isPresensiOpen && isThisMonth(k.tanggal))
        const pastGroup = baseList.filter((k) => !k.isPresensiOpen && !isThisMonth(k.tanggal))

        return {
            openGroup,
            thisMonthGroup,
            pastGroup,
            totalOpen: kegiatanList.filter((k) => k.isPresensiOpen).length,
            totalThisMonth: kegiatanList.filter((k) => isThisMonth(k.tanggal)).length,
        }
    }, [kegiatanList, kegiatanTab, currentMonth, currentYear])

    // Current month name for heading
    const monthName = format(now, "MMMM yyyy", { locale: localeId })

    // Filtered data for DataTable
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Status filter
            if (statusFilter !== "ALL" && item.status !== statusFilter) {
                return false
            }

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim()
                const matchName = item.nama.toLowerCase().includes(q)
                const matchProdi = item.prodi?.toLowerCase().includes(q) || false
                const matchPhone = item.noHp?.toLowerCase().includes(q) || false
                const matchInfo = item.tauPmkDariMana?.toLowerCase().includes(q) || false

                if (!matchName && !matchProdi && !matchPhone && !matchInfo) {
                    return false
                }
            }

            return true
        })
    }, [data, statusFilter, searchQuery])

    const columns = useMemo(() => {
        const rawCols = getColumns({
            onDelete: (id, nama) => {
                setDeleteId(id)
                setDeleteName(nama)
            },
        })
        if (isReadOnly) {
            return rawCols.filter((col) => col.id !== "actions")
        }
        return rawCols
    }, [isReadOnly])

    const hasActiveFilters = statusFilter !== "ALL" || searchQuery.trim().length > 0

    // Render individual item in combobox
    const renderKegiatanOption = (k: KegiatanItem) => {
        const dateStr = format(new Date(k.tanggal), "d MMM yyyy", { locale: localeId })
        const isSelected = k.id === selectedKegiatanId

        return (
            <CommandItem
                key={k.id}
                value={`${k.nama} ${k.jenisKegiatanNama} ${dateStr} ${k.isPresensiOpen ? "terbuka aktif" : "tertutup"}`}
                onSelect={() => handleSelectKegiatan(k.id)}
                className="flex items-center justify-between py-2.5 px-3 text-xs cursor-pointer"
            >
                <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                        <span className={cn("font-semibold text-sm truncate", isSelected ? "text-primary" : "text-foreground")}>
                            {k.nama}
                        </span>
                        {k.isPresensiOpen ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1 py-0 shrink-0">
                                Buka
                            </Badge>
                        ) : null}
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate">
                        {dateStr} • {k.jenisKegiatanNama} • ({k.totalKehadiran} hadir)
                    </span>
                </div>
                <div className="flex items-center shrink-0">
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
            </CommandItem>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminPageHeader
                title="Presensi & Kehadiran Ibadah"
                description="Kelola presensi mandiri QR meja penerima tamu, buka/tutup presensi kegiatan, dan monitoring daftar hadir jemaat."
            />

            {/* Selector & Control Bar */}
            <div className="p-4 sm:p-5 rounded-xl border bg-card shadow-xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Searchable Combobox Activity Selector */}
                    <div className="flex-1 max-w-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <CalendarDays className="w-3.5 h-3.5 text-primary" />
                            <span>Pilih Kegiatan Ibadah (Cari & Kelompokkan)</span>
                        </div>

                        {!isMounted ? (
                            <Button
                                variant="outline"
                                className="w-full h-auto min-h-[52px] p-3 justify-between bg-background border text-left font-normal"
                                disabled
                            >
                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <CalendarDays className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-foreground truncate">
                                                {currentKegiatan?.nama || "Pilih Kegiatan..."}
                                            </span>
                                            {currentKegiatan?.isPresensiOpen ? (
                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0 shrink-0">
                                                    Presensi Buka
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0 shrink-0">
                                                    Tertutup
                                                </Badge>
                                            )}
                                        </div>
                                        {currentKegiatan && (
                                            <span className="text-xs text-muted-foreground truncate">
                                                {format(new Date(currentKegiatan.tanggal), "d MMM yyyy", { locale: localeId })}{" "}
                                                • {currentKegiatan.jenisKegiatanNama} • ({currentKegiatan.totalKehadiran} hadir)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
                            </Button>
                        ) : (
                            <Popover open={openKegiatanCombobox} onOpenChange={setOpenKegiatanCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openKegiatanCombobox}
                                        className="w-full h-auto min-h-[52px] p-3 justify-between bg-background hover:bg-muted/40 border text-left font-normal transition-all"
                                        disabled={isSwitching}
                                    >
                                        <div className="flex items-center gap-3 min-w-0 pr-2">
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                <CalendarDays className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-foreground truncate">
                                                        {currentKegiatan?.nama || "Pilih Kegiatan..."}
                                                    </span>
                                                    {currentKegiatan?.isPresensiOpen ? (
                                                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0 shrink-0">
                                                            Presensi Buka
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0 shrink-0">
                                                            Tertutup
                                                        </Badge>
                                                    )}
                                                </div>
                                                {currentKegiatan && (
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {format(new Date(currentKegiatan.tanggal), "d MMM yyyy", { locale: localeId })}{" "}
                                                        • {currentKegiatan.jenisKegiatanNama} • ({currentKegiatan.totalKehadiran} hadir)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
                                    </Button>
                                </PopoverTrigger>
                            <PopoverContent
                                className="w-[--radix-popover-trigger-width] min-w-[340px] sm:min-w-[480px] p-0 shadow-lg"
                                align="start"
                            >
                                <Command>
                                    <CommandInput placeholder="Ketik nama kegiatan, jenis, tanggal, atau bulan..." />

                                    {/* Quick Filter Tabs */}
                                    <div className="flex items-center gap-1.5 p-2 border-b bg-muted/30 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setKegiatanTab("ALL")}
                                            className={cn(
                                                "px-2.5 py-1 rounded-md transition-all font-medium",
                                                kegiatanTab === "ALL"
                                                    ? "bg-background text-foreground shadow-xs border"
                                                    : "text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            Semua ({kegiatanList.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setKegiatanTab("OPEN")}
                                            className={cn(
                                                "px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5",
                                                kegiatanTab === "OPEN"
                                                    ? "bg-background text-emerald-700 shadow-xs border border-emerald-200"
                                                    : "text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span>Sedang Dibuka ({categorizedKegiatan.totalOpen})</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setKegiatanTab("THIS_MONTH")}
                                            className={cn(
                                                "px-2.5 py-1 rounded-md transition-all font-medium",
                                                kegiatanTab === "THIS_MONTH"
                                                    ? "bg-background text-foreground shadow-xs border"
                                                    : "text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            Bulan Ini ({categorizedKegiatan.totalThisMonth})
                                        </button>
                                    </div>

                                    <CommandList className="max-h-80 overflow-y-auto">
                                        <CommandEmpty>
                                            <div className="py-6 text-center text-xs text-muted-foreground">
                                                Tidak ada kegiatan yang sesuai dengan pencarian.
                                            </div>
                                        </CommandEmpty>

                                        {/* Group 1: Sedang Dibuka */}
                                        {categorizedKegiatan.openGroup.length > 0 && (
                                            <CommandGroup heading="🟢 Presensi Sedang Dibuka (Aktif)">
                                                {categorizedKegiatan.openGroup.map(renderKegiatanOption)}
                                            </CommandGroup>
                                        )}

                                        {/* Group 2: Bulan Ini */}
                                        {categorizedKegiatan.thisMonthGroup.length > 0 && (
                                            <CommandGroup heading={`📅 Kegiatan Bulan Ini (${monthName})`}>
                                                {categorizedKegiatan.thisMonthGroup.map(renderKegiatanOption)}
                                            </CommandGroup>
                                        )}

                                        {/* Group 3: Riwayat Kegiatan Lainnya */}
                                        {categorizedKegiatan.pastGroup.length > 0 && (
                                            <CommandGroup heading="📁 Riwayat Kegiatan Lainnya">
                                                {categorizedKegiatan.pastGroup.map(renderKegiatanOption)}
                                            </CommandGroup>
                                        )}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    )}
                    </div>

                    {/* Quick Controls */}
                    {currentKegiatan && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                            {/* Toggle Presensi */}
                            {!isReadOnly && (
                                <Button
                                    variant={isPresensiOpen ? "outline" : "default"}
                                    onClick={handleTogglePresensi}
                                    className={
                                        isPresensiOpen
                                            ? "h-11 gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                            : "h-11 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                    }
                                >
                                    {isPresensiOpen ? (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            <span>Tutup Presensi</span>
                                        </>
                                    ) : (
                                        <>
                                            <Unlock className="w-4 h-4" />
                                            <span>Buka Presensi</span>
                                        </>
                                    )}
                                </Button>
                            )}

                            {/* Standee QR Button */}
                            <Button
                                variant="outline"
                                onClick={() => setOpenStandee(true)}
                                className="h-11 gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                            >
                                <QrCode className="w-4 h-4" />
                                <span>QR Meja Tamu</span>
                            </Button>

                            {/* Manual Entry Button */}
                            {!isReadOnly && (
                                <Button
                                    variant="secondary"
                                    onClick={() => setOpenManual(true)}
                                    className="h-11 gap-1.5"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Input Manual</span>
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                {currentKegiatan && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span>Status Saat Ini:</span>
                            {isPresensiOpen ? (
                                <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 gap-1 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Presensi DIBUKA (Menerima Isian)
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-muted-foreground gap-1">
                                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                                    Presensi DITUTUP
                                </Badge>
                            )}
                        </div>
                        <div>
                            {currentKegiatan.lokasi && (
                                <span>Lokasi: <strong>{currentKegiatan.lokasi}</strong></span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 4 Kartu Ringkasan Metrik */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-xs border bg-card">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Total Jemaat Hadir</p>
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {metrics.totalHadir}
                            </div>
                            <p className="text-[11px] text-muted-foreground">Tercatat di sistem</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border bg-card">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Anggota PMK Hadir</p>
                            <div className="text-2xl font-bold tracking-tight text-emerald-600">
                                {metrics.totalAnggotaHadir}
                            </div>
                            <p className="text-[11px] text-muted-foreground">Kategori APMK & AKTB</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                            <UserCheck className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border bg-card">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Pengunjung / Tamu Baru</p>
                            <div className="text-2xl font-bold tracking-tight text-amber-600">
                                {metrics.totalPengunjung}
                            </div>
                            <p className="text-[11px] text-muted-foreground">Kategori Non-APMK</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border bg-card">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Partisipasi Anggota</p>
                            <div className="text-2xl font-bold tracking-tight text-indigo-600">
                                {metrics.persentaseHadir}%
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Dari {metrics.totalAnggotaPMK} anggota terdaftar
                            </p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Percent className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border bg-card shadow-xs">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama, prodi, no WA..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 text-xs bg-background"
                        />
                    </div>

                    {/* Filter Status */}
                    <div className="w-full sm:w-44">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 text-xs bg-background">
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Kategori</SelectItem>
                                <SelectItem value="APMK">APMK (Anggota PMK)</SelectItem>
                                <SelectItem value="AKTB">AKTB (Anggota KTB)</SelectItem>
                                <SelectItem value="NON_APMK">NON_APMK (Pengunjung)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setStatusFilter("ALL")
                                setSearchQuery("")
                            }}
                            className="h-10 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Filter</span>
                        </Button>
                    )}
                </div>

                <div className="text-xs text-muted-foreground text-right shrink-0">
                    Menampilkan <strong>{filteredData.length}</strong> dari {data.length} kehadiran
                </div>
            </div>

            {/* DataTable */}
            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    showSearch={false}
                />
            </div>

            {/* Standee QR Dialog */}
            {openStandee && currentKegiatan && (
                <StandeeQRDialog
                    open={openStandee}
                    onOpenChange={setOpenStandee}
                    kegiatan={currentKegiatan}
                />
            )}

            {/* Manual Kehadiran Dialog */}
            {openManual && currentKegiatan && (
                <ManualKehadiranDialog
                    open={openManual}
                    onOpenChange={setOpenManual}
                    idKegiatan={currentKegiatan.id}
                    kegiatanNama={currentKegiatan.nama}
                    anggotaOptions={anggotaOptions}
                    onSuccess={refreshData}
                />
            )}

            {/* Alert Dialog Konfirmasi Hapus */}
            {Boolean(deleteId) && (
                <AlertDialog
                    open={Boolean(deleteId)}
                    onOpenChange={(open) => {
                        if (!open) {
                            setDeleteId(null)
                            setDeleteName("")
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Rekaman Kehadiran?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus data presensi atas nama{" "}
                                <strong>{deleteName}</strong>? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}
