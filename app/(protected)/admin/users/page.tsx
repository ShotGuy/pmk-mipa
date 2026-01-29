import { getAllUsers } from "@/actions/user"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { UserClient } from "@/components/admin/users/UserClient"

export default async function UserPage() {
    const { success, data } = await getAllUsers()
    const users = success && data ? data : []

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen User"
                description="Kelola akun login, password, dan hak akses pengguna."
                addLabel="Tambah User"
                href="/admin/users/new"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin" },
                    { label: "Users", href: "/admin/users" },
                ]}
            />
            <UserClient data={users} />
        </div>
    )
}
