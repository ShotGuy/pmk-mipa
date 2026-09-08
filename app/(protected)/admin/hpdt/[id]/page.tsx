import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { HpdtForm } from "@/components/admin/hpdt/HpdtForm"
import { getHPDT, getPengurusOptionsForHPDT } from "@/actions/hpdt"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditHpdtPage({ params }: PageProps) {
    const { id } = await params
    const [hpdtRes, pengurusOptions] = await Promise.all([
        getHPDT(id),
        getPengurusOptionsForHPDT(),
    ])

    if (!hpdtRes.success || !hpdtRes.data) {
        notFound()
    }

    const hpdt = hpdtRes.data

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Edit Catatan HPDT"
                description={`Perbarui catatan HPDT: ${hpdt.pengurus?.anggota?.nama || ""}`}
                href="/admin/hpdt"
                addLabel="Kembali"
                isBack
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "HPDT", href: "/admin/hpdt" },
                    { label: "Edit" },
                ]}
            />
            <HpdtForm initialData={hpdt} pengurusOptions={pengurusOptions} />
        </div>
    )
}
