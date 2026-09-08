import { notFound } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { PengontrolanForm } from "@/components/admin/pengontrolan/PengontrolanForm"
import {
    getPengontrolan,
    getKTBOptionsForPengontrolan,
} from "@/actions/pengontrolan"

interface EditPengontrolanPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditPengontrolanPage({ params }: EditPengontrolanPageProps) {
    const { id } = await params

    const [pengontrolanRes, ktbOptions] = await Promise.all([
        getPengontrolan(id),
        getKTBOptionsForPengontrolan(),
    ])

    if (!pengontrolanRes.success || !pengontrolanRes.data) {
        notFound()
    }

    const pengontrolan = pengontrolanRes.data

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Edit Pengontrolan KTB"
                description={`Perbarui catatan monitoring untuk ${pengontrolan.ktb.nama}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Pengontrolan KTB", href: "/admin/pengontrolan" },
                    { label: "Edit Pengontrolan" },
                ]}
            />

            <PengontrolanForm
                initialData={{
                    id: pengontrolan.id,
                    idKTB: pengontrolan.ktb.id,
                    tanggal: pengontrolan.tanggal,
                    bahan: pengontrolan.bahan,
                    status: pengontrolan.status,
                    keterangan: pengontrolan.keterangan,
                }}
                ktbOptions={ktbOptions}
            />
        </div>
    )
}
