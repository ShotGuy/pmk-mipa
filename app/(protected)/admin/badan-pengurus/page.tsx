import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function BadanPengurusPage() {
    const data = await db.badanPengurus.findMany({
        orderBy: { createdAt: 'desc' },
        include: { anggota: { select: { nama: true } } }
    });

    const masaJabatanList = await db.badanPengurus.groupBy({
        by: ['masaJabatan'],
    });

    const filters = [
        {
            key: "masaJabatan",
            title: "Periode",
            options: masaJabatanList.map(m => ({ label: m.masaJabatan, value: m.masaJabatan }))
        }
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Badan Pengurus"
                addLabel="Tambah BP"
                href="/admin/badan-pengurus/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="anggota"
                facetedFilters={filters}
            />
        </div>
    );
}
