import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { getEligibleAnggotaForDropdown } from "@/actions/user"
import { UserForm } from "@/components/admin/users/UserForm"

export default async function NewUserPage() {
    // Fetch data for dropdowns
    const eligibleAnggota = await getEligibleAnggotaForDropdown()

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Buat User Baru"
                description="Tambahkan user baru untuk mengakses sistem."
                isBack
                href="/admin/users"
                addLabel="Kembali"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin" },
                    { label: "Users", href: "/admin/users" },
                    { label: "Buat Baru" },
                ]}
            />

            <UserForm eligibleAnggotaOptions={eligibleAnggota} />
        </div>
    )
}
