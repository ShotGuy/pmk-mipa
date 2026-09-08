import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { HpdtForm } from "@/components/admin/hpdt/HpdtForm"
import { getPengurusOptionsForHPDT } from "@/actions/hpdt"

export default async function NewHpdtPage() {
    const pengurusOptions = await getPengurusOptionsForHPDT()

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Input Catatan HPDT"
                description="Catat pelaksanaan aktivitas rohani harian dan renungan Badan Pengurus"
                href="/admin/hpdt"
                addLabel="Kembali"
                isBack
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "HPDT", href: "/admin/hpdt" },
                    { label: "Input" },
                ]}
            />
            <HpdtForm pengurusOptions={pengurusOptions} />
        </div>
    )
}
