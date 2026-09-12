"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    HeartHandshake,
    Users,
    UserCheck,
    Cake,
    Calendar,
    Phone,
    MessageCircle,
    UserPlus,
    UserCog,
    BookOpen,
    ShieldCheck,
    Search,
    Sun,
    Moon,
    Church,
    GraduationCap,
    ArrowUpRight,
    CheckCircle2,
    Loader2,
    CalendarDays,
    SlidersHorizontal,
    Layers,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { DoaDashboardData, quickSaveTodayHPDT } from "@/actions/dashboard"

interface DoaDashboardProps {
    data: DoaDashboardData
}

type BirthdayFilterType = "today" | "week" | "month" | "custom" | "all"

export function DoaDashboard({ data }: DoaDashboardProps) {
    const [isPendingHpdt, startHpdtTransition] = React.useTransition()

    const [isSate, setIsSate] = React.useState(data.todayHpdt.isSate)
    const [isDoa, setIsDoa] = React.useState(data.todayHpdt.isDoa)
    const [isAttendedKTB, setIsAttendedKTB] = React.useState(data.todayHpdt.isAttendedKTB)
    const [isGereja, setIsGereja] = React.useState(data.todayHpdt.isGereja)
    const [hasSaved, setHasSaved] = React.useState(data.todayHpdt.isFilled)

    // Birthday filter & search state
    const [bdayFilter, setBdayFilter] = React.useState<BirthdayFilterType>("week")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [customStartMonth, setCustomStartMonth] = React.useState<number>(new Date().getMonth() + 1)
    const [customEndMonth, setCustomEndMonth] = React.useState<number>(new Date().getMonth() + 1)
    const [customStartDay, setCustomStartDay] = React.useState<number>(1)
    const [customEndDay, setCustomEndDay] = React.useState<number>(31)

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

    const { metrics, birthdayMembers, prodiDistribution, angkatanDistribution, ageDemographics, pengurusDivisionStats } = data

    // Helper WhatsApp link
    const getWhatsAppUrl = (phone: string | null | undefined, name: string, turningAge: number) => {
        if (!phone) return null
        let clean = phone.replace(/[^0-9]/g, "")
        if (clean.startsWith("0")) {
            clean = "62" + clean.slice(1)
        } else if (clean.startsWith("8")) {
            clean = "628" + clean.slice(1)
        }
        const message = `Syalom ${name}! 🎂✨\n\nSelamat ulang tahun yang ke-${turningAge}!\nKiranya berkat sukacita, kesehatan, dan penyertaan Tuhan Yesus senantiasa melimpah dalam langkah studi dan pelayananmu.\n\n"Tuhan memberkati engkau dan melindungi engkau; Tuhan menyinari engkau dengan wajah-Nya dan memberi engkau kasih karunia." (Bilangan 6:24-25)\n\nSalam hangat & doa dari Seksi Doa & Pemerhati PMK MIPA 🕊️`
        return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
    }

    // Filter birthday members
    const filteredBirthdays = React.useMemo(() => {
        const currentMonth = new Date().getMonth() + 1

        return birthdayMembers.filter((item) => {
            // Text Search matching
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchName = item.nama.toLowerCase().includes(q)
                const matchProdi = item.prodi?.toLowerCase().includes(q)
                const matchAngkatan = String(item.angkatan || "").includes(q)
                if (!matchName && !matchProdi && !matchAngkatan) return false
            }

            // Tab / category filter
            if (bdayFilter === "today") {
                return item.daysUntilBirthday === 0
            }
            if (bdayFilter === "week") {
                return item.daysUntilBirthday <= 7
            }
            if (bdayFilter === "month") {
                return item.birthMonth === currentMonth
            }
            if (bdayFilter === "custom") {
                // Check if (birthMonth, birthDay) is in [startMonth/startDay, endMonth/endDay]
                const val = item.birthMonth * 100 + item.birthDay
                const startVal = customStartMonth * 100 + customStartDay
                const endVal = customEndMonth * 100 + customEndDay

                if (startVal <= endVal) {
                    return val >= startVal && val <= endVal
                } else {
                    // wraps around year end (e.g. Nov to Feb)
                    return val >= startVal || val <= endVal
                }
            }
            return true // "all"
        })
    }, [birthdayMembers, bdayFilter, searchQuery, customStartMonth, customEndMonth, customStartDay, customEndDay])

    const todayBirthdaysCount = React.useMemo(
        () => birthdayMembers.filter((m) => m.daysUntilBirthday === 0).length,
        [birthdayMembers]
    )
    const weekBirthdaysCount = React.useMemo(
        () => birthdayMembers.filter((m) => m.daysUntilBirthday <= 7).length,
        [birthdayMembers]
    )

    const MONTH_NAMES = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ]

    return (
        <div className="space-y-8 pb-10">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600/15 via-pink-500/10 to-amber-500/5 border border-rose-500/20 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <Badge
                                variant="secondary"
                                className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 px-3 py-1 text-xs font-semibold"
                            >
                                <HeartHandshake className="w-3.5 h-3.5 mr-1 text-rose-500" />
                                {data.roleLabel}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {data.currentDateFormatted}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            {data.greeting} 👋
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-2xl">
                            Pusat pelayanan pastoral, pemantauan jemaat, struktur kepengurusan, dan pengingat doa serta ulang tahun anggota PMK MIPA.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild size="sm" className="bg-rose-600 hover:bg-rose-700 text-white gap-2 shadow-sm">
                            <Link href="/admin/anggota/new">
                                <UserPlus className="w-4 h-4" />
                                <span>Tambah Anggota</span>
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="gap-2">
                            <Link href="/admin/badan-pengurus">
                                <UserCog className="w-4 h-4 text-rose-600" />
                                <span>Badan Pengurus</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Checklist HPDT Pribadi Hari Ini */}
            <Card className="border-rose-500/20 bg-card/60 backdrop-blur">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-rose-600" />
                                <CardTitle className="text-base font-semibold">
                                    Catatan HPDT Pribadi Hari Ini
                                </CardTitle>
                                {hasSaved && (
                                    <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                        Sudah Tercatat
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-xs">
                                Komitmen Saat Teduh dan Doa pribadi bulan ini:{" "}
                                <span className="font-semibold text-foreground">
                                    Saat Teduh {data.todayHpdt.satePercentage}% ({data.todayHpdt.sateCount}/{data.todayHpdt.elapsedDays} hari)
                                </span>{" "}
                                •{" "}
                                <span className="font-semibold text-foreground">
                                    Doa {data.todayHpdt.doaPercentage}% ({data.todayHpdt.doaCount}/{data.todayHpdt.elapsedDays} hari)
                                </span>
                            </CardDescription>
                        </div>

                        <Button
                            size="sm"
                            onClick={handleSaveHpdt}
                            disabled={isPendingHpdt}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8 gap-1.5 shadow-sm"
                        >
                            {isPendingHpdt ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Simpan HPDT
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <label
                            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                isSate
                                    ? "bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200"
                                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-muted-foreground"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isSate}
                                onChange={(e) => setIsSate(e.target.checked)}
                                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                            />
                            <div className="flex items-center gap-1.5">
                                <Sun className={`w-4 h-4 ${isSate ? "text-amber-500" : "text-muted-foreground"}`} />
                                <span className="text-xs font-semibold">Saat Teduh</span>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                isDoa
                                    ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-900 dark:text-indigo-200"
                                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-muted-foreground"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isDoa}
                                onChange={(e) => setIsDoa(e.target.checked)}
                                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                            />
                            <div className="flex items-center gap-1.5">
                                <Moon className={`w-4 h-4 ${isDoa ? "text-indigo-500" : "text-muted-foreground"}`} />
                                <span className="text-xs font-semibold">Doa Pribadi</span>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                isAttendedKTB
                                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200"
                                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-muted-foreground"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isAttendedKTB}
                                onChange={(e) => setIsAttendedKTB(e.target.checked)}
                                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                            />
                            <div className="flex items-center gap-1.5">
                                <BookOpen className={`w-4 h-4 ${isAttendedKTB ? "text-emerald-500" : "text-muted-foreground"}`} />
                                <span className="text-xs font-semibold">Kelompok KTB</span>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                isGereja
                                    ? "bg-blue-500/10 border-blue-500/40 text-blue-900 dark:text-blue-200"
                                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-muted-foreground"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isGereja}
                                onChange={(e) => setIsGereja(e.target.checked)}
                                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                            />
                            <div className="flex items-center gap-1.5">
                                <Church className={`w-4 h-4 ${isGereja ? "text-blue-500" : "text-muted-foreground"}`} />
                                <span className="text-xs font-semibold">Ibadah Gereja</span>
                            </div>
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* 4 Kartu KPI Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Anggota Jemaat */}
                <Card className="border-border/60 shadow-xs hover:border-rose-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Total Anggota Jemaat
                        </CardTitle>
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600">
                            <Users className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalAnggota}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20 px-1.5 py-0">
                                {metrics.totalLakiLaki} L
                            </Badge>
                            <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-600 border-rose-500/20 px-1.5 py-0">
                                {metrics.totalPerempuan} P
                            </Badge>
                            <span className="text-[11px] text-muted-foreground ml-auto">
                                Terdata di database
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Total Badan Pengurus */}
                <Card className="border-border/60 shadow-xs hover:border-purple-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Badan Pengurus Aktif
                        </CardTitle>
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600">
                            <UserCheck className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalBadanPengurus}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                            <span>Rasio Pelayanan</span>
                            <span className="font-semibold text-foreground">
                                1 : {metrics.totalBadanPengurus > 0 ? Math.round(metrics.totalAnggota / metrics.totalBadanPengurus) : 0} jemaat
                            </span>
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Ulang Tahun Bulan Ini */}
                <Card className="border-border/60 shadow-xs hover:border-amber-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Ulang Tahun Bulan Ini
                        </CardTitle>
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                            <Cake className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {metrics.totalUlangTahunBulanIni}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            {todayBirthdaysCount > 0 ? (
                                <Badge className="bg-rose-500 text-white text-[10px] px-1.5 py-0 animate-pulse">
                                    {todayBirthdaysCount} Hari Ini! 🎂
                                </Badge>
                            ) : (
                                <span>{weekBirthdaysCount} orang dalam 7 hari ke depan</span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Kelengkapan Kontak */}
                <Card className="border-border/60 shadow-xs hover:border-emerald-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            Kelengkapan No. HP / WA
                        </CardTitle>
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                            <Phone className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.persenKontakLengkap}%</div>
                        <div className="space-y-1.5 mt-1">
                            <Progress value={metrics.persenKontakLengkap} className="h-1.5" />
                            <p className="text-[11px] text-muted-foreground text-right">
                                {metrics.kontakLengkapCount} dari {metrics.totalAnggota} nomor terisi
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* WIDGET INTERAKTIF PENGINGAT & FILTER ULANG TAHUN */}
            <Card className="border-rose-500/30 shadow-md bg-gradient-to-b from-card/80 to-card">
                <CardHeader className="border-b border-border/40 pb-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-rose-500/15 rounded-lg text-rose-600">
                                    <Cake className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-lg font-bold">
                                    Pengingat & Doa Ulang Tahun Jemaat
                                </CardTitle>
                                {todayBirthdaysCount > 0 && (
                                    <Badge className="bg-rose-500 hover:bg-rose-600 text-white text-xs">
                                        {todayBirthdaysCount} Hari Ini
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-xs">
                                Filter dan jangkau jemaat dengan ucapan selamat dan doa melalui WhatsApp secara langsung.
                            </CardDescription>
                        </div>

                        {/* Search & Tabs */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            <div className="relative min-w-[200px]">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama / prodi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 text-xs"
                                />
                            </div>

                            {/* Preset Filters */}
                            <div className="inline-flex rounded-lg border border-border/60 p-1 bg-muted/40 text-xs">
                                <button
                                    onClick={() => setBdayFilter("today")}
                                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                                        bdayFilter === "today"
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Hari Ini ({todayBirthdaysCount})
                                </button>
                                <button
                                    onClick={() => setBdayFilter("week")}
                                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                                        bdayFilter === "week"
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    7 Hari ({weekBirthdaysCount})
                                </button>
                                <button
                                    onClick={() => setBdayFilter("month")}
                                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                                        bdayFilter === "month"
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Bulan Ini ({metrics.totalUlangTahunBulanIni})
                                </button>
                                <button
                                    onClick={() => setBdayFilter("custom")}
                                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                                        bdayFilter === "custom"
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Kustom
                                </button>
                                <button
                                    onClick={() => setBdayFilter("all")}
                                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                                        bdayFilter === "all"
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Semua
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Rentang Tanggal Kustom Selector (if custom active) */}
                    {bdayFilter === "custom" && (
                        <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-border/60 flex flex-wrap items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
                                <span>Filter Rentang Hari & Bulan Kelahiran:</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Dari:</span>
                                <select
                                    value={customStartDay}
                                    onChange={(e) => setCustomStartDay(Number(e.target.value))}
                                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                                >
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                        <option key={d} value={d}>
                                            Tgl {d}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={customStartMonth}
                                    onChange={(e) => setCustomStartMonth(Number(e.target.value))}
                                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                                >
                                    {MONTH_NAMES.map((m, idx) => (
                                        <option key={idx} value={idx + 1}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Sampai:</span>
                                <select
                                    value={customEndDay}
                                    onChange={(e) => setCustomEndDay(Number(e.target.value))}
                                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                                >
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                        <option key={d} value={d}>
                                            Tgl {d}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={customEndMonth}
                                    onChange={(e) => setCustomEndMonth(Number(e.target.value))}
                                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                                >
                                    {MONTH_NAMES.map((m, idx) => (
                                        <option key={idx} value={idx + 1}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="pt-5">
                    {filteredBirthdays.length === 0 ? (
                        <div className="p-10 text-center space-y-2 border border-dashed rounded-xl">
                            <Cake className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                            <p className="text-sm font-semibold text-foreground">Tidak Ada Ulang Tahun</p>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                {bdayFilter === "today"
                                    ? "Tidak ada jemaat yang berulang tahun pada hari ini."
                                    : bdayFilter === "week"
                                    ? "Tidak ada jemaat yang berulang tahun dalam 7 hari ke depan."
                                    : "Tidak ditemukan jemaat yang sesuai dengan kriteria filter."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {filteredBirthdays.map((item) => {
                                const waUrl = getWhatsAppUrl(item.noHp, item.nama, item.turningAge)
                                const isToday = item.daysUntilBirthday === 0
                                const isTomorrow = item.daysUntilBirthday === 1

                                return (
                                    <div
                                        key={item.id}
                                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                                            isToday
                                                ? "bg-rose-500/10 border-rose-500/40 shadow-xs dark:bg-rose-950/20"
                                                : isTomorrow
                                                ? "bg-amber-500/5 border-amber-500/30"
                                                : "bg-muted/30 border-border/60 hover:border-border hover:bg-muted/50"
                                        }`}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                                            item.jenisKelamin === "P"
                                                                ? "bg-pink-500/20 text-pink-700 dark:text-pink-300"
                                                                : "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                                        }`}
                                                    >
                                                        {item.nama
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .slice(0, 2)
                                                            .join("")
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold leading-tight line-clamp-1">
                                                            {item.nama}
                                                        </h4>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {item.prodi || "Fakultas MIPA"} {item.angkatan ? `• ${item.angkatan}` : ""}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Countdown Badge */}
                                                {isToday ? (
                                                    <Badge className="bg-rose-600 text-white text-[10px] px-2 py-0.5 shrink-0 animate-pulse">
                                                        Hari Ini! 🎂
                                                    </Badge>
                                                ) : isTomorrow ? (
                                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] px-2 py-0.5 shrink-0">
                                                        Besok! 🎉
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 shrink-0 text-muted-foreground">
                                                        {item.daysUntilBirthday} hari lagi
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{item.birthdayFormatted}</span>
                                                </div>
                                                <span className="font-semibold text-rose-600 dark:text-rose-400">
                                                    Ke-{item.turningAge} tahun
                                                </span>
                                            </div>
                                        </div>

                                        {/* WA Button or Missing Phone Badge */}
                                        <div>
                                            {waUrl ? (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1.5 shadow-xs"
                                                >
                                                    <a href={waUrl} target="_blank" rel="noopener noreferrer">
                                                        <MessageCircle className="w-3.5 h-3.5" />
                                                        <span>Kirim Doa & Ucapan (WA)</span>
                                                    </a>
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-between p-1.5 px-2.5 rounded-md bg-muted/60 text-[11px] text-muted-foreground">
                                                    <span>No. WhatsApp belum diisi</span>
                                                    <Link
                                                        href={`/admin/anggota/${item.id}/edit`}
                                                        className="text-rose-600 dark:text-rose-400 font-medium hover:underline inline-flex items-center gap-0.5"
                                                    >
                                                        <span>Lengkapi</span>
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* SEBARAN BADAN PENGURUS & DEMOGRAFI JEMAAT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Komposisi Badan Pengurus */}
                <Card className="border-border/60">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <UserCog className="w-4 h-4 text-purple-600" />
                                    <CardTitle className="text-base font-semibold">
                                        Komposisi Badan Pengurus
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-xs">
                                    Distribusi personil pengurus aktif menurut seksi pelayanan
                                </CardDescription>
                            </div>
                            <Button asChild size="sm" variant="ghost" className="text-xs h-8 gap-1 text-purple-600">
                                <Link href="/admin/badan-pengurus">
                                    <span>Kelola</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {pengurusDivisionStats.map((item) => (
                            <div key={item.division} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-foreground">{item.division}</span>
                                    <span className="text-muted-foreground font-semibold">
                                        {item.count} orang ({item.percentage}%)
                                    </span>
                                </div>
                                <Progress value={item.percentage} className="h-2" />
                            </div>
                        ))}

                        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 mt-4 flex items-center justify-between">
                            <span>Total Pengurus Aktif Melayani:</span>
                            <span className="font-bold text-sm">{metrics.totalBadanPengurus} Orang</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Demografi Kelompok Usia */}
                <Card className="border-border/60">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-rose-600" />
                            <CardTitle className="text-base font-semibold">
                                Demografi Kelompok Usia Jemaat
                            </CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Rentang usia anggota PMK MIPA berdasarkan tanggal lahir
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ageDemographics.map((item) => (
                            <div key={item.bracket} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-foreground">{item.bracket}</span>
                                    <span className="text-muted-foreground font-semibold">
                                        {item.count} jemaat ({item.percentage}%)
                                    </span>
                                </div>
                                <Progress value={item.percentage} className="h-2" />
                            </div>
                        ))}

                        <div className="pt-2 text-xs text-muted-foreground flex items-center justify-between border-t border-border/40">
                            <span>Kelengkapan Tanggal Lahir</span>
                            <span className="font-semibold text-foreground">
                                {metrics.totalAnggota - (ageDemographics.find((d) => d.bracket === "Belum Diisi")?.count || 0)} / {metrics.totalAnggota} terdata
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SEBARAN PRODI & ANGKATAN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sebaran Program Studi */}
                <Card className="border-border/60">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-rose-600" />
                                    <CardTitle className="text-base font-semibold">
                                        Sebaran Program Studi
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-xs">
                                    Komposisi jemaat menurut program studi di lingkungan FMIPA
                                </CardDescription>
                            </div>
                            <Button asChild size="sm" variant="ghost" className="text-xs h-8 gap-1 text-rose-600">
                                <Link href="/admin/anggota">
                                    <span>Data Anggota</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3.5">
                        {prodiDistribution.slice(0, 6).map((item) => (
                            <div key={item.prodi} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-foreground">{item.prodi}</span>
                                    <span className="text-muted-foreground font-semibold">
                                        {item.count} jemaat ({item.percentage}%)
                                    </span>
                                </div>
                                <Progress value={item.percentage} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Sebaran Angkatan */}
                <Card className="border-border/60">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-amber-600" />
                            <CardTitle className="text-base font-semibold">
                                Distribusi Angkatan Jemaat
                            </CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Jumlah anggota aktif per tahun angkatan masuk
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {angkatanDistribution.map((item) => (
                                <div
                                    key={item.angkatan}
                                    className="p-3 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between"
                                >
                                    <span className="text-xs text-muted-foreground font-medium">
                                        Angkatan {item.angkatan}
                                    </span>
                                    <div className="text-xl font-bold text-foreground mt-1">
                                        {item.count}
                                        <span className="text-[11px] font-normal text-muted-foreground ml-1">
                                            jemaat
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bilah Pintasan Cepat Pelayanan */}
            <Card className="border-border/60 bg-muted/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Pintasan Cepat Pelayanan</CardTitle>
                    <CardDescription className="text-xs">
                        Akses modul manajemen data jemaat, struktur pengurus, dan jurnal HPDT
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2.5">
                        <Button asChild size="sm" variant="outline" className="gap-2 text-xs">
                            <Link href="/admin/anggota">
                                <Users className="w-3.5 h-3.5 text-rose-600" />
                                <span>Kelola Data Anggota</span>
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="gap-2 text-xs">
                            <Link href="/admin/anggota/new">
                                <UserPlus className="w-3.5 h-3.5 text-rose-600" />
                                <span>Tambah Anggota Baru</span>
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="gap-2 text-xs">
                            <Link href="/admin/badan-pengurus">
                                <UserCog className="w-3.5 h-3.5 text-purple-600" />
                                <span>Struktur Badan Pengurus</span>
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="gap-2 text-xs">
                            <Link href="/admin/badan-pengurus/new">
                                <UserPlus className="w-3.5 h-3.5 text-purple-600" />
                                <span>Tambah Pengurus Baru</span>
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="gap-2 text-xs">
                            <Link href="/admin/hpdt">
                                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Jurnal HPDT Pengurus</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
