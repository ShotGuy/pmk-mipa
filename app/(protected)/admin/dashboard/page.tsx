import { getDashboardSummary } from "@/actions/dashboard"
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { DashboardMetricCards } from "@/components/admin/dashboard/DashboardMetricCards"
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts"
import { DashboardDemographics } from "@/components/admin/dashboard/DashboardDemographics"
import { DashboardWidgets } from "@/components/admin/dashboard/DashboardWidgets"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
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
