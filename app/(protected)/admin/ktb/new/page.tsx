import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { KTBForm } from "@/components/admin/ktb/KTBForm"
import {
    getAnggotaOptionsForPemimpin,
    getPengurusOptionsForKTB,
} from "@/actions/ktb"

export default async function NewKTBPage() {
    const [pemimpinOptions, pengurusOptions] = await Promise.all([
        getAnggotaOptionsForPemimpin(),
        getPengurusOptionsForKTB(),
    ])

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Tambah Kelompok KTB"
                description="Bentuk kelompok tumbuh bersama baru untuk pembinaan dan pertumbuhan rohani mahasiswa"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Kelompok KTB", href: "/admin/ktb" },
                    { label: "Tambah KTB" },
                ]}
            />

            <KTBForm
                pemimpinOptions={pemimpinOptions}
                pengurusOptions={pengurusOptions}
            />
        </div>
    )
}
