import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { KegiatanForm } from "@/components/admin/kegiatan/KegiatanForm"
import { getJenisKegiatanOptions } from "@/actions/kegiatan"

export default async function CreateKegiatanPage() {
    const jenisKegiatanOptions = await getJenisKegiatanOptions()

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Tambah Kegiatan"
                description="Buat jadwal ibadah, persekutuan, atau program kerja baru"
                href="/admin/kegiatan"
                addLabel="Kembali"
                isBack
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Kegiatan", href: "/admin/kegiatan" },
                    { label: "Tambah" },
                ]}
            />
            <KegiatanForm jenisKegiatanOptions={jenisKegiatanOptions} />
        </div>
    )
}
