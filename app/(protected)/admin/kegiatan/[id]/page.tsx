import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { KegiatanForm } from "@/components/admin/kegiatan/KegiatanForm"
import { getKegiatan, getJenisKegiatanOptions } from "@/actions/kegiatan"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditKegiatanPage({ params }: PageProps) {
    const { id } = await params
    const [kegiatanRes, jenisKegiatanOptions] = await Promise.all([
        getKegiatan(id),
        getJenisKegiatanOptions(),
    ])

    if (!kegiatanRes.success || !kegiatanRes.data) {
        notFound()
    }

    const kegiatan = kegiatanRes.data

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Edit Kegiatan"
                description={`Perbarui jadwal atau informasi kegiatan: ${kegiatan.nama}`}
                href="/admin/kegiatan"
                addLabel="Kembali"
                isBack
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Kegiatan", href: "/admin/kegiatan" },
                    { label: "Edit" },
                ]}
            />
            <KegiatanForm
                initialData={kegiatan}
                jenisKegiatanOptions={jenisKegiatanOptions}
            />
        </div>
    )
}
