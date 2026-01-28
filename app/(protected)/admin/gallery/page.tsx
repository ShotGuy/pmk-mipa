import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "./columns";

export default async function GalleryPage() {
    const data = await db.gallery.findMany({
        include: { kegiatan: { select: { nama: true } } }
    });

    const filters = [
        {
            key: "isPublish", // Boolean filtering might need custom handling or toString mapping.
            // Tanstack default string filter might expect "true" or "false".
            // Let's assume boolean column AccessorFn returns boolean, search input is string.
            // Ideally we map boolean to "Published"/"Draft" in accessor for easier filtering?
            // Or just supply "true"/"false" values.
            title: "Status",
            options: [
                { label: "Published", value: "true" },
                { label: "Draft", value: "false" }
            ]
        }
    ];

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
