import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { PengontrolanClient } from "@/components/admin/pengontrolan/PengontrolanClient"
import {
    getAllPengontrolan,
    getPengontrolanMetrics,
    getKTBOptionsForPengontrolan,
} from "@/actions/pengontrolan"
import { PengontrolanWithRelations } from "./columns"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export default async function PengontrolanPage() {
    const session = await auth()
    const isReadOnly = session?.user?.role === "KETUA"

    const [pengontrolanRes, metrics, ktbOptions] = await Promise.all([
        getAllPengontrolan(),
        getPengontrolanMetrics(),
        getKTBOptionsForPengontrolan(),
    ])

    const data: PengontrolanWithRelations[] = pengontrolanRes.success && pengontrolanRes.data
        ? (pengontrolanRes.data as unknown as PengontrolanWithRelations[])
        : []

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen Pengontrolan KTB"
                description="Jurnal monitoring berkala oleh Badan Pengurus untuk memantau kesehatan rohani, bahan pemuridan, dan dinamika kelompok KTB."
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Pengontrolan KTB" },
                ]}
                {...(!isReadOnly ? { addLabel: "Catat Pengontrolan", href: "/admin/pengontrolan/new" } : {})}
            />

            <PengontrolanClient
                data={data}
                metrics={metrics}
                ktbOptions={ktbOptions}
                isReadOnly={isReadOnly}
            />
        </div>
    )
}
