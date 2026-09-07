import { notFound } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { KTBForm } from "@/components/admin/ktb/KTBForm"
import {
    getKTB,
    getAnggotaOptionsForPemimpin,
    getPengurusOptionsForKTB,
} from "@/actions/ktb"

interface EditKTBPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditKTBPage({ params }: EditKTBPageProps) {
    const { id } = await params

    const [ktbRes, pemimpinOptions, pengurusOptions] = await Promise.all([
        getKTB(id),
        getAnggotaOptionsForPemimpin(),
        getPengurusOptionsForKTB(),
    ])

    if (!ktbRes.success || !ktbRes.data) {
        notFound()
    }

    const ktb = ktbRes.data

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title={`Edit KTB: ${ktb.nama}`}
                description="Perbarui nama kelompok, tahun angkatan, pemimpin, pendamping, atau status merger"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Kelompok KTB", href: "/admin/ktb" },
                    { label: ktb.nama, href: `/admin/ktb/${ktb.id}` },
                    { label: "Edit KTB" },
                ]}
            />

            <KTBForm
                initialData={{
                    id: ktb.id,
                    nama: ktb.nama,
                    angkatan: ktb.angkatan,
                    terbentukDimana: ktb.terbentukDimana,
                    idPemimpin: ktb.pemimpin.id,
                    idPengurus: ktb.pengurus.id,
                    status: ktb.status,
                }}
                pemimpinOptions={pemimpinOptions}
                pengurusOptions={pengurusOptions}
            />
        </div>
    )
}
