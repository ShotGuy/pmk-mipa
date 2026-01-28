import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function UserManagementPage() {
    // Fetch data directly from DB (Server Component)
    // Note: We might need to serialize Dates to pass to Client Component if not handled automatically?
    // Next.js App Router usually handles Date object serialization fine in modern versions, 
    // but sometimes passing 'plain objects' is safer. Let's try direct first.
    const users = await db.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // Define Faceted Filters (Attributes that can be grouped)
    const facetedFilters = [
        {
            key: "role",
            title: "Role",
            options: [
                { label: "Admin", value: "ADMIN" },
                { label: "Ketua", value: "KETUA" },
                { label: "Bendahara", value: "BENDAHARA" },
                { label: "Koor KTB", value: "KOORKTB" },
                { label: "Anggota KTB", value: "ANGGOTAKTB" },
                { label: "Koor Acara", value: "KOORACARA" },
                { label: "Anggota Acara", value: "ANGGOTAACARA" },
                { label: "Koor Doa", value: "KOORDOA" },
                { label: "Anggota Doa", value: "ANGGOTADOA" },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="User Management"
                addLabel="Tambah User"
                href="/admin/user/new"
            />

            <DataTable
                columns={columns}
                data={users}
                searchKey="name"
                facetedFilters={facetedFilters}
            />
        </div>
    );
}
