import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { HpdtClient, OverviewData } from "@/components/admin/hpdt/HpdtClient"
import {
    getHPDTOverview,
    getHPDTLogs,
    getPengurusOptionsForHPDT,
} from "@/actions/hpdt"
import { HpdtWithRelation } from "./columns"

export default async function HpdtPage() {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const [overviewRes, logsRes, pengurusList] = await Promise.all([
        getHPDTOverview(currentMonth, currentYear),
        getHPDTLogs(),
        getPengurusOptionsForHPDT(),
    ])

    const initialOverview: OverviewData =
        overviewRes.success && overviewRes.data
            ? overviewRes.data
            : {
                  month: currentMonth,
                  year: currentYear,
                  elapsedDays: now.getDate(),
                  daysInMonth: 30,
                  avgSatePercentage: 0,
                  avgDoaPercentage: 0,
                  totalPengurus: 0,
                  pengurusStats: [],
              }

    const initialLogs: HpdtWithRelation[] =
        logsRes.success && logsRes.data
            ? (logsRes.data as unknown as HpdtWithRelation[])
            : []

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Hubungan Pribadi Dengan Tuhan (HPDT)"
                description="Pantau kedisiplinan rohani dan catatan renungan harian Badan Pengurus PMK MIPA"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "HPDT" },
                ]}
                addLabel="Input HPDT"
                href="/admin/hpdt/new"
            />

            <HpdtClient
                initialOverview={initialOverview}
                initialLogs={initialLogs}
                pengurusList={pengurusList}
            />
        </div>
    )
}
