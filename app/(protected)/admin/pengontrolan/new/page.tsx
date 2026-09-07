import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { PengontrolanForm } from "@/components/admin/pengontrolan/PengontrolanForm"
import { getKTBOptionsForPengontrolan } from "@/actions/pengontrolan"

interface NewPengontrolanPageProps {
    searchParams: Promise<{
        ktbId?: string
    }>
}

export default async function NewPengontrolanPage({ searchParams }: NewPengontrolanPageProps) {
    const { ktbId } = await searchParams
    const ktbOptions = await getKTBOptionsForPengontrolan()

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Catat Pengontrolan KTB"
                description="Dokumentasikan hasil monitoring kelompok KTB, materi yang dipelajari, dan kondisi kelompok"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Pengontrolan KTB", href: "/admin/pengontrolan" },
                    { label: "Catat Pengontrolan" },
                ]}
            />

            <PengontrolanForm
                ktbOptions={ktbOptions}
                defaultKTBId={ktbId}
            />
        </div>
    )
}
