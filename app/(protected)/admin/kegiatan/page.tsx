import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { KegiatanClient } from "@/components/admin/kegiatan/KegiatanClient"
import { getAllKegiatan, getJenisKegiatanOptions } from "@/actions/kegiatan"
import { KegiatanWithRelation } from "./columns"

export default async function KegiatanPage() {
    const [kegiatanRes, jenisList] = await Promise.all([
        getAllKegiatan(),
        getJenisKegiatanOptions(),
    ])

    const data: KegiatanWithRelation[] =
        kegiatanRes.success && kegiatanRes.data
            ? (kegiatanRes.data as unknown as KegiatanWithRelation[])
            : []

    const jenisOptions = jenisList.map((j) => ({
        label: j.label,
        value: j.label,
    }))

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Daftar Kegiatan"
                description="Kelola jadwal ibadah, persekutuan, dan program kegiatan PMK MIPA"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Kegiatan" },
                ]}
                addLabel="Tambah Kegiatan"
                href="/admin/kegiatan/new"
            />

            <KegiatanClient data={data} jenisOptions={jenisOptions} />
        </div>
    )
}
