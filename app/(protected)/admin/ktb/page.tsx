import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { KTBClient } from "@/components/admin/ktb/KTBClient"
import { getAllKTB, getKTBMetrics } from "@/actions/ktb"
import { KTBWithRelations } from "./columns"
import { auth } from "@/auth"

export default async function KTBPage() {
    const session = await auth()
    const isReadOnly = session?.user?.role === "ANGGOTAKTB" || session?.user?.role === "KETUA"

    const [ktbRes, metrics] = await Promise.all([
        getAllKTB(),
        getKTBMetrics(),
    ])

    const data: KTBWithRelations[] = ktbRes.success && ktbRes.data
        ? (ktbRes.data as unknown as KTBWithRelations[])
        : []

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen KTB"
                description="Kelola kelompok tumbuh bersama (pemuridan), pemimpin KTB (PKTB), badan pengurus pendamping, dan riwayat anggota."
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Kelompok KTB" },
                ]}
                {...(!isReadOnly ? { addLabel: "Tambah KTB Baru", href: "/admin/ktb/new" } : {})}
            />

            <KTBClient
                data={data}
                metrics={metrics}
                isReadOnly={isReadOnly}
            />
        </div>
    )
}
