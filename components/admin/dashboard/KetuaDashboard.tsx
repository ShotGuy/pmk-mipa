"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    ShieldCheck,
    Calendar,
    Users,
    HeartHandshake,
    AlertCircle,
    CheckCircle2,
    Clock,
    Wallet,
    BookOpenCheck,
    CalendarDays,
    ArrowUpRight,
    Sun,
    Moon,
    Church,
    BookOpen,
    Loader2,
    Activity,
    Layers,
    Sparkles,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { KetuaDashboardData, quickSaveTodayHPDT } from "@/actions/dashboard"
import { cn } from "@/lib/utils"

interface KetuaDashboardProps {
    data: KetuaDashboardData
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function KetuaDashboard({ data }: KetuaDashboardProps) {
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

    return (
        <div className="space-y-8 pb-10">
            {/* 1. HERO HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 text-white p-6 md:p-8 shadow-xl border border-indigo-800/40">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <Badge className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/30 text-xs px-3 py-1 backdrop-blur-md">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
                                Ketua PMK MIPA • Pengontrol Utama
                            </Badge>
                            <span className="text-xs text-indigo-200/80 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {data.currentDateFormatted}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span>{data.timeGreeting}, {data.firstName}!</span>
                            <span className="text-xl">👑</span>
                        </h1>

                        <p className="text-sm text-indigo-100/80 leading-relaxed">
                            Pusat audit dan evaluasi organisasi. Pantau seluruh dinamika kelompok pemuridan (KTB), kedisiplinan rohani badan pengurus, dan kelancaran program pelayanan PMK MIPA.
                        </p>
                    </div>

                    {/* Quick navigation to HPDT */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            <Link href="/admin/hpdt/new">
                                <BookOpen className="w-4 h-4 mr-2" />
                                <span>Input HPDT Sendiri</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white">
                            <Link href="/admin/pengontrolan">
                                <BookOpenCheck className="w-4 h-4 mr-2" />
                                <span>Riwayat Kontrol</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. TODAY HPDT QUICK ENTRY */}
            <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-50/50 via-background to-indigo-50/30 dark:from-emerald-950/20 dark:via-card dark:to-indigo-950/20 shadow-xs">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Refleksi & HPDT Pribadi Anda Hari Ini</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Sebagai pemimpin, integritas rohani pribadi adalah teladan utama bagi seluruh pengurus dan jemaat.
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

            {/* 3. MACRO METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total Anggota PMK
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                            <Users className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {data.metrics.totalAnggota}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.metrics.totalBadanPengurus} Pengurus Aktif
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Kelompok KTB Aktif
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <HeartHandshake className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <span>{data.metrics.totalKTBAktif}</span>
                            {data.metrics.ktbMacetAtauVakum > 0 && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                                    {data.metrics.ktbMacetAtauVakum} Perhatian
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Dari total {data.ktbHealth.totalKTB} kelompok terdaftar
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Kontrol Bulan Ini
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                            <BookOpenCheck className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {data.metrics.pengontrolanBulanIni}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Jurnal pendampingan tercatat bulan ini
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Saldo Kas PMK
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                            <Wallet className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold tracking-tight text-foreground truncate">
                            {formatRupiah(data.metrics.totalSaldoKas)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Akumulasi seluruh akun kas & rekening
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 4. MAIN AUDIT / CONTROL SECTION (2-COLUMNS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: KTB Attention List & Health Status */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Attention List Alert Card */}
                    <Card className="border-border shadow-xs">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        <span>KTB Membutuhkan Perhatian / Belum Terkontrol</span>
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Kelompok KTB yang berstatus Vakum/Macet atau belum mendapatkan kunjungan pengontrolan lebih dari 2 minggu.
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {data.ktbHealth.attentionList.length} Kelompok
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {data.ktbHealth.attentionList.length === 0 ? (
                                <div className="py-8 text-center space-y-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                                    <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                                        Puji Tuhan! Seluruh KTB Terkontrol Baik
                                    </div>
                                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                        Tidak ada kelompok KTB yang macet, vakum, atau tertinggal jadwal pengontrolannya.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                                    {data.ktbHealth.attentionList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-3 rounded-xl border bg-card/60 hover:bg-accent/40 transition-colors flex items-start justify-between gap-3 text-xs"
                                        >
                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm text-foreground truncate">
                                                        {item.nama}
                                                    </span>
                                                    <Badge
                                                        variant={item.status === "AKTIF" ? "outline" : "destructive"}
                                                        className="text-[10px] px-1.5 py-0 uppercase"
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    Pemimpin: <strong>{item.pemimpinNama}</strong> • Pendamping: <strong>{item.pendampingNama}</strong>
                                                </div>
                                                <div className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {item.lastControlledDate
                                                            ? `Terakhir dikontrol: ${item.lastControlledDate} (${item.daysSinceLastControl} hari lalu)`
                                                            : "Belum pernah dicatat pengontrolan"}
                                                    </span>
                                                </div>
                                                {item.keterangan && (
                                                    <div className="text-[11px] text-muted-foreground italic truncate">
                                                        &ldquo;{item.keterangan}&rdquo;
                                                    </div>
                                                )}
                                            </div>

                                            <Button asChild variant="ghost" size="sm" className="h-7 text-xs shrink-0">
                                                <Link href={`/admin/ktb/${item.id}`}>
                                                    <span>Detail</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Pengontrolan Activity */}
                    <Card className="border-border shadow-xs">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary" />
                                    <span>Jurnal Pengontrolan Terkini</span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Catatan monitoring terbaru yang diinputkan oleh tim Badan Pengurus KTB.
                                </CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                                <Link href="/admin/pengontrolan">
                                    <span>Lihat Semua</span>
                                    <ArrowUpRight className="w-3 h-3 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {data.recentPengontrolan.length === 0 ? (
                                <div className="py-6 text-center text-xs text-muted-foreground">
                                    Belum ada catatan pengontrolan yang tersimpan.
                                </div>
                            ) : (
                                <div className="divide-y text-xs">
                                    {data.recentPengontrolan.map((p) => (
                                        <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                                            <div className="min-w-0 space-y-0.5">
                                                <div className="font-semibold text-foreground truncate">
                                                    {p.ktbNama}
                                                </div>
                                                <div className="text-muted-foreground text-[11px]">
                                                    Pendamping: {p.pendampingNama} • Pemimpin: {p.pemimpinNama}
                                                </div>
                                                {p.bahan && (
                                                    <div className="text-[11px] text-primary/80 truncate">
                                                        Bahan: {p.bahan}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0 space-y-1">
                                                <Badge
                                                    variant={p.status === "AKTIF" ? "outline" : "secondary"}
                                                    className="text-[10px] px-1.5 py-0"
                                                >
                                                    {p.status}
                                                </Badge>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {p.tanggalFormatted}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Division Spiritual Health (HPDT) & Breakdown */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Division HPDT Performance */}
                    <Card className="border-border shadow-xs">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Kedisiplinan Rohani Per Seksi (Bulan Ini)</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Rata-rata persentase kehadiran saat teduh dan doa pribadi pengurus bulan ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.divisionHpdtCompliance.map((div) => (
                                <div key={div.division} className="p-3.5 rounded-xl border bg-card/60 space-y-2.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-foreground">{div.division}</span>
                                        <Badge variant="outline" className="text-[10px]">
                                            {div.totalPengurus} Pengurus
                                        </Badge>
                                    </div>

                                    {/* Saat Teduh Progress */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Sun className="w-3 h-3 text-amber-500" />
                                                Saat Teduh
                                            </span>
                                            <span className="font-mono font-medium">{div.avgSate}%</span>
                                        </div>
                                        <Progress value={div.avgSate} className="h-1.5" />
                                    </div>

                                    {/* Doa Progress */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Moon className="w-3 h-3 text-indigo-500" />
                                                Doa Pribadi
                                            </span>
                                            <span className="font-mono font-medium">{div.avgDoa}%</span>
                                        </div>
                                        <Progress value={div.avgDoa} className="h-1.5" />
                                    </div>
                                </div>
                            ))}

                            <Button asChild variant="outline" size="sm" className="w-full text-xs mt-2">
                                <Link href="/admin/hpdt">
                                    <span>Buka Rekapitulasi Lengkap HPDT</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Fast Navigation Quick Links */}
                    <Card className="border-border shadow-xs">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Pintasan Menu Audit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                                <Link href="/admin/anggota">
                                    <Users className="w-3.5 h-3.5 mr-2 text-primary" />
                                    <span>Data Anggota</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                                <Link href="/admin/ktb">
                                    <HeartHandshake className="w-3.5 h-3.5 mr-2 text-primary" />
                                    <span>Kelompok KTB</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                                <Link href="/admin/kas">
                                    <Wallet className="w-3.5 h-3.5 mr-2 text-primary" />
                                    <span>Kas Keuangan</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                                <Link href="/admin/kegiatan">
                                    <CalendarDays className="w-3.5 h-3.5 mr-2 text-primary" />
                                    <span>Jadwal Kegiatan</span>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
