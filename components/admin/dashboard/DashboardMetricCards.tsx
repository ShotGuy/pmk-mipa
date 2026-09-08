"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Network,
    Wallet,
    CalendarCheck,
    AlertCircle,
} from "lucide-react"

interface DashboardMetricCardsProps {
    metrics: {
        totalAnggota: number
        totalLakiLaki: number
        totalPerempuan: number
        totalAnggotaKTB: number
        persenAnggotaKTB: number

        totalKTB: number
        totalKTBAktif: number
        ktbMacetCount: number
        ktbVakumCount: number

        totalSaldoKas: number
        pemasukanBulanIni: number
        pengeluaranBulanIni: number

        totalKegiatan: number
        avgKehadiran: number
        totalKehadiranAll: number
    }
}

function formatRupiah(val: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val)
}

export function DashboardMetricCards({ metrics }: DashboardMetricCardsProps) {
    const totalButuhPerhatian = metrics.ktbMacetCount + metrics.ktbVakumCount

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Anggota PMK */}
            <Link href="/admin/anggota" className="group">
                <Card className="h-full border transition-all duration-200 hover:shadow-md hover:border-violet-300">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Total Anggota PMK
                                </span>
                                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {metrics.totalAnggota}
                                </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="space-y-2 pt-1 border-t text-xs">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Distribusi Gender</span>
                                <span className="font-semibold text-foreground">
                                    {metrics.totalLakiLaki} L • {metrics.totalPerempuan} P
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Tergabung KTB</span>
                                <Badge variant="outline" className="text-[10px] font-semibold text-violet-700 border-violet-200 bg-violet-50/50">
                                    {metrics.persenAnggotaKTB}% ({metrics.totalAnggotaKTB} orang)
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Card 2: Kelompok KTB */}
            <Link href="/admin/ktb" className="group">
                <Card className="h-full border transition-all duration-200 hover:shadow-md hover:border-sky-300">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Kelompok KTB Aktif
                                </span>
                                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {metrics.totalKTBAktif}{" "}
                                    <span className="text-sm font-medium text-muted-foreground">Kelompok</span>
                                </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Network className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="space-y-2 pt-1 border-t text-xs">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Total Anggota KTB</span>
                                <span className="font-semibold text-foreground">{metrics.totalAnggotaKTB} Jemaat</span>
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Evaluasi KTB</span>
                                {totalButuhPerhatian > 0 ? (
                                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-semibold hover:bg-amber-100">
                                        <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
                                        {totalButuhPerhatian} Perlu Perhatian
                                    </Badge>
                                ) : (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold">
                                        Semua Terkontrol Baik
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Card 3: Saldo Kas PMK */}
            <Link href="/admin/kas" className="group">
                <Card className="h-full border transition-all duration-200 hover:shadow-md hover:border-emerald-300">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Total Saldo Kas
                                </span>
                                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600">
                                    {formatRupiah(metrics.totalSaldoKas)}
                                </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Wallet className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-1 border-t text-xs">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Masuk Bln Ini</span>
                                <span className="font-semibold text-emerald-600">
                                    +{formatRupiah(metrics.pemasukanBulanIni)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Keluar Bln Ini</span>
                                <span className="font-semibold text-rose-500">
                                    -{formatRupiah(metrics.pengeluaranBulanIni)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Card 4: Kehadiran Ibadah */}
            <Link href="/admin/kehadiran" className="group">
                <Card className="h-full border transition-all duration-200 hover:shadow-md hover:border-amber-300">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Rata-rata Kehadiran
                                </span>
                                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {metrics.avgKehadiran}{" "}
                                    <span className="text-sm font-medium text-muted-foreground">jemaat / ibadah</span>
                                </div>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <CalendarCheck className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="space-y-2 pt-1 border-t text-xs">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Total Kegiatan</span>
                                <span className="font-semibold text-foreground">{metrics.totalKegiatan} Acara</span>
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Akumulasi Presensi</span>
                                <Badge variant="outline" className="text-[10px] font-semibold text-amber-700 border-amber-200 bg-amber-50/50">
                                    {metrics.totalKehadiranAll} Total Hadir
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}
