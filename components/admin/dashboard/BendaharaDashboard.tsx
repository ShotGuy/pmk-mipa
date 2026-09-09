"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    Wallet,
    Landmark,
    TrendingUp,
    TrendingDown,
    Scale,
    Calendar,
    ArrowUpRight,
    PlusCircle,
    CheckCircle2,
    Sun,
    Moon,
    HeartHandshake,
    Church,
    BookOpen,
    Loader2,
    CreditCard,
    ShieldCheck,
    Sparkles,
    ArrowDownRight,
    Users,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BendaharaDashboardData, quickSaveTodayHPDT } from "@/actions/dashboard"
import { cn } from "@/lib/utils"

interface BendaharaDashboardProps {
    data: BendaharaDashboardData
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function BendaharaDashboard({ data }: BendaharaDashboardProps) {
    const [isPendingHpdt, startHpdtTransition] = React.useTransition()

    const [isSate, setIsSate] = React.useState(data.todayHpdt.isSate)
    const [isDoa, setIsDoa] = React.useState(data.todayHpdt.isDoa)
    const [isAttendedKTB, setIsAttendedKTB] = React.useState(data.todayHpdt.isAttendedKTB)
    const [isGereja, setIsGereja] = React.useState(data.todayHpdt.isGereja)
    const [hasSaved, setHasSaved] = React.useState(data.todayHpdt.isFilled)

    const handleSaveHpdt = () => {
        startHpdtTransition(async () => {
            const res = await quickSaveTodayHPDT({
                isSate,
                isDoa,
                isAttendedKTB,
                isGereja,
                ayatAlkitab: data.todayHpdt.ayatAlkitab,
                judulBuku: data.todayHpdt.judulBuku,
            })
            if (res.success) {
                toast.success(res.message)
                setHasSaved(true)
            } else {
                toast.error(res.message)
            }
        })
    }

    const { financialMetrics } = data

    return (
        <div className="space-y-8 pb-10">
            {/* 1. HERO FINANCIAL HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white p-6 md:p-8 shadow-xl border border-emerald-800/40">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <Badge className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/30 text-xs px-3 py-1 backdrop-blur-md">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
                                Bendahara PMK MIPA • Manajemen Keuangan
                            </Badge>
                            <span className="text-xs text-emerald-200/80 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {data.currentDateFormatted}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span>{data.timeGreeting}, {data.firstName}!</span>
                            <span className="text-xl">💰</span>
                        </h1>

                        <p className="text-sm text-emerald-100/80 leading-relaxed">
                            Kelola pembukuan kas, catat arus transaksi persembahan dan operasional pelayanan, serta pantau likuiditas keuangan PMK MIPA secara transparan dan akuntabel.
                        </p>
                    </div>

                    {/* Quick navigation action buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            <Link href="/admin/transaksi/new">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                <span>Catat Transaksi Baru</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white">
                            <Link href="/admin/kas">
                                <Landmark className="w-4 h-4 mr-2" />
                                <span>Kelola Kas & Bank</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. TODAY HPDT QUICK ENTRY */}
            <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-50/50 via-background to-teal-50/30 dark:from-emerald-950/20 dark:via-card dark:to-teal-950/20 shadow-xs">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Refleksi & HPDT Pribadi Anda Hari Ini</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Pelayanan keuangan yang jujur dan setia lahir dari persekutuan harian yang intim dengan Tuhan.
                            </CardDescription>
                        </div>
                        {hasSaved && (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 text-xs w-fit">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Sudah Tercatat Hari Ini
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSate(!isSate)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                                isSate
                                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200"
                                    : "bg-background border-muted hover:bg-muted/50 text-muted-foreground"
                            )}
                        >
                            <div className={cn("p-2 rounded-lg", isSate ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground")}>
                                <Sun className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold">Saat Teduh</div>
                                <div className="text-[11px] opacity-80">{isSate ? "Sudah Dilakukan" : "Belum Dilakukan"}</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsDoa(!isDoa)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                                isDoa
                                    ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200"
                                    : "bg-background border-muted hover:bg-muted/50 text-muted-foreground"
                            )}
                        >
                            <div className={cn("p-2 rounded-lg", isDoa ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300" : "bg-muted text-muted-foreground")}>
                                <Moon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold">Doa Pribadi</div>
                                <div className="text-[11px] opacity-80">{isDoa ? "Sudah Berdoa" : "Belum Berdoa"}</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAttendedKTB(!isAttendedKTB)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                                isAttendedKTB
                                    ? "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200"
                                    : "bg-background border-muted hover:bg-muted/50 text-muted-foreground"
                            )}
                        >
                            <div className={cn("p-2 rounded-lg", isAttendedKTB ? "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300" : "bg-muted text-muted-foreground")}>
                                <HeartHandshake className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold">Kelompok KTB</div>
                                <div className="text-[11px] opacity-80">{isAttendedKTB ? "Hadir Persekutuan" : "Tidak Ada Jadwal"}</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsGereja(!isGereja)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                                isGereja
                                    ? "bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200"
                                    : "bg-background border-muted hover:bg-muted/50 text-muted-foreground"
                            )}
                        >
                            <div className={cn("p-2 rounded-lg", isGereja ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300" : "bg-muted text-muted-foreground")}>
                                <Church className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold">Ibadah Raya</div>
                                <div className="text-[11px] opacity-80">{isGereja ? "Hadir Gereja" : "Tidak Ada Jadwal"}</div>
                            </div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <div className="text-xs text-muted-foreground">
                            Bulan ini: Saat Teduh <strong>{data.hpdtMonthlyStats.satePercentage}%</strong> ({data.hpdtMonthlyStats.sateCount}/{data.hpdtMonthlyStats.elapsedDays} hari) • Doa <strong>{data.hpdtMonthlyStats.doaPercentage}%</strong>
                        </div>
                        <Button
                            size="sm"
                            onClick={handleSaveHpdt}
                            disabled={isPendingHpdt}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                        >
                            {isPendingHpdt ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <span>Simpan HPDT Hari Ini</span>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 3. FINANCIAL KPI METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-emerald-500/20 bg-gradient-to-br from-card to-emerald-50/40 dark:to-emerald-950/20 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total Saldo Kas Terkini
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            <Wallet className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground truncate">
                            {formatRupiah(financialMetrics.totalSaldoTerkini)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {financialMetrics.totalAkunKas} Akun Kas Aktif
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Pemasukan Bulan Ini
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 truncate">
                            {formatRupiah(financialMetrics.pemasukanBulanIni)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Persembahan & dana masuk
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Pengeluaran Bulan Ini
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300">
                            <TrendingDown className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400 truncate">
                            {formatRupiah(financialMetrics.pengeluaranBulanIni)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Biaya operasional & kegiatan
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Arus Kas Bersih (Net)
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                            <Scale className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold tracking-tight truncate", financialMetrics.netBulanIni >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                            {financialMetrics.netBulanIni >= 0 ? "+" : ""}{formatRupiah(financialMetrics.netBulanIni)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Surplus / Defisit bulan berjalan
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 4. CASH & BANK ACCOUNTS BREAKDOWN */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span>Posisi Saldo Tiap Akun Kas & Rekening</span>
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Rincian saldo terkini, akumulasi dana masuk dan keluar untuk setiap dompet kas.
                        </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="text-xs h-8">
                        <Link href="/admin/kas">
                            <span>Kelola Akun Kas</span>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.accounts.map((acc) => (
                        <Card key={acc.id} className="border-border shadow-xs hover:border-emerald-500/40 transition-all">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <CardTitle className="text-base font-semibold text-foreground">
                                        {acc.nama}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {acc.transaksiCount} riwayat mutasi tercatat
                                    </CardDescription>
                                </div>
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-2xl font-bold tracking-tight text-foreground">
                                    {formatRupiah(acc.saldoTerkini)}
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                                    <div className="space-y-0.5">
                                        <div className="text-muted-foreground text-[11px] flex items-center gap-1">
                                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                            Total Masuk
                                        </div>
                                        <div className="font-semibold text-emerald-700 dark:text-emerald-300">
                                            {formatRupiah(acc.totalPemasukan)}
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-muted-foreground text-[11px] flex items-center gap-1">
                                            <ArrowDownRight className="w-3 h-3 text-red-500" />
                                            Total Keluar
                                        </div>
                                        <div className="font-semibold text-red-700 dark:text-red-300">
                                            {formatRupiah(acc.totalPengeluaran)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* 5. 6-MONTH CASHFLOW & RECENT TRANSACTIONS (2-COLUMNS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 6-Month Cashflow Summary */}
                <div className="lg:col-span-6 space-y-4">
                    <Card className="border-border shadow-xs h-full flex flex-col justify-between">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Ringkasan Arus Kas (6 Bulan Terakhir)</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Perbandingan total pemasukan dan pengeluaran tiap bulan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.monthlyCashflow.map((m) => (
                                <div key={m.monthLabel} className="p-3 rounded-xl border bg-card/60 flex items-center justify-between gap-3 text-xs">
                                    <div className="space-y-0.5">
                                        <div className="font-semibold text-foreground">{m.monthLabel}</div>
                                        <div className="text-muted-foreground text-[11px] flex items-center gap-3">
                                            <span className="text-emerald-600 dark:text-emerald-400">+{formatRupiah(m.pemasukan)}</span>
                                            <span className="text-red-600 dark:text-red-400">-{formatRupiah(m.pengeluaran)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-muted-foreground uppercase">Net</div>
                                        <div className={cn("font-semibold text-sm", m.net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                                            {m.net >= 0 ? "+" : ""}{formatRupiah(m.net)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* 10 Recent Transactions */}
                <div className="lg:col-span-6 space-y-4">
                    <Card className="border-border shadow-xs h-full flex flex-col justify-between">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-primary" />
                                    <span>Transaksi Terbaru</span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    10 catatan pemasukan dan pengeluaran terakhir.
                                </CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                                <Link href="/admin/transaksi">
                                    <span>Lihat Semua</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {data.recentTransactions.length === 0 ? (
                                <div className="py-8 text-center text-xs text-muted-foreground">
                                    Belum ada transaksi yang tercatat.
                                </div>
                            ) : (
                                <div className="divide-y text-xs max-h-[380px] overflow-y-auto pr-1">
                                    {data.recentTransactions.map((t) => (
                                        <div key={t.id} className="py-2.5 flex items-center justify-between gap-3">
                                            <div className="space-y-0.5 min-w-0">
                                                <div className="font-semibold text-foreground truncate">
                                                    {t.keterangan || "Tanpa Keterangan"}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {t.kasNama} • {t.tanggalFormatted}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0 space-y-1">
                                                <div className={cn("font-bold font-mono text-sm", t.jenisTransaksi === "PEMASUKAN" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                                                    {t.jenisTransaksi === "PEMASUKAN" ? "+" : "-"}{formatRupiah(t.nominal)}
                                                </div>
                                                <Badge
                                                    variant={t.jenisTransaksi === "PEMASUKAN" ? "outline" : "secondary"}
                                                    className="text-[10px] px-1 py-0 uppercase"
                                                >
                                                    {t.jenisTransaksi}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 6. PERMISSION & FAST NAVIGATION SHORTCUTS */}
            <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Pintasan Menu & Wewenang Bendahara
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                        <Link href="/admin/transaksi/new">
                            <PlusCircle className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                            <span>Catat Transaksi</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                        <Link href="/admin/kas">
                            <Landmark className="w-3.5 h-3.5 mr-2 text-primary" />
                            <span>Kelola Kas & Bank</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                        <Link href="/admin/anggota">
                            <Users className="w-3.5 h-3.5 mr-2 text-sky-600" />
                            <span>Data Anggota (Lihat)</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                        <Link href="/admin/hpdt">
                            <BookOpen className="w-3.5 h-3.5 mr-2 text-indigo-600" />
                            <span>HPDT Doa & Pemerhati</span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
