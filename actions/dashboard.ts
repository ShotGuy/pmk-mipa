"use server"

import { db } from "@/lib/db"
import { StatusPengontrolan, Role } from "@prisma/client"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { revalidatePath } from "next/cache"
import { requireAuth, requireRole } from "@/lib/rbac"

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
    const authCheck = await requireRole([Role.ADMIN])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

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
    const authCheck = await requireRole([Role.ADMIN, Role.KOORKTB, Role.ANGGOTAKTB])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const { user, session } = authCheck
        const role = user.role as "KOORKTB" | "ANGGOTAKTB"
        const idAnggota = user.idAnggota

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
    const authCheck = await requireAuth()
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const idAnggota = authCheck.user.idAnggota
        if (!idAnggota) {
            return { success: false, message: "Sesi tidak valid atau akun belum terhubung dengan data anggota." }
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

// ==========================================
// KETUA DASHBOARD DATA & SERVER ACTION
// ==========================================

export interface KetuaDashboardData {
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
    metrics: {
        totalAnggota: number
        totalKTBAktif: number
        ktbMacetAtauVakum: number
        totalSaldoKas: number
        pengontrolanBulanIni: number
        totalBadanPengurus: number
    }
    ktbHealth: {
        totalKTB: number
        aktif: number
        vakum: number
        macet: number
        merger: number
        attentionList: Array<{
            id: string
            nama: string
            pemimpinNama: string
            pendampingNama: string
            status: string
            lastControlledDate: string | null
            daysSinceLastControl: number | null
            keterangan: string | null
        }>
    }
    divisionHpdtCompliance: Array<{
        division: string
        totalPengurus: number
        avgSate: number
        avgDoa: number
    }>
    recentPengontrolan: Array<{
        id: string
        ktbNama: string
        pemimpinNama: string
        pendampingNama: string
        status: StatusPengontrolan
        tanggalFormatted: string
        bahan: string | null
    }>
}

export async function getKetuaDashboardData(): Promise<{
    success: boolean
    data?: KetuaDashboardData
    message?: string
}> {
    const authCheck = await requireRole([Role.ADMIN, Role.KETUA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const { user, session } = authCheck
        const idAnggota = user.idAnggota

        const now = new Date()
        const currentHour = now.getHours()
        let timeGreeting = "Selamat Datang"
        if (currentHour >= 4 && currentHour < 11) timeGreeting = "Selamat Pagi"
        else if (currentHour >= 11 && currentHour < 15) timeGreeting = "Selamat Siang"
        else if (currentHour >= 15 && currentHour < 18) timeGreeting = "Selamat Sore"
        else timeGreeting = "Selamat Malam"

        const userBp = idAnggota
            ? await db.badanPengurus.findFirst({
                  where: { idAnggota, status: true },
                  include: {
                      anggota: { select: { nama: true } },
                  },
              })
            : null

        const fullName = userBp?.anggota?.nama || session?.user?.name || "Ketua PMK"
        const firstName = fullName.split(" ")[0]

        const startCurrentMonth = startOfMonth(now)
        const endCurrentMonth = endOfMonth(now)
        const todayNormalized = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0))

        // Personal HPDT
        const todayHpdtRecord = userBp
            ? await db.hpdt.findFirst({
                  where: {
                      idPengurus: userBp.id,
                      tanggal: todayNormalized,
                  },
              })
            : null

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

        // Macro metrics
        const [totalAnggota, allKtbs, totalBadanPengurus, pengontrolanBulanIni] = await Promise.all([
            db.anggota.count(),
            db.kTB.findMany({
                include: {
                    pemimpin: { select: { nama: true } },
                    pengurus: {
                        include: {
                            anggota: { select: { nama: true } },
                        },
                    },
                    pengontrolan: {
                        orderBy: { tanggal: "desc" },
                        take: 1,
                    },
                },
                orderBy: { nama: "asc" },
            }),
            db.badanPengurus.count({ where: { status: true } }),
            db.pengontrolan.count({
                where: {
                    tanggal: { gte: startCurrentMonth, lte: endCurrentMonth },
                },
            }),
        ])

        // Kas calculation
        const kasList = await db.kas.findMany({ select: { id: true, saldo: true } })
        const transaksiGroup = await db.transaksi.groupBy({
            by: ["idKas", "jenisTransaksi"],
            _sum: { nominal: true },
        })

        let totalSaldoKas = 0
        for (const k of kasList) {
            const saldoAwal = Number(k.saldo)
            const masuk = Number(
                transaksiGroup.find((g) => g.idKas === k.id && g.jenisTransaksi === "PEMASUKAN")?._sum
                    .nominal || 0
            )
            const keluar = Number(
                transaksiGroup.find((g) => g.idKas === k.id && g.jenisTransaksi === "PENGELUARAN")?._sum
                    .nominal || 0
            )
            totalSaldoKas += saldoAwal + masuk - keluar
        }

        const totalKTB = allKtbs.length
        let aktif = 0
        let vakum = 0
        let macet = 0
        let merger = 0

        // KTB attention list: vakum, macet, or last control > 14 days ago or never
        const attentionList: KetuaDashboardData["ktbHealth"]["attentionList"] = []
        for (const k of allKtbs) {
            const lastCtrl = k.pengontrolan[0]
            const lastDate = lastCtrl ? new Date(lastCtrl.tanggal) : null
            const daysSince = lastDate
                ? Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
                : null

            const controlStatus = lastCtrl?.status

            if (k.status === "MERGER") {
                merger++
            } else if (controlStatus === StatusPengontrolan.MACET) {
                macet++
            } else if (controlStatus === StatusPengontrolan.VAKUM) {
                vakum++
            } else {
                aktif++
            }

            const isTroubled = controlStatus === StatusPengontrolan.VAKUM || controlStatus === StatusPengontrolan.MACET
            const isOutdated = k.status === "AKTIF" && (daysSince === null || daysSince > 14)

            if (isTroubled || isOutdated) {
                attentionList.push({
                    id: k.id,
                    nama: k.nama,
                    pemimpinNama: k.pemimpin.nama,
                    pendampingNama: k.pengurus.anggota.nama,
                    status: controlStatus || k.status,
                    lastControlledDate: lastDate
                        ? format(lastDate, "d MMM yyyy", { locale: localeId })
                        : null,
                    daysSinceLastControl: daysSince,
                    keterangan: lastCtrl?.keterangan || (isOutdated ? "Belum dikontrol > 14 hari" : null),
                })
            }
        }

        // Division HPDT compliance
        const allBpsWithHpdt = await db.badanPengurus.findMany({
            where: { status: true },
            include: {
                hpdt: {
                    where: {
                        tanggal: { gte: startCurrentMonth, lte: endCurrentMonth },
                    },
                },
            },
        })

        const divisions = [
            {
                name: "Pimpinan Inti (BPH)",
                jabatans: ["KETUA", "SEKRETARIS", "BENDAHARA"],
            },
            {
                name: "Seksi KTB",
                jabatans: ["KOORDINATOR_KTB", "ANGGOTA_KTB"],
            },
            {
                name: "Seksi Acara",
                jabatans: ["KOORDINATOR_ACARA", "ANGGOTA_ACARA"],
            },
            {
                name: "Seksi Doa & Pemerhati",
                jabatans: ["KOORDINATOR_DOA_DAN_PEMERHATI", "ANGGOTA_DOA_DAN_PEMERHATI"],
            },
        ]

        const divisionHpdtCompliance = divisions.map((div) => {
            const divBps = allBpsWithHpdt.filter((b) => div.jabatans.includes(b.jabatan))
            const totalPengurus = divBps.length
            if (totalPengurus === 0) {
                return {
                    division: div.name,
                    totalPengurus: 0,
                    avgSate: 0,
                    avgDoa: 0,
                }
            }

            let totalSateSum = 0
            let totalDoaSum = 0
            for (const bp of divBps) {
                const sCount = bp.hpdt.filter((r) => r.isSate).length
                const dCount = bp.hpdt.filter((r) => r.isDoa).length
                const sPct = elapsedDays > 0 ? Math.round((sCount / elapsedDays) * 100) : 0
                const dPct = elapsedDays > 0 ? Math.round((dCount / elapsedDays) * 100) : 0
                totalSateSum += sPct
                totalDoaSum += dPct
            }

            return {
                division: div.name,
                totalPengurus,
                avgSate: Math.round(totalSateSum / totalPengurus),
                avgDoa: Math.round(totalDoaSum / totalPengurus),
            }
        })

        // Recent Pengontrolan (last 6)
        const recentCtrlRaw = await db.pengontrolan.findMany({
            take: 6,
            orderBy: { tanggal: "desc" },
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

        const recentPengontrolan = recentCtrlRaw.map((p) => ({
            id: p.id,
            ktbNama: p.ktb.nama,
            pemimpinNama: p.ktb.pemimpin.nama,
            pendampingNama: p.ktb.pengurus.anggota.nama,
            status: p.status,
            tanggalFormatted: format(new Date(p.tanggal), "d MMM yyyy", { locale: localeId }),
            bahan: p.bahan,
        }))

        return {
            success: true,
            data: {
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
                metrics: {
                    totalAnggota,
                    totalKTBAktif: aktif,
                    ktbMacetAtauVakum: vakum + macet,
                    totalSaldoKas,
                    pengontrolanBulanIni,
                    totalBadanPengurus,
                },
                ktbHealth: {
                    totalKTB,
                    aktif,
                    vakum,
                    macet,
                    merger,
                    attentionList,
                },
                divisionHpdtCompliance,
                recentPengontrolan,
            },
        }
    } catch (error) {
        console.error("Error getKetuaDashboardData:", error)
        return { success: false, message: "Gagal memuat dashboard Ketua" }
    }
}

// ==========================================
// BENDAHARA DASHBOARD DATA & SERVER ACTION
// ==========================================

export interface BendaharaDashboardData {
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
    financialMetrics: {
        totalSaldoTerkini: number
        pemasukanBulanIni: number
        pengeluaranBulanIni: number
        netBulanIni: number
        totalAkunKas: number
    }
    accounts: Array<{
        id: string
        nama: string
        saldoAwal: number
        totalPemasukan: number
        totalPengeluaran: number
        saldoTerkini: number
        transaksiCount: number
    }>
    monthlyCashflow: Array<{
        monthLabel: string
        pemasukan: number
        pengeluaran: number
        net: number
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

export async function getBendaharaDashboardData(): Promise<{
    success: boolean
    data?: BendaharaDashboardData
    message?: string
}> {
    const authCheck = await requireRole([Role.ADMIN, Role.BENDAHARA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const { user, session } = authCheck
        const idAnggota = user.idAnggota

        const now = new Date()
        const currentHour = now.getHours()
        let timeGreeting = "Selamat Datang"
        if (currentHour >= 4 && currentHour < 11) timeGreeting = "Selamat Pagi"
        else if (currentHour >= 11 && currentHour < 15) timeGreeting = "Selamat Siang"
        else if (currentHour >= 15 && currentHour < 18) timeGreeting = "Selamat Sore"
        else timeGreeting = "Selamat Malam"

        const userBp = idAnggota
            ? await db.badanPengurus.findFirst({
                  where: { idAnggota, status: true },
                  include: {
                      anggota: { select: { nama: true } },
                  },
              })
            : null

        const fullName = userBp?.anggota?.nama || session?.user?.name || "Bendahara PMK"
        const firstName = fullName.split(" ")[0]

        const startCurrentMonth = startOfMonth(now)
        const endCurrentMonth = endOfMonth(now)
        const todayNormalized = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0))

        // Personal HPDT
        const todayHpdtRecord = userBp
            ? await db.hpdt.findFirst({
                  where: {
                      idPengurus: userBp.id,
                      tanggal: todayNormalized,
                  },
              })
            : null

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

        // Kas accounts & transactions
        const kasList = await db.kas.findMany({ orderBy: { nama: "asc" } })
        const [summaryAll, summaryMonth, countPerKas, recentRaw] = await Promise.all([
            db.transaksi.groupBy({
                by: ["idKas", "jenisTransaksi"],
                _sum: { nominal: true },
            }),
            db.transaksi.groupBy({
                by: ["jenisTransaksi"],
                where: {
                    createdAt: { gte: startCurrentMonth, lte: endCurrentMonth },
                },
                _sum: { nominal: true },
            }),
            db.transaksi.groupBy({
                by: ["idKas"],
                _count: { id: true },
            }),
            db.transaksi.findMany({
                take: 10,
                orderBy: { createdAt: "desc" },
                include: { kas: { select: { nama: true } } },
            }),
        ])

        const pemasukanBulanIni = Number(
            summaryMonth.find((s) => s.jenisTransaksi === "PEMASUKAN")?._sum.nominal || 0
        )
        const pengeluaranBulanIni = Number(
            summaryMonth.find((s) => s.jenisTransaksi === "PENGELUARAN")?._sum.nominal || 0
        )
        const netBulanIni = pemasukanBulanIni - pengeluaranBulanIni

        let totalSaldoTerkini = 0
        const accounts = kasList.map((item) => {
            const saldoAwal = Number(item.saldo)
            const masuk = Number(
                summaryAll.find((s) => s.idKas === item.id && s.jenisTransaksi === "PEMASUKAN")?._sum
                    .nominal || 0
            )
            const keluar = Number(
                summaryAll.find((s) => s.idKas === item.id && s.jenisTransaksi === "PENGELUARAN")?._sum
                    .nominal || 0
            )
            const saldoTerkini = saldoAwal + masuk - keluar
            totalSaldoTerkini += saldoTerkini

            const txCount = countPerKas.find((c) => c.idKas === item.id)?._count.id || 0

            return {
                id: item.id,
                nama: item.nama,
                saldoAwal,
                totalPemasukan: masuk,
                totalPengeluaran: keluar,
                saldoTerkini,
                transaksiCount: txCount,
            }
        })

        // 6 Months cashflow trend
        const monthlyCashflow: BendaharaDashboardData["monthlyCashflow"] = []
        for (let i = 5; i >= 0; i--) {
            const mDate = subMonths(now, i)
            const mStart = startOfMonth(mDate)
            const mEnd = endOfMonth(mDate)

            const mSummary = await db.transaksi.groupBy({
                by: ["jenisTransaksi"],
                where: { createdAt: { gte: mStart, lte: mEnd } },
                _sum: { nominal: true },
            })

            const masuk = Number(mSummary.find((s) => s.jenisTransaksi === "PEMASUKAN")?._sum.nominal || 0)
            const keluar = Number(mSummary.find((s) => s.jenisTransaksi === "PENGELUARAN")?._sum.nominal || 0)

            monthlyCashflow.push({
                monthLabel: format(mDate, "MMM yyyy", { locale: localeId }),
                pemasukan: masuk,
                pengeluaran: keluar,
                net: masuk - keluar,
            })
        }

        const recentTransactions = recentRaw.map((t) => ({
            id: t.id,
            jenisTransaksi: t.jenisTransaksi,
            nominal: Number(t.nominal),
            keterangan: t.keterangan,
            kasNama: t.kas.nama,
            createdAt: t.createdAt,
            tanggalFormatted: format(new Date(t.createdAt), "d MMM yyyy, HH:mm", { locale: localeId }),
        }))

        return {
            success: true,
            data: {
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
                financialMetrics: {
                    totalSaldoTerkini,
                    pemasukanBulanIni,
                    pengeluaranBulanIni,
                    netBulanIni,
                    totalAkunKas: kasList.length,
                },
                accounts,
                monthlyCashflow,
                recentTransactions,
            },
        }
    } catch (error) {
        console.error("Error getBendaharaDashboardData:", error)
        return { success: false, message: "Gagal memuat dashboard Bendahara" }
    }
}

// ==========================================
// SEKRETARIS DASHBOARD DATA & SERVER ACTION
// ==========================================

export interface SekretarisDashboardData {
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
    adminMetrics: {
        totalAnggota: number
        totalLakiLaki: number
        totalPerempuan: number
        persenLakiLaki: number
        persenPerempuan: number
        totalKegiatan: number
        avgKehadiran: number
    }
    prodiDistribution: Array<{
        prodi: string
        count: number
        percentage: number
    }>
    angkatanDistribution: Array<{
        angkatan: string
        count: number
    }>
    ageDemographics: Array<{
        bracket: string
        count: number
        percentage: number
    }>
    upcomingKegiatan: {
        id: string
        nama: string
        tanggal: Date
        tanggalFormatted: string
        waktuFormatted: string | null
        lokasi: string | null
        pembicara: string | null
        isPresensiOpen: boolean
        presensiToken: string | null
        jenisKegiatanNama: string
    } | null
    recentKegiatanAttendance: Array<{
        id: string
        nama: string
        tanggalFormatted: string
        totalHadir: number
        anggotaHadir: number
        pengunjungHadir: number
    }>
}

export async function getSekretarisDashboardData(): Promise<{
    success: boolean
    data?: SekretarisDashboardData
    message?: string
}> {
    const authCheck = await requireRole([Role.ADMIN, Role.SEKRETARIS])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const { user, session } = authCheck
        const idAnggota = user.idAnggota

        const now = new Date()
        const currentHour = now.getHours()
        let timeGreeting = "Selamat Datang"
        if (currentHour >= 4 && currentHour < 11) timeGreeting = "Selamat Pagi"
        else if (currentHour >= 11 && currentHour < 15) timeGreeting = "Selamat Siang"
        else if (currentHour >= 15 && currentHour < 18) timeGreeting = "Selamat Sore"
        else timeGreeting = "Selamat Malam"

        const userBp = idAnggota
            ? await db.badanPengurus.findFirst({
                  where: { idAnggota, status: true },
                  include: {
                      anggota: { select: { nama: true } },
                  },
              })
            : null

        const fullName = userBp?.anggota?.nama || session?.user?.name || "Sekretaris PMK"
        const firstName = fullName.split(" ")[0]

        const startCurrentMonth = startOfMonth(now)
        const endCurrentMonth = endOfMonth(now)
        const todayNormalized = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0))

        // Personal HPDT
        const todayHpdtRecord = userBp
            ? await db.hpdt.findFirst({
                  where: {
                      idPengurus: userBp.id,
                      tanggal: todayNormalized,
                  },
              })
            : null

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

        // Members & Demographics
        const allMembers = await db.anggota.findMany({
            select: {
                id: true,
                prodi: true,
                angkatan: true,
                jenisKelamin: true,
                tanggalLahir: true,
            },
        })

        const totalAnggota = allMembers.length
        let totalLakiLaki = 0
        let totalPerempuan = 0

        // Prodi counts
        const prodiMap = new Map<string, number>()
        // Angkatan counts
        const angkatanMap = new Map<string, number>()
        // Age brackets
        const ageBuckets = {
            under19: 0,
            nineteenTo21: 0,
            twentyTwoTo24: 0,
            above24: 0,
            unspecified: 0,
        }

        for (const m of allMembers) {
            if (m.jenisKelamin === "L") totalLakiLaki++
            else if (m.jenisKelamin === "P") totalPerempuan++

            const p = m.prodi || "Lainnya"
            prodiMap.set(p, (prodiMap.get(p) || 0) + 1)

            const a = m.angkatan ? String(m.angkatan) : "Tidak Diketahui"
            angkatanMap.set(a, (angkatanMap.get(a) || 0) + 1)

            if (!m.tanggalLahir) {
                ageBuckets.unspecified++
            } else {
                const birth = new Date(m.tanggalLahir)
                const age = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                if (age < 19) ageBuckets.under19++
                else if (age <= 21) ageBuckets.nineteenTo21++
                else if (age <= 24) ageBuckets.twentyTwoTo24++
                else ageBuckets.above24++
            }
        }

        const persenLakiLaki = totalAnggota > 0 ? Math.round((totalLakiLaki / totalAnggota) * 100) : 0
        const persenPerempuan = totalAnggota > 0 ? Math.round((totalPerempuan / totalAnggota) * 100) : 0

        const prodiDistribution = Array.from(prodiMap.entries())
            .map(([prodi, count]) => ({
                prodi,
                count,
                percentage: totalAnggota > 0 ? Math.round((count / totalAnggota) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count)

        const angkatanDistribution = Array.from(angkatanMap.entries())
            .map(([angkatan, count]) => ({
                angkatan,
                count,
            }))
            .sort((a, b) => b.angkatan.localeCompare(a.angkatan))

        const ageDemographics = [
            {
                bracket: "< 19 Tahun",
                count: ageBuckets.under19,
                percentage: totalAnggota > 0 ? Math.round((ageBuckets.under19 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "19 - 21 Tahun",
                count: ageBuckets.nineteenTo21,
                percentage: totalAnggota > 0 ? Math.round((ageBuckets.nineteenTo21 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "22 - 24 Tahun",
                count: ageBuckets.twentyTwoTo24,
                percentage: totalAnggota > 0 ? Math.round((ageBuckets.twentyTwoTo24 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "> 24 Tahun",
                count: ageBuckets.above24,
                percentage: totalAnggota > 0 ? Math.round((ageBuckets.above24 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "Belum Diisi",
                count: ageBuckets.unspecified,
                percentage: totalAnggota > 0 ? Math.round((ageBuckets.unspecified / totalAnggota) * 100) : 0,
            },
        ]

        // Kegiatan metrics & upcoming
        const totalKegiatan = await db.kegiatan.count()
        const totalKehadiranAll = await db.kehadiran.count()
        const avgKehadiran = totalKegiatan > 0 ? Math.round(totalKehadiranAll / totalKegiatan) : 0

        const upcomingRaw = await db.kegiatan.findFirst({
            where: { tanggal: { gte: todayNormalized } },
            orderBy: { tanggal: "asc" },
            include: { jenisKegiatan: { select: { nama: true } } },
        })

        const upcomingKegiatan = upcomingRaw
            ? {
                  id: upcomingRaw.id,
                  nama: upcomingRaw.nama,
                  tanggal: upcomingRaw.tanggal,
                  tanggalFormatted: format(new Date(upcomingRaw.tanggal), "EEEE, d MMMM yyyy", { locale: localeId }),
                  waktuFormatted: upcomingRaw.waktu ? format(new Date(upcomingRaw.waktu), "HH:mm") + " WIB" : null,
                  lokasi: upcomingRaw.lokasi,
                  pembicara: upcomingRaw.pembicara,
                  isPresensiOpen: upcomingRaw.isPresensiOpen,
                  presensiToken: upcomingRaw.presensiToken,
                  jenisKegiatanNama: upcomingRaw.jenisKegiatan.nama,
              }
            : null

        const recentKegiatanRaw = await db.kegiatan.findMany({
            take: 5,
            orderBy: { tanggal: "desc" },
            include: {
                kehadiran: {
                    select: { status: true },
                },
            },
        })

        const recentKegiatanAttendance = recentKegiatanRaw.map((k) => {
            const totalHadir = k.kehadiran.length
            const anggotaHadir = k.kehadiran.filter((kh) => kh.status === "APMK" || kh.status === "AKTB").length
            const pengunjungHadir = k.kehadiran.filter((kh) => kh.status === "NON_APMK").length

            return {
                id: k.id,
                nama: k.nama,
                tanggalFormatted: format(new Date(k.tanggal), "d MMM yyyy", { locale: localeId }),
                totalHadir,
                anggotaHadir,
                pengunjungHadir,
            }
        })

        return {
            success: true,
            data: {
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
                adminMetrics: {
                    totalAnggota,
                    totalLakiLaki,
                    totalPerempuan,
                    persenLakiLaki,
                    persenPerempuan,
                    totalKegiatan,
                    avgKehadiran,
                },
                prodiDistribution,
                angkatanDistribution,
                ageDemographics,
                upcomingKegiatan,
                recentKegiatanAttendance,
            },
        }
    } catch (error) {
        console.error("Error getSekretarisDashboardData:", error)
        return { success: false, message: "Gagal memuat dashboard Sekretaris" }
    }
}

export interface AcaraDashboardData {
    greeting: string
    userName: string
    roleLabel: string
    isKoordinator: boolean
    currentDateFormatted: string
    todayHpdt: {
        isFilled: boolean
        isSate: boolean
        isDoa: boolean
        isAttendedKTB: boolean
        isGereja: boolean
        ayatAlkitab: string | null
        judulBuku: string | null
        sateCount: number
        doaCount: number
        ktbCount: number
        gerejaCount: number
        elapsedDays: number
        satePercentage: number
        doaPercentage: number
    }
    metrics: {
        totalAnggota: number
        totalKegiatan: number
        avgKehadiran: number
        totalKehadiranAll: number
        totalPengunjungLuar: number
        persenPartisipasiRataRata: number
    }
    prodiDistribution: Array<{
        prodi: string
        count: number
        percentage: number
    }>
    angkatanDistribution: Array<{
        angkatan: string
        count: number
    }>
    ageDemographics: Array<{
        bracket: string
        count: number
        percentage: number
    }>
    upcomingKegiatan: {
        id: string
        nama: string
        tanggal: Date
        tanggalFormatted: string
        waktuFormatted: string | null
        lokasi: string | null
        pembicara: string | null
        isPresensiOpen: boolean
        presensiToken: string | null
        jenisKegiatanNama: string
    } | null
    recentKegiatanAttendance: Array<{
        id: string
        nama: string
        tanggalFormatted: string
        totalHadir: number
        anggotaHadir: number
        pengunjungHadir: number
        persentaseDariTotalAnggota: number
    }>
}

export async function getAcaraDashboardData(): Promise<{
    success: boolean
    data?: AcaraDashboardData
    message?: string
}> {
    const authCheck = await requireRole([Role.ADMIN, Role.KOORACARA, Role.ANGGOTAACARA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const { user, session } = authCheck
        const idAnggota = user.idAnggota
        const role = user.role
        const isKoordinator = role === "KOORACARA"
        const roleLabel = isKoordinator ? "Koordinator Seksi Acara" : "Anggota Seksi Acara"

        const now = new Date()
        const currentHour = now.getHours()
        let timeGreeting = "Selamat Datang"
        if (currentHour >= 4 && currentHour < 11) timeGreeting = "Selamat Pagi"
        else if (currentHour >= 11 && currentHour < 15) timeGreeting = "Selamat Siang"
        else if (currentHour >= 15 && currentHour < 18) timeGreeting = "Selamat Sore"
        else timeGreeting = "Selamat Malam"

        const userBp = idAnggota
            ? await db.badanPengurus.findFirst({
                  where: { idAnggota, status: true },
                  include: {
                      anggota: { select: { nama: true } },
                  },
              })
            : null

        const fullName = userBp?.anggota?.nama || session?.user?.name || roleLabel
        const firstName = fullName.split(" ")[0]

        const startCurrentMonth = startOfMonth(now)
        const endCurrentMonth = endOfMonth(now)
        const todayNormalized = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0))

        // Personal HPDT
        const todayHpdtRecord = userBp
            ? await db.hpdt.findFirst({
                  where: {
                      idPengurus: userBp.id,
                      tanggal: todayNormalized,
                  },
              })
            : null

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

        // Macro metrics
        const [totalAnggota, allKegiatan, allAnggota] = await Promise.all([
            db.anggota.count(),
            db.kegiatan.findMany({
                orderBy: { tanggal: "desc" },
                include: {
                    jenisKegiatan: { select: { nama: true } },
                    kehadiran: {
                        select: {
                            status: true,
                        },
                    },
                },
            }),
            db.anggota.findMany({
                select: {
                    prodi: true,
                    angkatan: true,
                    tanggalLahir: true,
                },
            }),
        ])

        const totalKegiatan = allKegiatan.length
        let totalKehadiranAll = 0
        let totalPengunjungLuar = 0

        for (const k of allKegiatan) {
            totalKehadiranAll += k.kehadiran.length
            totalPengunjungLuar += k.kehadiran.filter((kh) => kh.status === "NON_APMK").length
        }

        const avgKehadiran = totalKegiatan > 0 ? Math.round(totalKehadiranAll / totalKegiatan) : 0
        const persenPartisipasiRataRata =
            totalAnggota > 0 ? Math.round((avgKehadiran / totalAnggota) * 100) : 0

        // Upcoming / Active Kegiatan
        const activeKegiatan = allKegiatan.find((k) => k.isPresensiOpen)
        const nextKegiatan = allKegiatan
            .slice()
            .reverse()
            .find((k) => new Date(k.tanggal) >= todayNormalized)

        const targetKegiatan = activeKegiatan || nextKegiatan || allKegiatan[0] || null

        const upcomingKegiatan: AcaraDashboardData["upcomingKegiatan"] = targetKegiatan
            ? {
                  id: targetKegiatan.id,
                  nama: targetKegiatan.nama,
                  tanggal: targetKegiatan.tanggal,
                  tanggalFormatted: format(new Date(targetKegiatan.tanggal), "EEEE, d MMMM yyyy", {
                      locale: localeId,
                  }),
                  waktuFormatted: targetKegiatan.waktu
                      ? format(new Date(targetKegiatan.waktu), "HH:mm 'WITA'")
                      : null,
                  lokasi: targetKegiatan.lokasi,
                  pembicara: targetKegiatan.pembicara,
                  isPresensiOpen: targetKegiatan.isPresensiOpen,
                  presensiToken: targetKegiatan.presensiToken,
                  jenisKegiatanNama: targetKegiatan.jenisKegiatan.nama,
              }
            : null

        // 5 recent kegiatan attendance
        const recentKegiatanAttendance = allKegiatan.slice(0, 5).map((k) => {
            const tot = k.kehadiran.length
            const anggotaHadir = k.kehadiran.filter((kh) => kh.status === "APMK" || kh.status === "AKTB").length
            const pengunjungHadir = k.kehadiran.filter((kh) => kh.status === "NON_APMK").length
            const persentaseDariTotalAnggota =
                totalAnggota > 0 ? Math.round((anggotaHadir / totalAnggota) * 100) : 0

            return {
                id: k.id,
                nama: k.nama,
                tanggalFormatted: format(new Date(k.tanggal), "d MMM", { locale: localeId }),
                totalHadir: tot,
                anggotaHadir,
                pengunjungHadir,
                persentaseDariTotalAnggota,
            }
        })

        // Demographics: Prodi
        const prodiMap = new Map<string, number>()
        for (const a of allAnggota) {
            const p = a.prodi || "Lainnya"
            prodiMap.set(p, (prodiMap.get(p) || 0) + 1)
        }
        const prodiDistribution = Array.from(prodiMap.entries())
            .map(([prodi, count]) => ({
                prodi,
                count,
                percentage: totalAnggota > 0 ? Math.round((count / totalAnggota) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count)

        // Demographics: Angkatan
        const angkatanMap = new Map<string, number>()
        for (const a of allAnggota) {
            const angk = a.angkatan ? String(a.angkatan) : "Tidak Tercatat"
            angkatanMap.set(angk, (angkatanMap.get(angk) || 0) + 1)
        }
        const angkatanDistribution = Array.from(angkatanMap.entries())
            .map(([angkatan, count]) => ({
                angkatan,
                count,
            }))
            .sort((a, b) => b.angkatan.localeCompare(a.angkatan))

        // Demographics: Age from tanggalLahir
        const ageCounts = {
            under19: 0,
            range19to21: 0,
            range22to24: 0,
            above24: 0,
            unfilled: 0,
        }

        const currentYear = now.getFullYear()
        for (const a of allAnggota) {
            if (!a.tanggalLahir) {
                ageCounts.unfilled++
            } else {
                const birthDate = new Date(a.tanggalLahir)
                let age = currentYear - birthDate.getFullYear()
                const m = now.getMonth() - birthDate.getMonth()
                if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                    age--
                }

                if (age < 19) ageCounts.under19++
                else if (age >= 19 && age <= 21) ageCounts.range19to21++
                else if (age >= 22 && age <= 24) ageCounts.range22to24++
                else ageCounts.above24++
            }
        }

        const ageDemographics = [
            {
                bracket: "< 19 Tahun",
                count: ageCounts.under19,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.under19 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "19 - 21 Tahun",
                count: ageCounts.range19to21,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.range19to21 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "22 - 24 Tahun",
                count: ageCounts.range22to24,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.range22to24 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "> 24 Tahun",
                count: ageCounts.above24,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.above24 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "Belum Diisi",
                count: ageCounts.unfilled,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.unfilled / totalAnggota) * 100) : 0,
            },
        ]

        return {
            success: true,
            data: {
                greeting: `${timeGreeting}, ${firstName}`,
                userName: fullName,
                roleLabel,
                isKoordinator,
                currentDateFormatted: format(now, "EEEE, d MMMM yyyy", { locale: localeId }),
                todayHpdt: {
                    isFilled: !!todayHpdtRecord,
                    isSate: todayHpdtRecord?.isSate || false,
                    isDoa: todayHpdtRecord?.isDoa || false,
                    isAttendedKTB: todayHpdtRecord?.isAttendedKTB || false,
                    isGereja: todayHpdtRecord?.isGereja || false,
                    ayatAlkitab: todayHpdtRecord?.ayatAlkitab || null,
                    judulBuku: todayHpdtRecord?.judulBuku || null,
                    sateCount,
                    doaCount,
                    ktbCount,
                    gerejaCount,
                    elapsedDays,
                    satePercentage,
                    doaPercentage,
                },
                metrics: {
                    totalAnggota,
                    totalKegiatan,
                    avgKehadiran,
                    totalKehadiranAll,
                    totalPengunjungLuar,
                    persenPartisipasiRataRata,
                },
                prodiDistribution,
                angkatanDistribution,
                ageDemographics,
                upcomingKegiatan,
                recentKegiatanAttendance,
            },
        }
    } catch (error) {
        console.error("Error getAcaraDashboardData:", error)
        return { success: false, message: "Gagal memuat dashboard Seksi Acara" }
    }
}

export interface DoaDashboardData {
    greeting: string
    userName: string
    roleLabel: string
    isKoordinator: boolean
    currentDateFormatted: string
    todayHpdt: {
        isFilled: boolean
        isSate: boolean
        isDoa: boolean
        isAttendedKTB: boolean
        isGereja: boolean
        ayatAlkitab: string | null
        judulBuku: string | null
        sateCount: number
        doaCount: number
        ktbCount: number
        gerejaCount: number
        elapsedDays: number
        satePercentage: number
        doaPercentage: number
    }
    metrics: {
        totalAnggota: number
        totalLakiLaki: number
        totalPerempuan: number
        totalBadanPengurus: number
        totalUlangTahunBulanIni: number
        kontakLengkapCount: number
        persenKontakLengkap: number
    }
    birthdayMembers: Array<{
        id: string
        nama: string
        jenisKelamin: string | null
        prodi: string | null
        angkatan: number | null
        noHp: string | null
        tanggalLahir: Date
        tanggalLahirFormatted: string
        birthdayFormatted: string
        birthMonth: number
        birthDay: number
        daysUntilBirthday: number
        turningAge: number
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
    ageDemographics: Array<{
        bracket: string
        count: number
        percentage: number
    }>
    pengurusDivisionStats: Array<{
        division: string
        count: number
        percentage: number
    }>
}

export async function getDoaDashboardData(): Promise<{
    success: boolean
    data?: DoaDashboardData
    message?: string
}> {
    const authCheck = await requireRole([Role.ADMIN, Role.KOORDOA, Role.ANGGOTADOA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const { user, session } = authCheck
        const idAnggota = user.idAnggota
        const role = user.role
        const isKoordinator = role === "KOORDOA"
        const roleLabel = isKoordinator ? "Koordinator Seksi Doa & Pemerhati" : "Anggota Seksi Doa & Pemerhati"

        const now = new Date()
        const currentHour = now.getHours()
        let timeGreeting = "Selamat Datang"
        if (currentHour >= 4 && currentHour < 11) timeGreeting = "Selamat Pagi"
        else if (currentHour >= 11 && currentHour < 15) timeGreeting = "Selamat Siang"
        else if (currentHour >= 15 && currentHour < 18) timeGreeting = "Selamat Sore"
        else timeGreeting = "Selamat Malam"

        const userBp = idAnggota
            ? await db.badanPengurus.findFirst({
                  where: { idAnggota, status: true },
                  include: {
                      anggota: { select: { nama: true } },
                  },
              })
            : null

        const fullName = userBp?.anggota?.nama || session?.user?.name || roleLabel
        const firstName = fullName.split(" ")[0]

        const startCurrentMonth = startOfMonth(now)
        const endCurrentMonth = endOfMonth(now)
        const todayNormalized = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0))

        // Personal HPDT
        const todayHpdtRecord = userBp
            ? await db.hpdt.findFirst({
                  where: {
                      idPengurus: userBp.id,
                      tanggal: todayNormalized,
                  },
              })
            : null

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

        // Macro metrics: Anggota & Badan Pengurus
        const [allAnggota, allPengurus] = await Promise.all([
            db.anggota.findMany({
                select: {
                    id: true,
                    nama: true,
                    jenisKelamin: true,
                    prodi: true,
                    angkatan: true,
                    noHp: true,
                    tanggalLahir: true,
                },
                orderBy: { nama: "asc" },
            }),
            db.badanPengurus.findMany({
                where: { status: true },
                select: {
                    id: true,
                    jabatan: true,
                },
            }),
        ])

        const totalAnggota = allAnggota.length
        const totalLakiLaki = allAnggota.filter((a) => a.jenisKelamin === "L").length
        const totalPerempuan = allAnggota.filter((a) => a.jenisKelamin === "P").length
        const totalBadanPengurus = allPengurus.length

        const kontakLengkapCount = allAnggota.filter((a) => a.noHp && a.noHp.trim().length > 5).length
        const persenKontakLengkap = totalAnggota > 0 ? Math.round((kontakLengkapCount / totalAnggota) * 100) : 0

        // Birthday calculations
        const currentYear = now.getFullYear()
        const currentMonthNumber = now.getMonth() + 1 // 1-12
        let totalUlangTahunBulanIni = 0

        const birthdayMembers: DoaDashboardData["birthdayMembers"] = []

        for (const m of allAnggota) {
            if (!m.tanggalLahir) continue

            const birthDate = new Date(m.tanggalLahir)
            const birthMonth = birthDate.getMonth() + 1
            const birthDay = birthDate.getDate()

            if (birthMonth === currentMonthNumber) {
                totalUlangTahunBulanIni++
            }

            // Calculate next upcoming birthday
            let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate(), 0, 0, 0, 0)
            const todayClean = new Date(currentYear, now.getMonth(), now.getDate(), 0, 0, 0, 0)

            if (nextBday < todayClean) {
                nextBday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate(), 0, 0, 0, 0)
            }

            const diffMs = nextBday.getTime() - todayClean.getTime()
            const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24))
            const turningAge = nextBday.getFullYear() - birthDate.getFullYear()

            birthdayMembers.push({
                id: m.id,
                nama: m.nama,
                jenisKelamin: m.jenisKelamin,
                prodi: m.prodi,
                angkatan: m.angkatan,
                noHp: m.noHp,
                tanggalLahir: m.tanggalLahir,
                tanggalLahirFormatted: format(birthDate, "d MMMM yyyy", { locale: localeId }),
                birthdayFormatted: format(birthDate, "d MMMM", { locale: localeId }),
                birthMonth,
                birthDay,
                daysUntilBirthday: daysUntil,
                turningAge,
            })
        }

        // Sort by upcoming birthdays first (0, 1, 2, ... days until birthday)
        birthdayMembers.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday)

        // Demographics: Prodi
        const prodiMap = new Map<string, number>()
        for (const a of allAnggota) {
            const p = a.prodi || "Lainnya"
            prodiMap.set(p, (prodiMap.get(p) || 0) + 1)
        }
        const prodiDistribution = Array.from(prodiMap.entries())
            .map(([prodi, count]) => ({
                prodi,
                count,
                percentage: totalAnggota > 0 ? Math.round((count / totalAnggota) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count)

        // Demographics: Angkatan
        const angkatanMap = new Map<string, number>()
        for (const a of allAnggota) {
            const angk = a.angkatan ? String(a.angkatan) : "Tidak Tercatat"
            angkatanMap.set(angk, (angkatanMap.get(angk) || 0) + 1)
        }
        const angkatanDistribution = Array.from(angkatanMap.entries())
            .map(([angkatan, count]) => ({
                angkatan,
                count,
            }))
            .sort((a, b) => b.angkatan.localeCompare(a.angkatan))

        // Demographics: Age from tanggalLahir
        const ageCounts = {
            under19: 0,
            range19to21: 0,
            range22to24: 0,
            above24: 0,
            unfilled: 0,
        }

        for (const a of allAnggota) {
            if (!a.tanggalLahir) {
                ageCounts.unfilled++
            } else {
                const birthDate = new Date(a.tanggalLahir)
                let age = currentYear - birthDate.getFullYear()
                const m = now.getMonth() - birthDate.getMonth()
                if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                    age--
                }

                if (age < 19) ageCounts.under19++
                else if (age >= 19 && age <= 21) ageCounts.range19to21++
                else if (age >= 22 && age <= 24) ageCounts.range22to24++
                else ageCounts.above24++
            }
        }

        const ageDemographics = [
            {
                bracket: "< 19 Tahun",
                count: ageCounts.under19,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.under19 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "19 - 21 Tahun",
                count: ageCounts.range19to21,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.range19to21 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "22 - 24 Tahun",
                count: ageCounts.range22to24,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.range22to24 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "> 24 Tahun",
                count: ageCounts.above24,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.above24 / totalAnggota) * 100) : 0,
            },
            {
                bracket: "Belum Diisi",
                count: ageCounts.unfilled,
                percentage: totalAnggota > 0 ? Math.round((ageCounts.unfilled / totalAnggota) * 100) : 0,
            },
        ]

        // Badan Pengurus Division Stats
        const divisionCounts: Record<string, number> = {
            "BPH (Inti)": 0,
            "Seksi KTB": 0,
            "Seksi Acara": 0,
            "Seksi Doa & Pemerhati": 0,
        }

        for (const bp of allPengurus) {
            if (bp.jabatan === "KETUA" || bp.jabatan === "SEKRETARIS" || bp.jabatan === "BENDAHARA") {
                divisionCounts["BPH (Inti)"]++
            } else if (bp.jabatan === "KOORDINATOR_KTB" || bp.jabatan === "ANGGOTA_KTB") {
                divisionCounts["Seksi KTB"]++
            } else if (bp.jabatan === "KOORDINATOR_ACARA" || bp.jabatan === "ANGGOTA_ACARA") {
                divisionCounts["Seksi Acara"]++
            } else if (bp.jabatan === "KOORDINATOR_DOA_DAN_PEMERHATI" || bp.jabatan === "ANGGOTA_DOA_DAN_PEMERHATI") {
                divisionCounts["Seksi Doa & Pemerhati"]++
            }
        }

        const pengurusDivisionStats = Object.entries(divisionCounts).map(([division, count]) => ({
            division,
            count,
            percentage: totalBadanPengurus > 0 ? Math.round((count / totalBadanPengurus) * 100) : 0,
        }))

        return {
            success: true,
            data: {
                greeting: `${timeGreeting}, ${firstName}`,
                userName: fullName,
                roleLabel,
                isKoordinator,
                currentDateFormatted: format(now, "EEEE, d MMMM yyyy", { locale: localeId }),
                todayHpdt: {
                    isFilled: !!todayHpdtRecord,
                    isSate: todayHpdtRecord?.isSate || false,
                    isDoa: todayHpdtRecord?.isDoa || false,
                    isAttendedKTB: todayHpdtRecord?.isAttendedKTB || false,
                    isGereja: todayHpdtRecord?.isGereja || false,
                    ayatAlkitab: todayHpdtRecord?.ayatAlkitab || null,
                    judulBuku: todayHpdtRecord?.judulBuku || null,
                    sateCount,
                    doaCount,
                    ktbCount,
                    gerejaCount,
                    elapsedDays,
                    satePercentage,
                    doaPercentage,
                },
                metrics: {
                    totalAnggota,
                    totalLakiLaki,
                    totalPerempuan,
                    totalBadanPengurus,
                    totalUlangTahunBulanIni,
                    kontakLengkapCount,
                    persenKontakLengkap,
                },
                birthdayMembers,
                prodiDistribution,
                angkatanDistribution,
                ageDemographics,
                pengurusDivisionStats,
            },
        }
    } catch (error) {
        console.error("Error getDoaDashboardData:", error)
        return { success: false, message: "Gagal memuat dashboard Seksi Doa & Pemerhati" }
    }
}

