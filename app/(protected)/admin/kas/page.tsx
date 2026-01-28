import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function KasPage() {
    // Serialize decimal? Prisma Decimal often returns object/string.
    // In server component -> client, we might need toString() if it's not serializable.
    // But TanStack table needs primitives.
    // Let's assume Prisma + App Router serializes Decimal to string or number or passes as is?
    // Usually it causes warning "Only plain objects...". 
    // We should map it to number or string.
    const rawData = await db.kas.findMany();
    const data = rawData.map(k => ({
        ...k,
        saldo: k.saldo.toNumber() // Convert Decimal to JS Number
    }));

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen Kas"
                addLabel="Buat Akun Kas"
                href="/admin/kas/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="nama"
            />
        </div>
    );
}
