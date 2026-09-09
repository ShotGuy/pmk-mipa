"use server"

import { db } from "@/lib/db"
import { StatusPengontrolan } from "@prisma/client"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

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

export interface KTBDashboardData {
    role: "KOORKTB" | "ANGGOTAKTB"
    firstName: string
    fullName: string
    timeGreeting: string
    currentDateFormatted: string

    todayHpdt: {
        id?: string
        isFilled: boolean
        isSate: boolean
        isDoa: boolean
        isAttendedKTB: boolean
        isGereja: boolean
        ayatAlkitab?: string | null
        judulBuku?: string | null
    }

    hpdtMonthlyStats: {
        sateCount: number
        doaCount: number
        ktbCount: number
        gerejaCount: number
        elapsedDays: number
        satePercentage: number
        doaPercentage: number
    }

    teamHpdtToday?: Array<{
        idPengurus: string
        nama: string
        jabatan: string
        isFilledToday: boolean
        isSate: boolean
        isDoa: boolean
    }>

    ktbMetrics: {
        totalKTB: number
        totalKTBAktif: number
        totalKTBMerger: number
        totalAnggotaKTB: number
        controlledThisMonthCount: number
        uncontrolledThisMonthCount: number
        complianceRate: number
    }

    uncontrolledKTBs: Array<{
        id: string
        nama: string
        angkatan: number
        pemimpinNama: string
        pendampingNama: string
        lastStatus: StatusPengontrolan | "BELUM_PERNAH"
        lastControlledFormatted: string | null
    }>

    recentPengontrolan: Array<{
        id: string
        ktbId: string
        ktbNama: string
        tanggalFormatted: string
        status: StatusPengontrolan
        bahan: string | null
        keterangan: string | null
        pendampingNama: string
        pemimpinNama: string
    }>
}

export async function getKTBDashboardData(): Promise<{
    success: boolean
    data?: KTBDashboardData
    message?: string
}> {
    try {
        const session = await auth()
        const role = (session?.user?.role || "ANGGOTAKTB") as "KOORKTB" | "ANGGOTAKTB"
        const idAnggota = session?.user?.idAnggota

        const now = new Date()
        const startCurrentMonth = startOfMonth(now)
        const endCurrentMonth = endOfMonth(now)
        const todayNormalized = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0))

        const userBp = idAnggota
            ? await db.badanPengurus.findFirst({
                  where: { idAnggota, status: true },
                  include: { anggota: true },
              })
            : null

        const fullName = userBp?.anggota?.nama || session?.user?.name || "Pengurus KTB"
        const firstName = fullName.trim().split(" ")[0]

        const hours = now.getHours()
        let timeGreeting = "Selamat Datang"
        if (hours >= 4 && hours < 11) {
            timeGreeting = "Selamat Pagi"
        } else if (hours >= 11 && hours < 15) {
            timeGreeting = "Selamat Siang"
        } else if (hours >= 15 && hours < 18) {
            timeGreeting = "Selamat Sore"
        } else {
            timeGreeting = "Selamat Malam"
        }

        // Today HPDT
        const todayHpdtRecord = userBp
            ? await db.hpdt.findFirst({
                  where: {
                      idPengurus: userBp.id,
                      tanggal: todayNormalized,
                  },
              })
            : null

        // Monthly personal HPDT
        const personalMonthlyRecords = userBp
            ? await db.hpdt.findMany({
                  where: {
                      idPengurus: userBp.id,
                      tanggal: { gte: startCurrentMonth, lte: endCurrentMonth },
                  },
              })
            : []

        const sateCount = personalMonthlyRecords.filter((r) => r.isSate).length
        const doaCount = personalMonthlyRecords.filter((r) => r.isDoa).length
        const ktbCount = personalMonthlyRecords.filter((r) => r.isAttendedKTB).length
        const gerejaCount = personalMonthlyRecords.filter((r) => r.isGereja).length
        const elapsedDays = Math.min(now.getDate(), endCurrentMonth.getDate())
        const satePercentage = elapsedDays > 0 ? Math.round((sateCount / elapsedDays) * 100) : 0
        const doaPercentage = elapsedDays > 0 ? Math.round((doaCount / elapsedDays) * 100) : 0

        // Team HPDT (Koordinator only)
        let teamHpdtToday: KTBDashboardData["teamHpdtToday"] = undefined
        if (role === "KOORKTB") {
            const teamBps = await db.badanPengurus.findMany({
                where: {
                    status: true,
                    jabatan: { in: ["KOORDINATOR_KTB", "ANGGOTA_KTB"] },
                },
                include: {
                    anggota: { select: { nama: true } },
                    hpdt: {
                        where: { tanggal: todayNormalized },
                    },
                },
                orderBy: { jabatan: "asc" },
            })

            teamHpdtToday = teamBps.map((bp) => {
                const todayRec = bp.hpdt[0]
                return {
                    idPengurus: bp.id,
                    nama: bp.anggota?.nama || "Pengurus",
                    jabatan: bp.jabatan === "KOORDINATOR_KTB" ? "Koordinator KTB" : "Anggota Seksi KTB",
                    isFilledToday: !!todayRec,
                    isSate: todayRec?.isSate || false,
                    isDoa: todayRec?.isDoa || false,
                }
            })
        }

        // KTB Scoping: ANGGOTAKTB only sees their mentored KTB, KOORKTB sees all
        const ktbWhere = role === "ANGGOTAKTB" && userBp ? { idPengurus: userBp.id } : undefined

        const ktbs = await db.kTB.findMany({
            where: ktbWhere,
            include: {
                pemimpin: { select: { nama: true } },
                pengurus: {
                    include: {
                        anggota: { select: { nama: true } },
                    },
                },
                anggotaKTB: {
                    where: { isAktif: true },
                },
                pengontrolan: {
                    orderBy: { tanggal: "desc" },
                    take: 1,
                },
            },
            orderBy: [{ status: "asc" }, { angkatan: "desc" }, { nama: "asc" }],
        })

        const totalKTB = ktbs.length
        const totalKTBAktif = ktbs.filter((k) => k.status === "AKTIF").length
        const totalKTBMerger = ktbs.filter((k) => k.status === "MERGER").length
        const totalAnggotaKTB = ktbs.reduce((acc, k) => acc + k.anggotaKTB.length, 0)

        // Find which KTB have been controlled this month
        const thisMonthPengontrolan = await db.pengontrolan.findMany({
            where: {
                ...(ktbWhere ? { ktb: ktbWhere } : {}),
                tanggal: { gte: startCurrentMonth, lte: endCurrentMonth },
            },
            select: { idKTB: true },
        })
        const controlledKTBIds = new Set(thisMonthPengontrolan.map((p) => p.idKTB))
        const controlledThisMonthCount = ktbs.filter((k) => controlledKTBIds.has(k.id)).length
        const uncontrolledThisMonthCount = totalKTB - controlledThisMonthCount
        const complianceRate = totalKTB > 0 ? Math.round((controlledThisMonthCount / totalKTB) * 100) : 0

        const uncontrolledKTBs = ktbs
            .filter((k) => !controlledKTBIds.has(k.id) && k.status === "AKTIF")
            .map((k) => {
                const lastP = k.pengontrolan[0]
                return {
                    id: k.id,
                    nama: k.nama,
                    angkatan: k.angkatan,
                    pemimpinNama: k.pemimpin.nama,
                    pendampingNama: k.pengurus.anggota?.nama || "-",
                    lastStatus: (lastP?.status as StatusPengontrolan) || "BELUM_PERNAH",
                    lastControlledFormatted: lastP
                        ? format(lastP.tanggal, "d MMM yyyy", { locale: localeId })
                        : null,
                }
            })

        // Recent Pengontrolan
        const recentPengontrolanRaw = await db.pengontrolan.findMany({
            where: ktbWhere ? { ktb: ktbWhere } : undefined,
            orderBy: [{ tanggal: "desc" }, { createdAt: "desc" }],
            take: 5,
            include: {
                ktb: {
                    include: {
                        pemimpin: { select: { nama: true } },
                        pengurus: {
                            include: {
                                anggota: { select: { nama: true } },
                            },
                        },
                    },
                },
            },
        })

        const recentPengontrolan = recentPengontrolanRaw.map((p) => ({
            id: p.id,
            ktbId: p.ktb.id,
            ktbNama: p.ktb.nama,
            tanggalFormatted: format(p.tanggal, "d MMMM yyyy", { locale: localeId }),
            status: p.status,
            bahan: p.bahan,
            keterangan: p.keterangan,
            pendampingNama: p.ktb.pengurus.anggota?.nama || "-",
            pemimpinNama: p.ktb.pemimpin.nama,
        }))

        return {
            success: true,
            data: {
                role,
                firstName,
                fullName,
                timeGreeting,
                currentDateFormatted: format(now, "EEEE, d MMMM yyyy", { locale: localeId }),
                todayHpdt: {
                    id: todayHpdtRecord?.id,
                    isFilled: !!todayHpdtRecord,
                    isSate: todayHpdtRecord?.isSate || false,
                    isDoa: todayHpdtRecord?.isDoa || false,
                    isAttendedKTB: todayHpdtRecord?.isAttendedKTB || false,
                    isGereja: todayHpdtRecord?.isGereja || false,
                    ayatAlkitab: todayHpdtRecord?.ayatAlkitab,
                    judulBuku: todayHpdtRecord?.judulBuku,
                },
                hpdtMonthlyStats: {
                    sateCount,
                    doaCount,
                    ktbCount,
                    gerejaCount,
                    elapsedDays,
                    satePercentage,
                    doaPercentage,
                },
                teamHpdtToday,
                ktbMetrics: {
                    totalKTB,
                    totalKTBAktif,
                    totalKTBMerger,
                    totalAnggotaKTB,
                    controlledThisMonthCount,
                    uncontrolledThisMonthCount,
                    complianceRate,
                },
                uncontrolledKTBs,
                recentPengontrolan,
            },
        }
    } catch (error) {
        console.error("Error getKTBDashboardData:", error)
        return {
            success: false,
            message: "Gagal memuat data dashboard KTB",
        }
    }
}

export async function quickSaveTodayHPDT(formData: {
    isSate: boolean
    isDoa: boolean
    isAttendedKTB: boolean
    isGereja: boolean
    ayatAlkitab?: string | null
    judulBuku?: string | null
}) {
    try {
        const session = await auth()
        const idAnggota = session?.user?.idAnggota
        if (!idAnggota) {
            return { success: false, message: "Sesi tidak valid" }
        }

        const bp = await db.badanPengurus.findFirst({
            where: { idAnggota, status: true },
            select: { id: true },
        })
        if (!bp) {
            return { success: false, message: "Profil Badan Pengurus tidak ditemukan" }
        }

        const now = new Date()
        const todayNormalized = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0))

        const existing = await db.hpdt.findFirst({
            where: {
                idPengurus: bp.id,
                tanggal: todayNormalized,
            },
        })

        if (existing) {
            await db.hpdt.update({
                where: { id: existing.id },
                data: {
                    isSate: formData.isSate,
                    isDoa: formData.isDoa,
                    isAttendedKTB: formData.isAttendedKTB,
                    isGereja: formData.isGereja,
                    ayatAlkitab: formData.ayatAlkitab ?? existing.ayatAlkitab,
                    judulBuku: formData.judulBuku ?? existing.judulBuku,
                },
            })
        } else {
            await db.hpdt.create({
                data: {
                    idPengurus: bp.id,
                    tanggal: todayNormalized,
                    isSate: formData.isSate,
                    isDoa: formData.isDoa,
                    isAttendedKTB: formData.isAttendedKTB,
                    isGereja: formData.isGereja,
                    ayatAlkitab: formData.ayatAlkitab || null,
                    judulBuku: formData.judulBuku || null,
                },
            })
        }

        revalidatePath("/admin/dashboard")
        revalidatePath("/admin/hpdt")
        return { success: true, message: "HPDT hari ini berhasil diperbarui!" }
    } catch (error) {
        console.error("Error quickSaveTodayHPDT:", error)
        return { success: false, message: "Gagal menyimpan HPDT" }
    }
}

