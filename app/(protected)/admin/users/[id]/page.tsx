import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { getEligibleAnggotaForDropdown, getUser } from "@/actions/user"
import { UserForm } from "@/components/admin/users/UserForm"
import { notFound } from "next/navigation"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch user data and options parallel
    const [userResponse, eligibleAnggota] = await Promise.all([
        getUser(id),
        getEligibleAnggotaForDropdown()
    ])

    if (!userResponse.success || !userResponse.data) {
        notFound()
    }

    const userData = userResponse.data

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Edit User"
                description={`Edit data user ${userData.name || userData.email}`}
                isBack
                href="/admin/users"
                addLabel="Kembali"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin" },
                    { label: "Users", href: "/admin/users" },
                    { label: "Edit User" },
                ]}
            />

            <UserForm initialData={userData} eligibleAnggotaOptions={eligibleAnggota} />
        </div>
    )
}
