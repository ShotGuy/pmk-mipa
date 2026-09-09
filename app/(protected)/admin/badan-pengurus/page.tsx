import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BadanPengurusClient } from "@/components/admin/badan-pengurus/BadanPengurusClient";
import { getAllBadanPengurus } from "@/actions/badan-pengurus";
import { auth } from "@/auth";

export default async function BadanPengurusPage() {
    const session = await auth();
    const isReadOnly = session?.user?.role === "KETUA";

    const res = await getAllBadanPengurus();
    const data = res.success && res.data ? res.data : [];

    const masaJabatanList = await db.badanPengurus.groupBy({
        by: ['masaJabatan'],
    });

    const periodeOptions = masaJabatanList.map(m => ({
        label: m.masaJabatan,
        value: m.masaJabatan
    }));

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Badan Pengurus"
                description="Kelola struktur organisasi dan kepengurusan PMK MIPA"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Badan Pengurus" }
                ]}
                {...(!isReadOnly ? { addLabel: "Tambah Pengurus", href: "/admin/badan-pengurus/new" } : {})}
            />

            <BadanPengurusClient
                data={data}
                periodeOptions={periodeOptions}
                isReadOnly={isReadOnly}
            />
        </div>
    );
}
