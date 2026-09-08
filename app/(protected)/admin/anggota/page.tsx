import { AnggotaClient } from "@/components/admin/anggota/AnggotaClient"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { getAllAnggota, getAnggotaFilterOptions } from "@/actions/anggota" // Import getAnggotaFilterOptions

export default async function AnggotaPage() {
    const anggotaResponse = await getAllAnggota()
    const filterOptions = await getAnggotaFilterOptions()

    // Handle the response, default to empty array if failed
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
                addLabel="Tambah Anggota"
                href="/admin/anggota/new"
            />

            <AnggotaClient data={anggotaData} filterOptions={filterOptions} />
        </div>
    )
}
