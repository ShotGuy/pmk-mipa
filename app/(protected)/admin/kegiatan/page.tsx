import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function KegiatanPage() {
    const data = await db.kegiatan.findMany({
        orderBy: { tanggal: 'desc' },
        include: { jenisKegiatan: true }
    });

    const jenisList = await db.jenisKegiatan.findMany();
    const filters = [
        {
            key: "jenis", // Filter by relation name
            title: "Jenis",
            options: jenisList.map(j => ({ label: j.nama, value: j.nama }))
        }
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Daftar Kegiatan"
                addLabel="Tambah Kegiatan"
                href="/admin/kegiatan/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="nama"
                facetedFilters={filters}
            />
        </div>
    );
}
