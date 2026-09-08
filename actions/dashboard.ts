"use server"

import { db } from "@/lib/db"
import { StatusPengontrolan } from "@prisma/client"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { id as localeId } from "date-fns/locale"

export interface DashboardSummaryData {
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
    prodiDistribution: Array<{
        prodi: string
        count: number
        percentage: number
    }>
    angkatanDistribution: Array<{
        angkatan: string
        count: number
    }>
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

export async function getDashboardSummary(): Promise<{
    success: boolean
    data?: DashboardSummaryData
    message?: string
}> {
    try {
        const now = new Date()
        const startCurrentMonth = startOfMonth(now)
        const endCurrentMonth = endOfMonth(now)

        // 1. Eksekusi seluruh kueri database secara paralel untuk performa optimal
        const [
            totalAnggota,
            totalLakiLaki,
            totalPerempuan,
            totalAnggotaKTB,
            prodiGroups,
            angkatanGroups,
            totalKTB,
            totalKTBAktif,
            allKTBWithLastPengontrolan,
            kasList,
            transaksiSummary,
            transaksiBulanIni,
            recentTransactionsRaw,
            totalKegiatan,
            totalKehadiranAll,
            activePresensiKegiatanRaw,
            upcomingKegiatanRaw,
            recentKegiatanRaw,
        ] = await Promise.all([
            // Anggota
            db.anggota.count(),
            db.anggota.count({ where: { jenisKelamin: "L" } }),
            db.anggota.count({ where: { jenisKelamin: "P" } }),
            db.kTBAnggota.count({ where: { isAktif: true } }),
            db.anggota.groupBy({
                by: ["prodi"],
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
            }),
            db.anggota.groupBy({
                by: ["angkatan"],
                _count: { id: true },
                orderBy: { angkatan: "desc" },
            }),

            // KTB
            db.kTB.count(),
            db.kTB.count({ where: { status: "AKTIF" } }),
            db.kTB.findMany({
                where: { status: "AKTIF" },
                select: {
                    id: true,
                    nama: true,
                    angkatan: true,
                    pemimpin: { select: { nama: true } },
                    pengontrolan: {
                        orderBy: { tanggal: "desc" },
                        take: 1,
                        select: {
                            status: true,
                            tanggal: true,
                            keterangan: true,
                        },
                    },
                },
            }),

            // Kas & Transaksi
            db.kas.findMany({ orderBy: { nama: "asc" } }),
            db.transaksi.groupBy({
                by: ["idKas", "jenisTransaksi"],
                _sum: { nominal: true },
            }),
            db.transaksi.groupBy({
                by: ["jenisTransaksi"],
                where: {
                    createdAt: {
                        gte: startCurrentMonth,
                        lte: endCurrentMonth,
                    },
                },
                _sum: { nominal: true },
            }),
            db.transaksi.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    kas: { select: { nama: true } },
                },
            }),

            // Kegiatan & Kehadiran
            db.kegiatan.count(),
            db.kehadiran.count(),
            db.kegiatan.findFirst({
                where: { isPresensiOpen: true },
                include: { jenisKegiatan: { select: { nama: true } } },
                orderBy: { tanggal: "desc" },
            }),
            db.kegiatan.findFirst({
                where: { tanggal: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } },
                include: { jenisKegiatan: { select: { nama: true } } },
                orderBy: { tanggal: "asc" },
            }),
            db.kegiatan.findMany({
                take: 6,
                orderBy: { tanggal: "desc" },
                include: {
                    kehadiran: {
                        select: {
                            status: true,
                        },
                    },
                },
            }),
        ])

        // 2. Kalkulasi Kas & Keuangan
        const kasBalances = kasList.map((item) => {
            const saldoAwal = Number(item.saldo)
            const pemasukanRow = transaksiSummary.find(
                (s) => s.idKas === item.id && s.jenisTransaksi === "PEMASUKAN"
            )
            const pengeluaranRow = transaksiSummary.find(
                (s) => s.idKas === item.id && s.jenisTransaksi === "PENGELUARAN"
            )
            const totalPemasukan = pemasukanRow?._sum.nominal ? Number(pemasukanRow._sum.nominal) : 0
            const totalPengeluaran = pengeluaranRow?._sum.nominal ? Number(pengeluaranRow._sum.nominal) : 0
            return saldoAwal + totalPemasukan - totalPengeluaran
        })
        const totalSaldoKas = kasBalances.reduce((acc, curr) => acc + curr, 0)

        const pemasukanBulanIniRow = transaksiBulanIni.find((r) => r.jenisTransaksi === "PEMASUKAN")
        const pengeluaranBulanIniRow = transaksiBulanIni.find((r) => r.jenisTransaksi === "PENGELUARAN")
        const pemasukanBulanIni = pemasukanBulanIniRow?._sum.nominal ? Number(pemasukanBulanIniRow._sum.nominal) : 0
        const pengeluaranBulanIni = pengeluaranBulanIniRow?._sum.nominal ? Number(pengeluaranBulanIniRow._sum.nominal) : 0

        // 3. Kalkulasi Arus Kas 6 Bulan Terakhir
        const sixMonthsAgo = startOfMonth(subMonths(now, 5))
        const rawMonthlyTransactions = await db.transaksi.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                nominal: true,
                jenisTransaksi: true,
                createdAt: true,
            },
        })

        const monthlyCashflow = []
        for (let i = 5; i >= 0; i--) {
            const m = subMonths(now, i)
            const mStart = startOfMonth(m)
            const mEnd = endOfMonth(m)
            const monthLabel = format(m, "MMM yyyy", { locale: localeId })

            let monthPemasukan = 0
            let monthPengeluaran = 0

            for (const tx of rawMonthlyTransactions) {
                const txDate = new Date(tx.createdAt)
                if (txDate >= mStart && txDate <= mEnd) {
                    const amt = Number(tx.nominal)
                    if (tx.jenisTransaksi === "PEMASUKAN") {
                        monthPemasukan += amt
                    } else {
                        monthPengeluaran += amt
                    }
                }
            }

            monthlyCashflow.push({
                monthLabel,
                pemasukan: monthPemasukan,
                pengeluaran: monthPengeluaran,
                net: monthPemasukan - monthPengeluaran,
            })
        }

        // 4. Kalkulasi KTB & Pengontrolan
        let ktbMacetCount = 0
        let ktbVakumCount = 0
        const ktbAttentionList: DashboardSummaryData["ktbAttentionList"] = []

        for (const ktb of allKTBWithLastPengontrolan) {
            const lastCheck = ktb.pengontrolan[0]
            const status: StatusPengontrolan | "BELUM_DIKONTROL" = lastCheck ? lastCheck.status : "BELUM_DIKONTROL"

            if (status === StatusPengontrolan.MACET) {
                ktbMacetCount++
                ktbAttentionList.push({
                    id: ktb.id,
                    nama: ktb.nama,
                    angkatan: ktb.angkatan,
                    pemimpinNama: ktb.pemimpin.nama,
                    lastStatus: status,
                    lastTanggalFormatted: lastCheck?.tanggal
                        ? format(new Date(lastCheck.tanggal), "d MMM yyyy", { locale: localeId })
                        : null,
                    keterangan: lastCheck?.keterangan || "Kelompok terindikasi macet",
                })
            } else if (status === StatusPengontrolan.VAKUM) {
                ktbVakumCount++
                ktbAttentionList.push({
                    id: ktb.id,
                    nama: ktb.nama,
                    angkatan: ktb.angkatan,
                    pemimpinNama: ktb.pemimpin.nama,
                    lastStatus: status,
                    lastTanggalFormatted: lastCheck?.tanggal
                        ? format(new Date(lastCheck.tanggal), "d MMM yyyy", { locale: localeId })
                        : null,
                    keterangan: lastCheck?.keterangan || "Kelompok vakum sementara",
                })
            } else if (status === "BELUM_DIKONTROL") {
                ktbAttentionList.push({
                    id: ktb.id,
                    nama: ktb.nama,
                    angkatan: ktb.angkatan,
                    pemimpinNama: ktb.pemimpin.nama,
                    lastStatus: status,
                    lastTanggalFormatted: null,
                    keterangan: "Belum pernah dilakukan pengontrolan",
                })
            }
        }

        // 5. Kalkulasi Kehadiran & Tren
        // Urutkan recent kegiatan dari terlama ke terbaru (kronologis kiri ke kanan pada chart)
        const sortedRecentKegiatan = [...recentKegiatanRaw].reverse()
        const attendanceTrend = sortedRecentKegiatan.map((keg) => {
            const totalHadir = keg.kehadiran.length
            const anggotaHadir = keg.kehadiran.filter(
                (h) => h.status === "APMK" || h.status === "AKTB"
            ).length
            const pengunjungHadir = keg.kehadiran.filter((h) => h.status === "NON_APMK").length

            return {
                id: keg.id,
                nama: keg.nama,
                tanggalFormatted: format(new Date(keg.tanggal), "d MMM", { locale: localeId }),
                totalHadir,
                anggotaHadir,
                pengunjungHadir,
            }
        })

        const avgKehadiran = totalKegiatan > 0 ? Math.round(totalKehadiranAll / totalKegiatan) : 0
        const persenAnggotaKTB = totalAnggota > 0 ? Math.round((totalAnggotaKTB / totalAnggota) * 100) : 0

        // 6. Demografi Prodi & Angkatan
        const prodiDistribution = prodiGroups.map((g) => ({
            prodi: g.prodi || "Lainnya / Belum Terdata",
            count: g._count.id,
            percentage: totalAnggota > 0 ? Math.round((g._count.id / totalAnggota) * 100) : 0,
        }))

        const angkatanDistribution = angkatanGroups
            .filter((g) => g.angkatan !== null)
            .map((g) => ({
                angkatan: g.angkatan?.toString() || "Lainnya",
                count: g._count.id,
            }))

        // 7. Format Transaksi Terkini
        const recentTransactions = recentTransactionsRaw.map((tx) => ({
            id: tx.id,
            jenisTransaksi: tx.jenisTransaksi,
            nominal: Number(tx.nominal),
            keterangan: tx.keterangan,
            kasNama: tx.kas.nama,
            createdAt: tx.createdAt,
            tanggalFormatted: format(new Date(tx.createdAt), "d MMM yyyy, HH:mm", { locale: localeId }),
        }))

        // Format Kegiatan Terdekat
        const upcoming = upcomingKegiatanRaw || activePresensiKegiatanRaw || recentKegiatanRaw[0] || null

        return {
            success: true,
            data: {
                greeting: "Admin",
                currentDateFormatted: format(now, "EEEE, d MMMM yyyy", { locale: localeId }),
                activePresensiKegiatan: activePresensiKegiatanRaw
                    ? {
                        id: activePresensiKegiatanRaw.id,
                        nama: activePresensiKegiatanRaw.nama,
                        tanggal: activePresensiKegiatanRaw.tanggal,
                        isPresensiOpen: activePresensiKegiatanRaw.isPresensiOpen,
                        presensiToken: activePresensiKegiatanRaw.presensiToken,
                        jenisKegiatanNama: activePresensiKegiatanRaw.jenisKegiatan.nama,
                    }
                    : null,
                upcomingKegiatan: upcoming
                    ? {
                        id: upcoming.id,
                        nama: upcoming.nama,
                        tanggal: upcoming.tanggal,
                        waktu: "waktu" in upcoming ? (upcoming.waktu as Date | null) : null,
                        lokasi: "lokasi" in upcoming ? (upcoming.lokasi as string | null) : null,
                        pembicara: "pembicara" in upcoming ? (upcoming.pembicara as string | null) : null,
                        isPresensiOpen: upcoming.isPresensiOpen,
                        presensiToken: upcoming.presensiToken,
                        jenisKegiatanNama:
                            "jenisKegiatan" in upcoming && upcoming.jenisKegiatan
                                ? (upcoming.jenisKegiatan as { nama: string }).nama
                                : "Kegiatan PMK",
                    }
                    : null,
                metrics: {
                    totalAnggota,
                    totalLakiLaki,
                    totalPerempuan,
                    totalAnggotaKTB,
                    persenAnggotaKTB,
                    totalKTB,
                    totalKTBAktif,
                    ktbMacetCount,
                    ktbVakumCount,
                    totalSaldoKas,
                    pemasukanBulanIni,
                    pengeluaranBulanIni,
                    totalKegiatan,
                    avgKehadiran,
                    totalKehadiranAll,
                },
                attendanceTrend,
                monthlyCashflow,
                prodiDistribution,
                angkatanDistribution,
                ktbAttentionList: ktbAttentionList.slice(0, 5),
                recentTransactions,
            },
        }
    } catch (error) {
        console.error("Error getDashboardSummary:", error)
        return {
            success: false,
            message: "Gagal memuat ringkasan dashboard",
        }
    }
}
