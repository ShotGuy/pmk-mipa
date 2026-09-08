"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CalendarDays,
    Clock,
    MapPin,
    Mic,
    QrCode,
    CheckCircle2,
    ArrowUpRight,
    Receipt,
    Network,
    Plus,
} from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { StatusPengontrolan } from "@prisma/client"

interface DashboardWidgetsProps {
    upcomingKegiatan: {
        id: string
        nama: string
        tanggal: Date
        waktu: Date | null
        lokasi: string | null
        pembicara: string | null
        isPresensiOpen: boolean
        presensiToken: string | null
        jenisKegiatanNama: string
    } | null
    ktbAttentionList: Array<{
        id: string
        nama: string
        angkatan: number
        pemimpinNama: string
        lastStatus: StatusPengontrolan | "BELUM_DIKONTROL"
        lastTanggalFormatted: string | null
        keterangan: string | null
    }>
    recentTransactions: Array<{
        id: string
        jenisTransaksi: "PEMASUKAN" | "PENGELUARAN"
        nominal: number
        keterangan: string | null
        kasNama: string
        createdAt: Date
        tanggalFormatted: string
    }>
}

function formatRupiah(val: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val)
}

export function DashboardWidgets({
    upcomingKegiatan,
    ktbAttentionList,
    recentTransactions,
}: DashboardWidgetsProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Widget 1: Kegiatan Terdekat / Sedang Berlangsung */}
            <Card className="shadow-xs border flex flex-col justify-between">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            <CardTitle className="text-base font-bold text-foreground">
                                Agenda Ibadah Terdekat
                            </CardTitle>
                        </div>
                        {upcomingKegiatan?.isPresensiOpen && (
                            <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0">
                                Presensi Buka
                            </Badge>
                        )}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                        Jadwal kegiatan persekutuan berikutnya
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-1 pb-5 flex-1 flex flex-col justify-between">
                    {upcomingKegiatan ? (
                        <div className="space-y-3">
                            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-bold text-sm text-foreground leading-snug">
                                        {upcomingKegiatan.nama}
                                    </h4>
                                    <Badge variant="outline" className="text-[10px] shrink-0 font-medium">
                                        {upcomingKegiatan.jenisKegiatanNama}
                                    </Badge>
                                </div>

                                <div className="space-y-1.5 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>
                                            {format(new Date(upcomingKegiatan.tanggal), "EEEE, d MMMM yyyy", {
                                                locale: localeId,
                                            })}
                                        </span>
                                    </div>

                                    {upcomingKegiatan.waktu && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                                            <span>
                                                {format(new Date(upcomingKegiatan.waktu), "HH:mm", {
                                                    locale: localeId,
                                                })}{" "}
                                                WIB
                                            </span>
                                        </div>
                                    )}

                                    {upcomingKegiatan.lokasi && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                            <span className="truncate">{upcomingKegiatan.lokasi}</span>
                                        </div>
                                    )}

                                    {upcomingKegiatan.pembicara && (
                                        <div className="flex items-center gap-2">
                                            <Mic className="w-3.5 h-3.5 text-primary shrink-0" />
                                            <span className="truncate">
                                                Pembicara: <strong>{upcomingKegiatan.pembicara}</strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <Button
                                    asChild
                                    size="sm"
                                    className="w-full h-8 text-xs gap-1.5 shadow-xs"
                                >
                                    <Link href={`/admin/kehadiran?kegiatanId=${upcomingKegiatan.id}`}>
                                        <QrCode className="w-3.5 h-3.5" />
                                        <span>Kelola Presensi</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-xs text-muted-foreground space-y-3">
                            <CalendarDays className="w-8 h-8 mx-auto opacity-40" />
                            <p>Belum ada jadwal kegiatan ibadah mendatang.</p>
                            <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                                <Link href="/admin/kegiatan">
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Buat Kegiatan Baru</span>
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Widget 2: Status Evaluasi & Monitoring KTB */}
            <Card className="shadow-xs border flex flex-col justify-between">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-sky-600" />
                            <CardTitle className="text-base font-bold text-foreground">
                                Evaluasi KTB
                            </CardTitle>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground px-2">
                            <Link href="/admin/pengontrolan">
                                <span>Lihat Semua</span>
                                <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Link>
                        </Button>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                        Kelompok yang membutuhkan pendampingan khusus
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2.5 pt-1 pb-5 flex-1">
                    {ktbAttentionList.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                            <p className="font-semibold text-foreground">Seluruh Kelompok KTB Terkontrol</p>
                            <p className="text-[11px]">Tidak ada kelompok yang berstatus macet atau vakum.</p>
                        </div>
                    ) : (
                        ktbAttentionList.map((ktb) => {
                            const isMacet = ktb.lastStatus === "MACET"
                            const isVakum = ktb.lastStatus === "VAKUM"

                            return (
                                <Link
                                    key={ktb.id}
                                    href={`/admin/ktb/${ktb.id}`}
                                    className="block p-2.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors text-xs space-y-1"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-foreground truncate">{ktb.nama}</span>
                                        {isMacet && (
                                            <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] px-1.5 py-0">
                                                Macet
                                            </Badge>
                                        )}
                                        {isVakum && (
                                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0">
                                                Vakum
                                            </Badge>
                                        )}
                                        {ktb.lastStatus === "BELUM_DIKONTROL" && (
                                            <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0">
                                                Belum Dikontrol
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                        <span>PKTB: {ktb.pemimpinNama}</span>
                                        <span>Angkatan {ktb.angkatan}</span>
                                    </div>

                                    {ktb.keterangan && (
                                        <p className="text-[10px] text-muted-foreground italic truncate">
                                            &ldquo;{ktb.keterangan}&rdquo;
                                        </p>
                                    )}
                                </Link>
                            )
                        })
                    )}
                </CardContent>
            </Card>

            {/* Widget 3: Transaksi Kas Terkini */}
            <Card className="shadow-xs border flex flex-col justify-between">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-emerald-600" />
                            <CardTitle className="text-base font-bold text-foreground">
                                Transaksi Kas Terkini
                            </CardTitle>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground px-2">
                            <Link href="/admin/transaksi">
                                <span>Lihat Semua</span>
                                <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Link>
                        </Button>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                        Mutasi keluar/masuk keuangan terbaru
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2.5 pt-1 pb-5 flex-1">
                    {recentTransactions.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                            <Receipt className="w-8 h-8 mx-auto opacity-40" />
                            <p>Belum ada catatan mutasi transaksi kas.</p>
                        </div>
                    ) : (
                        recentTransactions.map((tx) => {
                            const isMasuk = tx.jenisTransaksi === "PEMASUKAN"

                            return (
                                <div
                                    key={tx.id}
                                    className="p-2.5 rounded-lg border bg-muted/20 flex items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-0.5 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <Badge
                                                variant="outline"
                                                className={`text-[9px] px-1 py-0 font-bold ${
                                                    isMasuk
                                                        ? "border-emerald-200 text-emerald-700 bg-emerald-50/50"
                                                        : "border-rose-200 text-rose-700 bg-rose-50/50"
                                                }`}
                                            >
                                                {isMasuk ? "Masuk" : "Keluar"}
                                            </Badge>
                                            <span className="font-semibold text-foreground truncate">
                                                {tx.keterangan || "Transaksi Kas"}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">
                                            {tx.kasNama} • {tx.tanggalFormatted}
                                        </p>
                                    </div>

                                    <span
                                        className={`font-bold font-mono text-xs shrink-0 ${
                                            isMasuk ? "text-emerald-600" : "text-rose-500"
                                        }`}
                                    >
                                        {isMasuk ? "+" : "-"}
                                        {formatRupiah(tx.nominal)}
                                    </span>
                                </div>
                            )
                        })
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
