import { notFound } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { KTBDetailClient } from "@/components/admin/ktb/KTBDetailClient"
import { getKTB } from "@/actions/ktb"
import { auth } from "@/auth"

interface KTBDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function KTBDetailPage({ params }: KTBDetailPageProps) {
    const session = await auth()
    const isReadOnly = session?.user?.role === "ANGGOTAKTB"

    const { id } = await params
    const res = await getKTB(id)

    if (!res.success || !res.data) {
        notFound()
    }

    const ktb = res.data

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title={`Kelola KTB: ${ktb.nama}`}
                description="Pantau perkembangan kelompok, riwayat status, dan daftar anggota yang dinaungi"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Kelompok KTB", href: "/admin/ktb" },
                    { label: ktb.nama },
                ]}
            />

            <KTBDetailClient ktb={ktb} isReadOnly={isReadOnly} />
        </div>
    )
}
