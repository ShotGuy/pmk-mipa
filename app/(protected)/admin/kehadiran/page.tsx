import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function KehadiranPage() {
    const data = await db.kehadiran.findMany({
        orderBy: { createdAt: 'desc' },
        include: { kegiatan: { select: { nama: true } } }
    });

    // Filters: Status, Prodi
    const prodiList = await db.kehadiran.groupBy({ by: ['prodi'], where: { prodi: { not: null } } });

    const filters = [
        {
            key: "status",
            title: "Status",
            options: [
                { label: "APMK", value: "APMK" },
                { label: "Non APMK", value: "NON_APMK" },
                { label: "AKTB", value: "AKTB" },
            ]
        },
        {
            key: "prodi",
            title: "Prodi",
            options: prodiList.map(p => ({ label: p.prodi as string, value: p.prodi as string }))
        }
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Data Kehadiran Ibadah"
                addLabel="Manual Entry"
                href="/admin/kehadiran/new"
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
