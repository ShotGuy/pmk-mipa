"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    CalendarDays,
    Users,
    UserCheck,
    Sparkles,
    Calendar,
    MapPin,
    Clock,
    User,
    QrCode,
    Camera,
    UserCog,
    ScrollText,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    Sun,
    Moon,
    Church,
    BookOpen,
    Loader2,
    ShieldCheck,
    GraduationCap,
    Cake,
    Layers,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AcaraDashboardData, quickSaveTodayHPDT } from "@/actions/dashboard"

interface AcaraDashboardProps {
    data: AcaraDashboardData
}

export function AcaraDashboard({ data }: AcaraDashboardProps) {
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

    const { metrics, upcomingKegiatan, recentKegiatanAttendance, prodiDistribution, angkatanDistribution, ageDemographics } = data

    return (
        <div className="space-y-8 pb-10">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/15 via-indigo-500/10 to-transparent border border-purple-500/20 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <Badge
                                variant="secondary"
                                className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 px-3 py-1 text-xs font-semibold"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-500" />
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
                            Pantau dinamika pertumbuhan jemaat, tren kehadiran ibadah, evaluasi kegiatan, dan kesiapan presensi operasional PMK MIPA.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-sm">
                            <Link href="/admin/kegiatan/new">
                                <CalendarDays className="w-4 h-4" />
                                <span>Buat Kegiatan</span>
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="gap-2">
                            <Link href="/admin/kehadiran">
                                <QrCode className="w-4 h-4 text-purple-600" />
                                <span>Presensi & QR</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Checklist HPDT Hari Ini */}
            <Card className="border-purple-500/20 bg-card/60 backdrop-blur">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-purple-600" />
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
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5"
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
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSate(!isSate)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                isSate
                                    ? "bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200"
                                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-muted-foreground"
                            }`}
                        >
                            <Sun className={`w-5 h-5 ${isSate ? "text-amber-500 fill-amber-500" : ""}`} />
                            <div>
                                <p className="text-xs font-semibold">Saat Teduh</p>
                                <p className="text-[11px] opacity-75">{isSate ? "Sudah" : "Belum"}</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsDoa(!isDoa)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                isDoa
                                    ? "bg-blue-500/10 border-blue-500/40 text-blue-900 dark:text-blue-200"
                                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-muted-foreground"
                            }`}
                        >
                            <Moon className={`w-5 h-5 ${isDoa ? "text-blue-500 fill-blue-500" : ""}`} />
                            <div>
                                <p className="text-xs font-semibold">Doa Pribadi</p>
                                <p className="text-[11px] opacity-75">{isDoa ? "Sudah" : "Belum"}</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAttendedKTB(!isAttendedKTB)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                isAttendedKTB
                                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200"
                                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-muted-foreground"
                            }`}
                        >
                            <BookOpen className={`w-5 h-5 ${isAttendedKTB ? "text-emerald-500" : ""}`} />
                            <div>
                                <p className="text-xs font-semibold">Kelompok KTB</p>
                                <p className="text-[11px] opacity-75">{isAttendedKTB ? "Hadir" : "Tidak"}</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsGereja(!isGereja)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                isGereja
                                    ? "bg-purple-500/10 border-purple-500/40 text-purple-900 dark:text-purple-200"
                                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-muted-foreground"
                            }`}
                        >
                            <Church className={`w-5 h-5 ${isGereja ? "text-purple-500" : ""}`} />
                            <div>
                                <p className="text-xs font-semibold">Ibadah Gereja</p>
                                <p className="text-[11px] opacity-75">{isGereja ? "Hadir" : "Tidak"}</p>
                            </div>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* 4 Kartu KPI Utama Seksi Acara */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Anggota Terdaftar
                        </CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <Users className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalAnggota}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Basis jemaat aktif PMK MIPA
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Kegiatan Terlaksana
                        </CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                            <CalendarDays className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalKegiatan}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Akumulasi seluruh agenda & ibadah
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Rata-Rata Kehadiran
                        </CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.avgKehadiran} jemaat</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Partisipasi ~{metrics.persenPartisipasiRataRata}% dari total jemaat
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tamu Luar / Jiwa Baru
                        </CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                            <UserCheck className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalPengunjungLuar} peserta</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Akumulasi peserta non-APMK terjangkau
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Agenda Terdekat & Presensi Cepat */}
            {upcomingKegiatan && (
                <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20">
                                        {upcomingKegiatan.jenisKegiatanNama}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                            upcomingKegiatan.isPresensiOpen
                                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-medium"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {upcomingKegiatan.isPresensiOpen ? "Presensi Dibuka" : "Presensi Tertutup"}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold">
                                    {upcomingKegiatan.nama}
                                </CardTitle>
                            </div>
                            <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                <Link href={`/admin/kehadiran?kegiatanId=${upcomingKegiatan.id}`}>
                                    <QrCode className="w-4 h-4" />
                                    <span>Buka Standee QR</span>
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>{upcomingKegiatan.tanggalFormatted}</span>
                            </div>
                            {upcomingKegiatan.waktuFormatted && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span>{upcomingKegiatan.waktuFormatted}</span>
                                </div>
                            )}
                            {upcomingKegiatan.lokasi && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span>{upcomingKegiatan.lokasi}</span>
                                </div>
                            )}
                            {upcomingKegiatan.pembicara && (
                                <div className="flex items-center gap-2 sm:col-span-3">
                                    <User className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span>Pembicara / Pelayan: <strong className="text-foreground">{upcomingKegiatan.pembicara}</strong></span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Evaluasi Kehadiran 5 Kegiatan Terakhir */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">
                                Tren Kehadiran Kegiatan Terakhir
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Perbandingan jemaat APMK dengan tamu non-APMK pada kegiatan terakhir
                            </CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-xs text-purple-600 gap-1">
                            <Link href="/admin/kehadiran">
                                Rekapitulasi Lengkap
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentKegiatanAttendance.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-6 text-center">
                            Belum ada riwayat kegiatan ibadah.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {recentKegiatanAttendance.map((k) => (
                                <div key={k.id} className="space-y-1.5 p-3 rounded-xl border bg-muted/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-foreground">
                                                {k.nama}
                                            </span>
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                {k.tanggalFormatted}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                                                Total: {k.totalHadir} Hadir
                                            </span>
                                            <span className="text-muted-foreground">
                                                (APMK: {k.anggotaHadir} • Tamu: {k.pengunjungHadir})
                                            </span>
                                        </div>
                                    </div>
                                    <Progress
                                        value={k.persentaseDariTotalAnggota}
                                        className="h-2 bg-purple-500/10"
                                        indicatorClassName="bg-purple-600"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Demografi Jemaat: Prodi, Angkatan, Usia */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sebaran Prodi */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-purple-600" />
                            <CardTitle className="text-sm font-semibold">Distribusi Program Studi</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Sebaran jemaat berdasarkan disiplin ilmu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {prodiDistribution.slice(0, 5).map((p) => (
                            <div key={p.prodi} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground truncate max-w-[160px]">
                                        {p.prodi}
                                    </span>
                                    <span className="font-semibold">{p.count} ({p.percentage}%)</span>
                                </div>
                                <Progress value={p.percentage} className="h-1.5" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Sebaran Angkatan */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-600" />
                            <CardTitle className="text-sm font-semibold">Distribusi Angkatan</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Sebaran jemaat per tahun angkatan kuliah
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {angkatanDistribution.slice(0, 8).map((a) => (
                                <div
                                    key={a.angkatan}
                                    className="px-3 py-2 rounded-lg border bg-muted/30 text-center flex-1 min-w-[70px]"
                                >
                                    <p className="text-xs font-semibold text-foreground">{a.angkatan}</p>
                                    <p className="text-[11px] text-muted-foreground">{a.count} orang</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sebaran Rentang Usia */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Cake className="w-4 h-4 text-purple-600" />
                            <CardTitle className="text-sm font-semibold">Demografi Usia</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Dihitung otomatis dari tanggal lahir jemaat
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {ageDemographics.map((age) => (
                            <div key={age.bracket} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">{age.bracket}</span>
                                    <span className="font-semibold">{age.count} ({age.percentage}%)</span>
                                </div>
                                <Progress value={age.percentage} className="h-1.5 bg-purple-500/10" indicatorClassName="bg-purple-500" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Bar */}
            <Card className="border-dashed">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Pintasan Cepat Seksi Acara</CardTitle>
                    <CardDescription className="text-xs">
                        Akses langsung ke modul operasional ibadah, presensi, dan data anggota
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1.5 border-dashed hover:border-purple-500/50 hover:bg-purple-500/5">
                            <Link href="/admin/kegiatan/new">
                                <CalendarDays className="w-4 h-4 text-purple-600" />
                                <span className="text-xs">Tambah Kegiatan</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1.5 border-dashed hover:border-purple-500/50 hover:bg-purple-500/5">
                            <Link href="/admin/kehadiran">
                                <QrCode className="w-4 h-4 text-purple-600" />
                                <span className="text-xs">Presensi & Standee</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1.5 border-dashed hover:border-purple-500/50 hover:bg-purple-500/5">
                            <Link href="/admin/gallery">
                                <Camera className="w-4 h-4 text-purple-600" />
                                <span className="text-xs">Galeri Dokumentasi</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1.5 border-dashed hover:border-purple-500/50 hover:bg-purple-500/5">
                            <Link href="/admin/anggota">
                                <UserCog className="w-4 h-4 text-purple-600" />
                                <span className="text-xs">Direktori Jemaat</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1.5 border-dashed hover:border-purple-500/50 hover:bg-purple-500/5">
                            <Link href="/admin/hpdt">
                                <ScrollText className="w-4 h-4 text-purple-600" />
                                <span className="text-xs">Jurnal HPDT</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
