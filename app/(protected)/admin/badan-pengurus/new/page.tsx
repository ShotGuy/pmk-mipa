import { BadanPengurusForm } from "@/components/admin/badan-pengurus/BadanPengurusForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAnggotaOptionsForBP } from "@/actions/badan-pengurus";

export default async function CreateBadanPengurusPage() {
    const anggotaOptions = await getAnggotaOptionsForBP();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Tambah Badan Pengurus"
                description="Angkat anggota aktif menjadi pengurus PMK MIPA"
                href="/admin/badan-pengurus"
                addLabel="Kembali"
                isBack
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Badan Pengurus", href: "/admin/badan-pengurus" },
                    { label: "Tambah" },
                ]}
            />
            <BadanPengurusForm anggotaOptions={anggotaOptions} />
        </div>
    );
}
