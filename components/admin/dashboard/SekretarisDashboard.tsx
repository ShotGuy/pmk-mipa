"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    Users,
    Calendar,
    CalendarPlus,
    CalendarDays,
    ArrowUpRight,
    CheckCircle2,
    Sun,
    Moon,
    HeartHandshake,
    Church,
    BookOpen,
    Loader2,
    ShieldCheck,
    Sparkles,
    GraduationCap,
    Cake,
    QrCode,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SekretarisDashboardData, quickSaveTodayHPDT } from "@/actions/dashboard"

interface SekretarisDashboardProps {
    data: SekretarisDashboardData
}

export function SekretarisDashboard({ data }: SekretarisDashboardProps) {
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

    const { adminMetrics } = data

    return (
        <div className="space-y-8 pb-10">
            {/* 1. HERO ADMINISTRATIVE HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-6 md:p-8 shadow-xl border border-indigo-800/40">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <Badge className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-400/30 text-xs px-3 py-1 backdrop-blur-md">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-purple-300" />
                                Sekretaris PMK MIPA • Administrasi & Presensi
                            </Badge>
                            <span className="text-xs text-indigo-200/80 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {data.currentDateFormatted}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span>{data.timeGreeting}, {data.firstName}!</span>
                            <span className="text-xl">📋</span>
                        </h1>

                        <p className="text-sm text-indigo-100/80 leading-relaxed">
                            Pusat tata kelola administrasi organisasi. Kelola basis data anggota PMK (termasuk import Excel), jadwalkan kegiatan ibadah, dan pantau rekapitulasi presensi jemaat.
                        </p>
                    </div>

                    {/* Quick navigation buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                            <Link href="/admin/kegiatan/new">
                                <CalendarPlus className="w-4 h-4 mr-2" />
                                <span>Tambah Kegiatan</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white">
                            <Link href="/admin/anggota">
                                <Users className="w-4 h-4 mr-2" />
                                <span>Kelola Anggota</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. TODAY HPDT QUICK ENTRY */}
            <Card className="border-purple-500/20 bg-gradient-to-r from-purple-50/50 via-background to-indigo-50/30 dark:from-purple-950/20 dark:via-card dark:to-indigo-950/20 shadow-xs">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span>Refleksi & HPDT Pribadi Anda Hari Ini</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Pelayanan administrasi yang tertib didasari oleh hati yang senantiasa mencari wajah Tuhan setiap hari.
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
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSate
                                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200"
                                    : "bg-background border-muted hover:bg-muted/50 text-muted-foreground"
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${isSate ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}>
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
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isDoa
                                    ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200"
                                    : "bg-background border-muted hover:bg-muted/50 text-muted-foreground"
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${isDoa ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300" : "bg-muted text-muted-foreground"}`}>
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
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isAttendedKTB
                                    ? "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200"
                                    : "bg-background border-muted hover:bg-muted/50 text-muted-foreground"
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${isAttendedKTB ? "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300" : "bg-muted text-muted-foreground"}`}>
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
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isGereja
                                    ? "bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200"
                                    : "bg-background border-muted hover:bg-muted/50 text-muted-foreground"
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${isGereja ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300" : "bg-muted text-muted-foreground"}`}>
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
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8"
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

            {/* 3. ADMINISTRATIVE KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total Anggota Terdata
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                            <Users className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {adminMetrics.totalAnggota}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Anggota & alumni PMK MIPA
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Rasio Gender
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                            <Users className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <span>L: {adminMetrics.persenLakiLaki}%</span>
                            <span className="text-muted-foreground font-normal">•</span>
                            <span>P: {adminMetrics.persenPerempuan}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {adminMetrics.totalLakiLaki} Laki-laki / {adminMetrics.totalPerempuan} Perempuan
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total Kegiatan
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <CalendarDays className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {adminMetrics.totalKegiatan}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ibadah & program terdaftar
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Rata-Rata Kehadiran
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {adminMetrics.avgKehadiran}{" "}
                            <span className="text-sm font-normal text-muted-foreground">Jemaat / Acara</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Presensi jemaat per kegiatan
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 4. UPCOMING KEGIATAN & ATTENDANCE SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Upcoming Activity Card */}
                <div className="lg:col-span-5 space-y-4">
                    <Card className="border-border shadow-xs h-full flex flex-col justify-between">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span>Agenda Kegiatan Mendatang</span>
                                </CardTitle>
                                {data.upcomingKegiatan?.isPresensiOpen && (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px]">
                                        Presensi Dibuka
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-xs">
                                Kegiatan ibadah terdekat berikutnya dalam kalender PMK MIPA.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.upcomingKegiatan ? (
                                <div className="p-4 rounded-xl border bg-card/60 space-y-3">
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="text-[10px]">
                                            {data.upcomingKegiatan.jenisKegiatanNama}
                                        </Badge>
                                        <h3 className="text-base font-bold text-foreground">
                                            {data.upcomingKegiatan.nama}
                                        </h3>
                                    </div>

                                    <div className="text-xs space-y-1 text-muted-foreground">
                                        <div>📅 {data.upcomingKegiatan.tanggalFormatted}</div>
                                        {data.upcomingKegiatan.waktuFormatted && (
                                            <div>⏰ {data.upcomingKegiatan.waktuFormatted}</div>
                                        )}
                                        {data.upcomingKegiatan.lokasi && (
                                            <div>📍 {data.upcomingKegiatan.lokasi}</div>
                                        )}
                                        {data.upcomingKegiatan.pembicara && (
                                            <div>🎙️ Pembicara: {data.upcomingKegiatan.pembicara}</div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                                        <Button asChild size="sm" className="text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white">
                                            <Link href={`/admin/kehadiran?kegiatanId=${data.upcomingKegiatan.id}`}>
                                                <QrCode className="w-3.5 h-3.5 mr-1.5" />
                                                <span>Buka Presensi</span>
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm" className="text-xs h-8">
                                            <Link href={`/admin/kegiatan/${data.upcomingKegiatan.id}`}>
                                                <span>Edit Kegiatan</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center text-xs text-muted-foreground space-y-3">
                                    <div>Belum ada agenda kegiatan mendatang yang dijadwalkan.</div>
                                    <Button asChild size="sm" variant="outline" className="text-xs">
                                        <Link href="/admin/kegiatan/new">
                                            <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
                                            <span>Tambah Kegiatan Baru</span>
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Attendance Recap */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className="border-border shadow-xs h-full flex flex-col justify-between">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <span>Presensi Kegiatan Terakhir</span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Jumlah jemaat hadir pada 5 kegiatan ibadah terakhir.
                                </CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                                <Link href="/admin/kehadiran">
                                    <span>Detail Presensi</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {data.recentKegiatanAttendance.length === 0 ? (
                                <div className="py-8 text-center text-xs text-muted-foreground">
                                    Belum ada catatan presensi kegiatan.
                                </div>
                            ) : (
                                <div className="divide-y text-xs">
                                    {data.recentKegiatanAttendance.map((k) => (
                                        <div key={k.id} className="py-3 flex items-center justify-between gap-3">
                                            <div className="space-y-0.5 min-w-0">
                                                <div className="font-semibold text-foreground truncate">
                                                    {k.nama}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {k.tanggalFormatted}
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 space-y-0.5">
                                                <div className="font-bold text-sm text-foreground">
                                                    {k.totalHadir} <span className="text-[11px] font-normal text-muted-foreground">Hadir</span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {k.anggotaHadir} Anggota • {k.pengunjungHadir} Pengunjung
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 5. DEMOGRAPHICS (PRODI, ANGKATAN, AGE BRACKETS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Program Studi Distribution */}
                <Card className="border-border shadow-xs">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span>Distribusi Program Studi</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Sebaran anggota berdasarkan jurusan / program studi di FMIPA.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.prodiDistribution.slice(0, 6).map((p) => (
                            <div key={p.prodi} className="space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground truncate">{p.prodi}</span>
                                    <span className="font-mono text-muted-foreground">{p.count} ({p.percentage}%)</span>
                                </div>
                                <Progress value={p.percentage} className="h-1.5" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Angkatan Distribution */}
                <Card className="border-border shadow-xs">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Distribusi Angkatan</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Komposisi tahun masuk jemaat dan alumni PMK MIPA.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {data.angkatanDistribution.map((a) => (
                            <div key={a.angkatan} className="p-2 rounded-lg border bg-card/60 flex items-center justify-between text-xs">
                                <span className="font-medium text-foreground">Angkatan {a.angkatan}</span>
                                <Badge variant="secondary" className="text-[11px] font-mono">
                                    {a.count} Orang
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Age Demographics (from tanggalLahir) */}
                <Card className="border-border shadow-xs">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Cake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span>Kelompok Usia Jemaat</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Demografi rentang umur dari kolom tanggal lahir.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.ageDemographics.map((age) => (
                            <div key={age.bracket} className="space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">{age.bracket}</span>
                                    <span className="font-mono text-muted-foreground">{age.count} ({age.percentage}%)</span>
                                </div>
                                <Progress value={age.percentage} className="h-1.5" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* 6. PERMISSION & FAST NAVIGATION SHORTCUTS */}
            <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Pintasan Menu & Wewenang Sekretaris
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                        <Link href="/admin/anggota">
                            <Users className="w-3.5 h-3.5 mr-2 text-purple-600" />
                            <span>Data & Import Anggota</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                        <Link href="/admin/kegiatan">
                            <CalendarDays className="w-3.5 h-3.5 mr-2 text-primary" />
                            <span>Master Kegiatan</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                        <Link href="/admin/kehadiran">
                            <QrCode className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                            <span>Presensi Meja Tamu</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-2.5 justify-start text-xs font-medium">
                        <Link href="/admin/hpdt">
                            <BookOpen className="w-3.5 h-3.5 mr-2 text-indigo-600" />
                            <span>HPDT Seksi Acara</span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
