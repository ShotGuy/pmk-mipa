"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, Users, Wallet } from "lucide-react"

interface DashboardChartsProps {
    attendanceTrend: Array<{
        id: string
        nama: string
        tanggalFormatted: string
        totalHadir: number
        anggotaHadir: number
        pengunjungHadir: number
    }>
    monthlyCashflow: Array<{
        monthLabel: string
        pemasukan: number
        pengeluaran: number
        net: number
    }>
}

function formatCompactRupiah(val: number): string {
    if (val >= 1_000_000) {
        return `Rp ${(val / 1_000_000).toFixed(1)}jt`
    }
    if (val >= 1_000) {
        return `Rp ${(val / 1_000).toFixed(0)}rb`
    }
    return `Rp ${val}`
}

export function DashboardCharts({ attendanceTrend, monthlyCashflow }: DashboardChartsProps) {
    // 1. Hitung skala maksimum untuk kehadiran
    const maxAttendance = Math.max(
        ...attendanceTrend.map((item) => item.totalHadir),
        10
    )

    // 2. Hitung skala maksimum untuk arus kas
    const maxCashflow = Math.max(
        ...monthlyCashflow.map((m) => Math.max(m.pemasukan, m.pengeluaran)),
        100_000
    )

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart 1: Tren Kehadiran Ibadah */}
            <Card className="shadow-xs border overflow-hidden flex flex-col justify-between">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                <CardTitle className="text-base font-bold text-foreground">
                                    Tren Partisipasi Kehadiran Ibadah
                                </CardTitle>
                            </div>
                            <CardDescription className="text-xs text-muted-foreground mt-1">
                                Perbandingan jemaat anggota PMK vs pengunjung di {attendanceTrend.length} kegiatan terakhir
                            </CardDescription>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-primary inline-block" />
                                <span className="text-muted-foreground">Anggota</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                                <span className="text-muted-foreground">Pengunjung</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-2 pb-6">
                    {attendanceTrend.length === 0 ? (
                        <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-xs">
                            <BarChart3 className="w-8 h-8 mb-2 opacity-40" />
                            <span>Belum ada data kehadiran tercatat.</span>
                        </div>
                    ) : (
                        <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-1">
                            {attendanceTrend.map((item) => {
                                const heightPercent = Math.min(
                                    Math.round((item.totalHadir / maxAttendance) * 100),
                                    100
                                )
                                const anggotaPercent =
                                    item.totalHadir > 0
                                        ? Math.round((item.anggotaHadir / item.totalHadir) * 100)
                                        : 100

                                return (
                                    <div
                                        key={item.id}
                                        className="flex-1 flex flex-col items-center justify-end h-full group relative"
                                    >
                                        {/* Floating Tooltip / Counter */}
                                        <div className="mb-1 text-[11px] font-bold text-foreground transition-transform group-hover:scale-110">
                                            {item.totalHadir}
                                        </div>

                                        {/* Stacked Bar Container */}
                                        <div className="w-full max-w-[36px] sm:max-w-[44px] bg-muted/40 rounded-t-md overflow-hidden flex flex-col justify-end transition-all group-hover:brightness-95"
                                            style={{ height: `${Math.max(heightPercent, 8)}%` }}
                                        >
                                            {/* Pengunjung bar (top) */}
                                            {item.pengunjungHadir > 0 && (
                                                <div
                                                    className="w-full bg-emerald-500 transition-all"
                                                    style={{ height: `${100 - anggotaPercent}%` }}
                                                    title={`Pengunjung: ${item.pengunjungHadir}`}
                                                />
                                            )}
                                            {/* Anggota bar (bottom) */}
                                            <div
                                                className="w-full bg-primary transition-all"
                                                style={{ height: `${anggotaPercent}%` }}
                                                title={`Anggota: ${item.anggotaHadir}`}
                                            />
                                        </div>

                                        {/* Date and Activity Label */}
                                        <div className="w-full text-center mt-2.5 space-y-0.5">
                                            <p className="text-[11px] font-bold text-foreground truncate">
                                                {item.tanggalFormatted}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground truncate hidden sm:block max-w-[70px] mx-auto" title={item.nama}>
                                                {item.nama}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Chart 2: Arus Kas Bulanan */}
            <Card className="shadow-xs border overflow-hidden flex flex-col justify-between">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-emerald-600" />
                                <CardTitle className="text-base font-bold text-foreground">
                                    Arus Kas Pemasukan vs Pengeluaran
                                </CardTitle>
                            </div>
                            <CardDescription className="text-xs text-muted-foreground mt-1">
                                Komparasi keuangan operasional pelayanan 6 bulan terakhir
                            </CardDescription>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
                                <span className="text-muted-foreground">Masuk</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
                                <span className="text-muted-foreground">Keluar</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-2 pb-6">
                    {monthlyCashflow.every((m) => m.pemasukan === 0 && m.pengeluaran === 0) ? (
                        <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-xs">
                            <Wallet className="w-8 h-8 mb-2 opacity-40" />
                            <span>Belum ada mutasi transaksi kas pada 6 bulan terakhir.</span>
                        </div>
                    ) : (
                        <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-1">
                            {monthlyCashflow.map((item, idx) => {
                                const pemasukanHeight = Math.min(
                                    Math.round((item.pemasukan / maxCashflow) * 100),
                                    100
                                )
                                const pengeluaranHeight = Math.min(
                                    Math.round((item.pengeluaran / maxCashflow) * 100),
                                    100
                                )

                                return (
                                    <div
                                        key={idx}
                                        className="flex-1 flex flex-col items-center justify-end h-full group relative"
                                    >
                                        {/* Dual Bar (Pemasukan & Pengeluaran) */}
                                        <div className="flex items-end justify-center gap-1 w-full h-full pb-1">
                                            {/* Bar Pemasukan */}
                                            <div
                                                className="w-full max-w-[14px] sm:max-w-[18px] bg-emerald-600 rounded-t-sm transition-all group-hover:brightness-90"
                                                style={{ height: `${Math.max(pemasukanHeight, 4)}%` }}
                                                title={`Pemasukan: ${formatCompactRupiah(item.pemasukan)}`}
                                            />
                                            {/* Bar Pengeluaran */}
                                            <div
                                                className="w-full max-w-[14px] sm:max-w-[18px] bg-rose-500 rounded-t-sm transition-all group-hover:brightness-90"
                                                style={{ height: `${Math.max(pengeluaranHeight, 4)}%` }}
                                                title={`Pengeluaran: ${formatCompactRupiah(item.pengeluaran)}`}
                                            />
                                        </div>

                                        {/* Month Label */}
                                        <div className="w-full text-center mt-2.5">
                                            <p className="text-[11px] font-bold text-foreground truncate">
                                                {item.monthLabel}
                                            </p>
                                            <p className={`text-[10px] font-semibold truncate ${item.net >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                                {item.net >= 0 ? "+" : ""}{formatCompactRupiah(item.net)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
