import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function HpdtPage() {
    const data = await db.hpdt.findMany({
        orderBy: { tanggal: 'desc' },
        include: { anggota: { select: { nama: true } } }
    });

    // Maybe filter by Anggota? For now no specific filters requested.
    // Could add 'isSate' filter etc later.

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Laporan HPDT"
                addLabel="Input HPDT"
                href="/admin/hpdt/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="anggota"
            />
        </div>
    );
}
