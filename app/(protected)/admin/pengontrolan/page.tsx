import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function PengontrolanPage() {
    const data = await db.pengontrolan.findMany({
        orderBy: { tanggal: 'desc' },
        include: { ktb: true }
    });

    const facetedFilters = [
        {
            key: "status",
            title: "Status",
            options: [
                { label: "Aktif", value: "AKTIF" },
                { label: "Macet", value: "MACET" },
                { label: "Vakum", value: "VAKUM" },
                { label: "Merger", value: "MERGER" },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen Pengontrolan"
                addLabel="Tambah Data"
                href="/admin/pengontrolan/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="bahan"
                facetedFilters={facetedFilters}
            />
        </div>
    );
}
