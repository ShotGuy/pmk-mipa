import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function AnggotaPage() {
    // 1. Fetch Data
    const data = await db.anggota.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // 2. Dynamic Filters: Fetch Distinct Prodi
    const prodiList = await db.anggota.groupBy({
        by: ['prodi'],
        where: { prodi: { not: null } },
    });

    // Map to Filter Options
    const prodiOptions = prodiList.map(p => ({
        label: p.prodi as string,
        value: p.prodi as string // Filter value exact match
    }));

    const facetedFilters = [
        {
            key: "jenisKelamin",
            title: "Gender",
            options: [
                { label: "Laki-laki", value: "L" },
                { label: "Perempuan", value: "P" },
            ]
        },
        {
            key: "prodi",
            title: "Prodi",
            options: prodiOptions
        }
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen Anggota"
                addLabel="Tambah Anggota"
                href="/admin/anggota/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="nama"
                facetedFilters={facetedFilters}
            />
        </div>
    );
}
