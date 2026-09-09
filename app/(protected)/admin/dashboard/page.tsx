import {
    getDashboardSummary,
    getKTBDashboardData,
    getKetuaDashboardData,
    getBendaharaDashboardData,
    getSekretarisDashboardData,
    getAcaraDashboardData,
} from "@/actions/dashboard"
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { DashboardMetricCards } from "@/components/admin/dashboard/DashboardMetricCards"
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts"
import { DashboardDemographics } from "@/components/admin/dashboard/DashboardDemographics"
import { DashboardWidgets } from "@/components/admin/dashboard/DashboardWidgets"
import { KTBDashboard } from "@/components/admin/dashboard/KTBDashboard"
import { KetuaDashboard } from "@/components/admin/dashboard/KetuaDashboard"
import { BendaharaDashboard } from "@/components/admin/dashboard/BendaharaDashboard"
import { SekretarisDashboard } from "@/components/admin/dashboard/SekretarisDashboard"
import { AcaraDashboard } from "@/components/admin/dashboard/AcaraDashboard"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
    const session = await auth()
    const role = session?.user?.role

    // Render dashboard khusus Ketua
    if (role === "KETUA") {
        const ketuaRes = await getKetuaDashboardData()
        if (ketuaRes.success && ketuaRes.data) {
            return <KetuaDashboard data={ketuaRes.data} />
        }
    }

    // Render dashboard khusus Bendahara
    if (role === "BENDAHARA") {
        const bendaharaRes = await getBendaharaDashboardData()
        if (bendaharaRes.success && bendaharaRes.data) {
            return <BendaharaDashboard data={bendaharaRes.data} />
        }
    }

    // Render dashboard khusus Sekretaris
    if (role === "SEKRETARIS") {
        const sekretarisRes = await getSekretarisDashboardData()
        if (sekretarisRes.success && sekretarisRes.data) {
            return <SekretarisDashboard data={sekretarisRes.data} />
        }
    }

    // Render dashboard khusus Seksi KTB untuk Koordinator dan Anggota Seksi KTB
    if (role === "KOORKTB" || role === "ANGGOTAKTB") {
        const ktbRes = await getKTBDashboardData()
        if (ktbRes.success && ktbRes.data) {
            return <KTBDashboard data={ktbRes.data} />
        }
    }

    // Render dashboard khusus Seksi Acara untuk Koordinator dan Anggota Seksi Acara
    if (role === "KOORACARA" || role === "ANGGOTAACARA") {
        const acaraRes = await getAcaraDashboardData()
        if (acaraRes.success && acaraRes.data) {
            return <AcaraDashboard data={acaraRes.data} />
        }
    }

    const res = await getDashboardSummary()
    const summary = res.data

    if (!summary) {
        return (
            <div className="p-12 text-center text-muted-foreground text-sm space-y-2">
                <p className="font-semibold text-foreground">Gagal memuat ringkasan data dashboard.</p>
                <p className="text-xs">Silakan refresh halaman atau periksa koneksi database.</p>
            </div>
        )
    }

    return (
        <div className="space-y-7 pb-10">
            {/* Header & Quick Action Bar */}
            <DashboardHeader
                greeting={summary.greeting}
                currentDateFormatted={summary.currentDateFormatted}
                activePresensiKegiatan={summary.activePresensiKegiatan}
            />

            {/* 4 Main KPI Cards */}
            <DashboardMetricCards metrics={summary.metrics} />

            {/* Visualisasi Grafik Tren Kehadiran & Arus Kas */}
            <DashboardCharts
                attendanceTrend={summary.attendanceTrend}
                monthlyCashflow={summary.monthlyCashflow}
            />

            {/* Widgets Operasional (Agenda Terdekat, Evaluasi KTB, Transaksi Terkini) */}
            <DashboardWidgets
                upcomingKegiatan={summary.upcomingKegiatan}
                ktbAttentionList={summary.ktbAttentionList}
                recentTransactions={summary.recentTransactions}
            />

            {/* Demografi Jemaat (Prodi & Angkatan) */}
            <DashboardDemographics
                prodiDistribution={summary.prodiDistribution}
                angkatanDistribution={summary.angkatanDistribution}
                totalAnggota={summary.metrics.totalAnggota}
            />
        </div>
    )
}
