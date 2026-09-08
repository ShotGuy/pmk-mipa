"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    QrCode,
    Receipt,
    CalendarPlus,
    UserPlus,
    ArrowUpRight,
    Sparkles,
} from "lucide-react"

interface DashboardHeaderProps {
    greeting: string
    currentDateFormatted: string
    activePresensiKegiatan: {
        id: string
        nama: string
        tanggal: Date
        isPresensiOpen: boolean
        presensiToken: string | null
        jenisKegiatanNama: string
    } | null
}

export function DashboardHeader({
    greeting,
    currentDateFormatted,
    activePresensiKegiatan,
}: DashboardHeaderProps) {
    return (
        <div className="space-y-4">
            {/* Live Presensi Notification Banner (jika ada ibadah yang sedang buka presensi) */}
            {activePresensiKegiatan && (
                <div className="relative overflow-hidden rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 sm:p-5 shadow-xs transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                            </span>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                                        Presensi QR Sedang Aktif
                                    </span>
                                    <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 hover:bg-emerald-700">
                                        Live
                                    </Badge>
                                </div>
                                <p className="text-sm font-bold text-emerald-950">
                                    {activePresensiKegiatan.nama}{" "}
                                    <span className="font-normal text-xs text-emerald-700">
                                        ({activePresensiKegiatan.jenisKegiatanNama})
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <Button
                                asChild
                                size="sm"
                                className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs gap-1.5 h-8 text-xs"
                            >
                                <Link href={`/admin/kehadiran?kegiatanId=${activePresensiKegiatan.id}`}>
                                    <QrCode className="w-3.5 h-3.5" />
                                    <span>Monitoring & QR Standee</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Welcome Hero Card */}
            <div className="rounded-2xl border bg-card p-5 sm:p-7 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            <span>Pusat Kendali Pelayanan PMK MIPA</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Selamat Melayani, {greeting}! 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                            <span>Hari ini: {currentDateFormatted}</span>
                            <span>•</span>
                            <span>Semangat melayani untuk kemuliaan nama Tuhan</span>
                        </p>
                    </div>

                    {/* Quick Action Shortcuts */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 text-xs bg-background hover:bg-muted font-medium"
                        >
                            <Link href="/admin/kehadiran">
                                <QrCode className="w-3.5 h-3.5 text-primary" />
                                <span>Presensi Ibadah</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 text-xs bg-background hover:bg-muted font-medium"
                        >
                            <Link href="/admin/transaksi">
                                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Catat Kas</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 text-xs bg-background hover:bg-muted font-medium"
                        >
                            <Link href="/admin/kegiatan">
                                <CalendarPlus className="w-3.5 h-3.5 text-sky-600" />
                                <span>Kegiatan Baru</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 text-xs bg-background hover:bg-muted font-medium"
                        >
                            <Link href="/admin/anggota">
                                <UserPlus className="w-3.5 h-3.5 text-violet-600" />
                                <span>Input Anggota</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
