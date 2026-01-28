import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function JenisKegiatanPage() {
    const data = await db.jenisKegiatan.findMany({
        orderBy: { nama: 'asc' }
    });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Master Jenis Kegiatan"
                addLabel="Tambah Jenis"
                href="/admin/jenis-kegiatan/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="nama"
            />
        </div>
    );
}
