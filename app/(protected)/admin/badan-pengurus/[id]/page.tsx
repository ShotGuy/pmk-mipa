import { BadanPengurusForm } from "@/components/admin/badan-pengurus/BadanPengurusForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getBadanPengurus, getAnggotaOptionsForBP } from "@/actions/badan-pengurus";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBadanPengurusPage({ params }: PageProps) {
    const { id } = await params;
    const { success, data: bp } = await getBadanPengurus(id);
    const anggotaOptions = await getAnggotaOptionsForBP();

    if (!success || !bp) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Edit Badan Pengurus"
                description={`Perbarui data pengurus: ${bp.anggota?.nama || ""}`}
                href="/admin/badan-pengurus"
                addLabel="Kembali"
                isBack
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Badan Pengurus", href: "/admin/badan-pengurus" },
                    { label: "Edit" },
                ]}
            />
            <BadanPengurusForm initialData={bp} anggotaOptions={anggotaOptions} />
        </div>
    );
}
