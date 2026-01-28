import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function KTBPage() {
    // 1. Fetch includes relation
    const data = await db.kTB.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            pemimpin: { select: { nama: true } } // Optimize select
        }
    });

    // 2. Dynamic Filters: Angkatan
    const angkatanList = await db.kTB.groupBy({
        by: ['angkatan'],
    });

    // Sort angkatan desc
    const angkatanOptions = angkatanList
        .sort((a, b) => b.angkatan - a.angkatan)
        .map(p => ({
            label: p.angkatan.toString(),
            value: p.angkatan.toString() // Select value is string usually?
            // Note: If table filter expects string, this is fine. 
            // If accessor is number, filter logic in Tanstack might need 'equals'.
            // Default global filter turns everything to string, but column filter might rely on exact type.
            // Since we use 'setFilterValue' in standard DataTable, passing string to number column might mismatch?
            // Actually standard inputs are strings. Tanstack 'auto' filter handles coercion often or strictly.
            // Let's assume loose matching for now.
        }));

    const facetedFilters = [
        {
            key: "angkatan",
            title: "Angkatan",
            options: angkatanOptions
        }
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Manajemen KTB"
                addLabel="Tambah KTB"
                href="/admin/ktb/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="pemimpin" // Using explicit ID 'pemimpin'
                facetedFilters={facetedFilters}
            />
        </div>
    );
}
