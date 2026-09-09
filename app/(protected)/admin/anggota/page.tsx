import { AnggotaClient } from "@/components/admin/anggota/AnggotaClient"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { ImportAnggotaModal } from "@/components/admin/anggota/ImportAnggotaModal"
import { getAllAnggota, getAnggotaFilterOptions } from "@/actions/anggota"
import { auth } from "@/auth"

export default async function AnggotaPage() {
    const session = await auth()
    const role = session?.user?.role
    const isReadOnly = role === "KETUA" || role === "BENDAHARA" || role === "KOORACARA" || role === "ANGGOTAACARA"

    const anggotaResponse = await getAllAnggota()
    const filterOptions = await getAnggotaFilterOptions()

    const anggotaData = (anggotaResponse.success && anggotaResponse.data) ? anggotaResponse.data : []

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen Anggota"
                description="Kelola data anggota, pengurus, dan alumni"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Data Anggota" }
                ]}
                {...(!isReadOnly ? { addLabel: "Tambah Anggota", href: "/admin/anggota/new" } : {})}
            >
                {!isReadOnly && <ImportAnggotaModal />}
            </AdminPageHeader>

            <AnggotaClient data={anggotaData} filterOptions={filterOptions} isReadOnly={isReadOnly} />
        </div>
    )
}
