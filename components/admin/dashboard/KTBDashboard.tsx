"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    Sparkles,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    BookOpen,
    Users,
    PlusCircle,
    HeartHandshake,
    ShieldCheck,
    Calendar,
    Church,
    Moon,
    Sun,
    Loader2,
    Check,
    HelpCircle,
    TrendingUp,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { KTBDashboardData, quickSaveTodayHPDT } from "@/actions/dashboard"
import { cn } from "@/lib/utils"

interface KTBDashboardProps {
    data: KTBDashboardData
}

export function KTBDashboard({ data }: KTBDashboardProps) {
    const [isPendingHpdt, startHpdtTransition] = React.useTransition()

    // Interactive state for today's HPDT widget
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

    const isKoordinator = data.role === "KOORKTB"

    return (
        <div className="space-y-8 pb-10">
            {/* 1. HERO PERSONAL HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-sky-900 text-white p-6 md:p-8 shadow-xl border border-indigo-700/50">
                {/* Background decorative glows */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <Badge className="bg-indigo-500/30 hover:bg-indigo-500/40 text-sky-200 border-indigo-400/30 text-xs px-3 py-1 backdrop-blur-md">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-sky-300" />
                                {isKoordinator ? "Koordinator Seksi KTB" : "Anggota Seksi KTB"}
                            </Badge>
                            <span className="text-xs text-indigo-200/80 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {data.currentDateFormatted}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span>Shalom, {data.firstName}!</span>
                            <span className="text-xl">✨</span>
                        </h1>

                        <p className="text-sm text-indigo-100/85 leading-relaxed">
                            {isKoordinator
                                ? `Selamat melayani! Anda memiliki wewenang penuh mengelola data seluruh kelompok KTB, mengontrol pertumbuhan anggota, serta memantau kedisiplinan rohani tim KTB.`
                                : `Selamat melayani! Anda bertugas mendampingi dan mengontrol kelompok KTB binaan Anda serta memelihara saat teduh dan doa pribadi Anda setiap hari.`}
                        </p>
                    </div>

                    {/* Quick Navigation Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            asChild
                            className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-md font-medium text-xs md:text-sm h-10 gap-2"
                        >
                            <Link href="/admin/pengontrolan">
                                <PlusCircle className="w-4 h-4 text-indigo-600" />
                                <span>Input Pengontrolan</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="bg-indigo-950/40 border-indigo-400/30 hover:bg-indigo-900/60 text-white font-medium text-xs md:text-sm h-10 gap-2 backdrop-blur-sm"
                        >
                            <Link href="/admin/hpdt">
                                <BookOpen className="w-4 h-4 text-sky-300" />
                                <span>Catatan HPDT</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="bg-indigo-950/40 border-indigo-400/30 hover:bg-indigo-900/60 text-white font-medium text-xs md:text-sm h-10 gap-2 backdrop-blur-sm"
                        >
                            <Link href="/admin/ktb">
                                <Users className="w-4 h-4 text-sky-300" />
                                <span>Daftar KTB</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. TOP ACTION ROW: QUICK HPDT CHECKLIST & PENGONTROLAN REMINDER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* WIDGET A: QUICK HPDT HARI INI (5 cols on lg) */}
                <Card className="lg:col-span-5 border shadow-sm flex flex-col justify-between bg-card/60 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                    <Sun className="w-4 h-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">HPDT Hari Ini</CardTitle>
                                    <CardDescription className="text-xs">
                                        Persekutuan pribadi dengan Tuhan hari ini
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge
                                variant={hasSaved ? "default" : "outline"}
                                className={cn(
                                    "text-xs font-normal",
                                    hasSaved
                                        ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                                        : "text-amber-600 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40"
                                )}
                            >
                                {hasSaved ? "Tercatat" : "Belum Tersimpan"}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setIsSate(!isSate)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                    isSate
                                        ? "border-amber-500/60 bg-amber-500/10 dark:bg-amber-950/20"
                                        : "border-border bg-background/50 hover:bg-accent/40"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0",
                                        isSate
                                            ? "bg-amber-500 border-amber-500 text-white"
                                            : "border-muted-foreground/40 bg-background"
                                    )}
                                >
                                    {isSate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <div className="flex flex-col text-xs">
                                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                                        Saat Teduh
                                    </span>
                                    <span className="text-muted-foreground text-[11px]">Merenungkan Firman</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsDoa(!isDoa)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                    isDoa
                                        ? "border-indigo-500/60 bg-indigo-500/10 dark:bg-indigo-950/20"
                                        : "border-border bg-background/50 hover:bg-accent/40"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0",
                                        isDoa
                                            ? "bg-indigo-500 border-indigo-500 text-white"
                                            : "border-muted-foreground/40 bg-background"
                                    )}
                                >
                                    {isDoa && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <div className="flex flex-col text-xs">
                                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                                        <Moon className="w-3.5 h-3.5 text-indigo-500" />
                                        Doa Malam
                                    </span>
                                    <span className="text-muted-foreground text-[11px]">Doa harian pribadi</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsAttendedKTB(!isAttendedKTB)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                    isAttendedKTB
                                        ? "border-purple-500/60 bg-purple-500/10 dark:bg-purple-950/20"
                                        : "border-border bg-background/50 hover:bg-accent/40"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0",
                                        isAttendedKTB
                                            ? "bg-purple-500 border-purple-500 text-white"
                                            : "border-muted-foreground/40 bg-background"
                                    )}
                                >
                                    {isAttendedKTB && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <div className="flex flex-col text-xs">
                                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                                        <HeartHandshake className="w-3.5 h-3.5 text-purple-500" />
                                        Pertemuan KTB
                                    </span>
                                    <span className="text-muted-foreground text-[11px]">Ada KTB hari ini</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsGereja(!isGereja)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                    isGereja
                                        ? "border-blue-500/60 bg-blue-500/10 dark:bg-blue-950/20"
                                        : "border-border bg-background/50 hover:bg-accent/40"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0",
                                        isGereja
                                            ? "bg-blue-500 border-blue-500 text-white"
                                            : "border-muted-foreground/40 bg-background"
                                    )}
                                >
                                    {isGereja && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <div className="flex flex-col text-xs">
                                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                                        <Church className="w-3.5 h-3.5 text-blue-500" />
                                        Ibadah Gereja
                                    </span>
                                    <span className="text-muted-foreground text-[11px]">Ibadah hari Minggu</span>
                                </div>
                            </button>
                        </div>

                        {/* Monthly summary pill badges */}
                        <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-muted/40 border">
                            <span className="text-muted-foreground">Kepatuhan Anda Bulan Ini:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-amber-700 dark:text-amber-400">
                                    Sate {data.hpdtMonthlyStats.satePercentage}%
                                </span>
                                <span>•</span>
                                <span className="font-medium text-indigo-700 dark:text-indigo-400">
                                    Doa {data.hpdtMonthlyStats.doaPercentage}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-xs text-muted-foreground hover:text-foreground h-8"
                            >
                                <Link href="/admin/hpdt/new">
                                    <span>Tulis Renungan & Ayat</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                                </Link>
                            </Button>

                            <Button
                                size="sm"
                                onClick={handleSaveHpdt}
                                disabled={isPendingHpdt}
                                className="h-8 text-xs gap-1.5 px-4 bg-primary text-primary-foreground"
                            >
                                {isPendingHpdt ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Simpan Checklist</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* WIDGET B: REMINDER KELOMPOK KTB YANG BELUM DIKONTROL BULAN INI (7 cols on lg) */}
                <Card className="lg:col-span-7 border shadow-sm flex flex-col justify-between bg-card/60 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">
                                        Pengingat Pengontrolan Bulan Ini
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {isKoordinator
                                            ? "Pantau kelompok KTB di PMK MIPA yang belum dikontrol bulan ini"
                                            : "Kelompok KTB yang Anda bimbing yang belum memiliki catatan kontrol bulan ini"}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge
                                variant={data.uncontrolledKTBs.length === 0 ? "default" : "destructive"}
                                className={cn(
                                    "text-xs font-normal",
                                    data.uncontrolledKTBs.length === 0 && "bg-emerald-600 hover:bg-emerald-600"
                                )}
                            >
                                {data.uncontrolledKTBs.length === 0
                                    ? "Semua Selesai Dikontrol"
                                    : `${data.uncontrolledKTBs.length} Perlu Dikontrol`}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Progress Bar Kepatuhan */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    Terkontrol:{" "}
                                    <strong className="text-foreground">
                                        {data.ktbMetrics.controlledThisMonthCount}
                                    </strong>{" "}
                                    dari {data.ktbMetrics.totalKTBAktif} kelompok aktif
                                </span>
                                <span className="font-semibold text-foreground">
                                    {data.ktbMetrics.complianceRate}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(data.ktbMetrics.complianceRate, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* List Kelompok Belum Dikontrol */}
                        {data.uncontrolledKTBs.length === 0 ? (
                            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <div className="text-xs">
                                    <p className="font-semibold">Luar biasa! Target pengontrolan tercapai.</p>
                                    <p className="opacity-90">
                                        Seluruh kelompok KTB aktif telah dikontrol pada bulan ini.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                                {data.uncontrolledKTBs.map((ktb) => (
                                    <div
                                        key={ktb.id}
                                        className="p-3 rounded-xl border bg-background/60 hover:bg-accent/30 transition-colors flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-foreground truncate">
                                                    {ktb.nama}
                                                </span>
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                                    Angkatan {ktb.angkatan}
                                                </Badge>
                                            </div>
                                            <div className="text-muted-foreground text-[11px] flex items-center gap-2">
                                                <span>Pemimpin: {ktb.pemimpinNama}</span>
                                                <span>•</span>
                                                <span>Pendamping: {ktb.pendampingNama}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[11px] text-muted-foreground hidden sm:inline">
                                                {ktb.lastControlledFormatted
                                                    ? `Terakhir: ${ktb.lastControlledFormatted}`
                                                    : "Belum pernah dikontrol"}
                                            </span>
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="h-7 text-xs px-2.5 hover:border-primary"
                                            >
                                                <Link href="/admin/pengontrolan">
                                                    <span>Kontrol</span>
                                                    <ArrowUpRight className="w-3 h-3 ml-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-1 flex items-center justify-end">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground h-8"
                            >
                                <Link href="/admin/pengontrolan">
                                    <span>Lihat Semua Riwayat Pengontrolan</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. METRIC KPI CARDS (SCOPED) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            {isKoordinator ? "Total Kelompok KTB" : "Kelompok KTB Binaan"}
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                            <Users className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {data.ktbMetrics.totalKTB}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {isKoordinator ? "Seluruh PMK MIPA" : "Kelompok yang Anda dampingi"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Kelompok KTB Aktif
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {data.ktbMetrics.totalKTBAktif}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.ktbMetrics.totalKTBMerger > 0
                                ? `${data.ktbMetrics.totalKTBMerger} kelompok merger`
                                : "Berjalan aktif & mandiri"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Total Anggota KTB
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                            <HeartHandshake className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {data.ktbMetrics.totalAnggotaKTB}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {isKoordinator ? "Jemaat tergabung dalam KTB" : "Anggota di kelompok binaan Anda"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Kepatuhan Kontrol Bulan Ini
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {data.ktbMetrics.complianceRate}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.ktbMetrics.controlledThisMonthCount} dari {data.ktbMetrics.totalKTB} kelompok selesai
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 4. SPECIAL SECTION FOR KOORDINATOR KTB: MONITORING HPDT ANGGOTA TIM */}
            {isKoordinator && data.teamHpdtToday && (
                <Card className="border shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    <span>Monitoring Kepatuhan HPDT Tim Seksi KTB Hari Ini</span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Pantau kedisiplinan persekutuan pribadi anggota seksi KTB Anda
                                </CardDescription>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs hover:border-primary gap-1.5"
                            >
                                <Link href="/admin/hpdt">
                                    <span>Lihat Tab Monitoring HPDT</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {data.teamHpdtToday.map((member) => (
                                <div
                                    key={member.idPengurus}
                                    className="p-3.5 rounded-xl border bg-background/60 flex items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-1 min-w-0">
                                        <p className="font-semibold text-foreground truncate">{member.nama}</p>
                                        <p className="text-[11px] text-muted-foreground">{member.jabatan}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {member.isFilledToday ? (
                                            <div className="flex items-center gap-1">
                                                <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5">
                                                    Sudah Isi
                                                </Badge>
                                                {member.isSate && (
                                                    <span
                                                        title="Saat Teduh"
                                                        className="p-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700"
                                                    >
                                                        <Sun className="w-3 h-3" />
                                                    </span>
                                                )}
                                                {member.isDoa && (
                                                    <span
                                                        title="Doa Malam"
                                                        className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700"
                                                    >
                                                        <Moon className="w-3 h-3" />
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="text-amber-600 border-amber-300 dark:border-amber-800 text-[10px] px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30">
                                                Belum Isi
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 5. AKTIVITAS PENGONTROLAN TERAKHIR */}
            <Card className="border shadow-sm bg-card/60 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-base font-semibold">
                                Riwayat Evaluasi Pengontrolan Terkini
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {isKoordinator
                                    ? "Catatan evaluasi perkembangan kelompok KTB terbaru di PMK MIPA"
                                    : "Catatan evaluasi terbaru dari kelompok KTB yang Anda dampingi"}
                            </CardDescription>
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs hover:border-primary gap-1.5"
                        >
                            <Link href="/admin/pengontrolan">
                                <span>Buka Halaman Pengontrolan</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {data.recentPengontrolan.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-xs">
                            Belum ada riwayat pengontrolan KTB yang dicatat.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.recentPengontrolan.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3.5 rounded-xl border bg-background/50 hover:bg-card transition-colors space-y-2 text-xs"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-foreground">
                                                {item.ktbNama}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px] px-2 py-0.5",
                                                    item.status === "AKTIF" &&
                                                        "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300",
                                                    (item.status === "MACET" || item.status === "VAKUM") &&
                                                        "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300",
                                                    item.status === "MERGER" &&
                                                        "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300"
                                                )}
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <span className="text-muted-foreground text-[11px]">
                                            {item.tanggalFormatted}
                                        </span>
                                    </div>

                                    <div className="text-muted-foreground text-[11px] flex items-center gap-3">
                                        <span>Pemimpin: <strong className="text-foreground">{item.pemimpinNama}</strong></span>
                                        <span>•</span>
                                        <span>Pendamping: <strong className="text-foreground">{item.pendampingNama}</strong></span>
                                    </div>

                                    {item.bahan && (
                                        <p className="text-xs text-foreground/90 bg-muted/30 p-2 rounded-lg">
                                            <span className="font-medium text-muted-foreground">Bahan: </span>
                                            {item.bahan}
                                        </p>
                                    )}

                                    {item.keterangan && (
                                        <p className="text-[11px] text-muted-foreground italic">
                                            Catatan: {item.keterangan}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
