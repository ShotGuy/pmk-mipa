import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function TransaksiPage() {
    const rawData = await db.transaksi.findMany({
        orderBy: { createdAt: 'desc' },
        include: { kas: { select: { nama: true } } }
    });

    const data = rawData.map(t => ({
        ...t,
        nominal: t.nominal.toNumber()
    }));

    const filters = [
        {
            key: "jenisTransaksi",
            title: "Jenis",
            options: [
                { label: "Pemasukan", value: "PEMASUKAN" },
                { label: "Pengeluaran", value: "PENGELUARAN" },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Riwayat Transaksi"
                addLabel="Catat Transaksi"
                href="/admin/transaksi/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="keterangan"
                facetedFilters={filters}
            />
        </div>
    );
}
