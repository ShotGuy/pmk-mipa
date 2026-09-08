import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function GalleryPage() {
    const data = await db.gallery.findMany({
        include: { kegiatan: { select: { nama: true } } }
    });



    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Gallery Foto"
                addLabel="Upload Foto"
                href="/admin/gallery/new"
            />

            <DataTable
                columns={columns}
                data={data}
                searchKey="kegiatan" // Search by kegiatan
            // facetedFilters={filters} // Disable boolean filter for now to avoid complexity if not supported out of box
            />
        </div>
    );
}
