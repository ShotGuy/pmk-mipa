import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { HpdtForm } from "@/components/admin/hpdt/HpdtForm"
import { getHPDT, getPengurusOptionsForHPDT } from "@/actions/hpdt"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditHpdtPage({ params }: PageProps) {
    const session = await auth()
    const role = session?.user?.role
    const idAnggota = session?.user?.idAnggota

    const { id } = await params
    const [hpdtRes, pengurusOptions] = await Promise.all([
        getHPDT(id),
        getPengurusOptionsForHPDT(),
    ])

    if (!hpdtRes.success || !hpdtRes.data) {
        notFound()
    }

    const hpdt = hpdtRes.data

    // Guard: Anggota & Koordinator KTB hanya dapat mengedit HPDT miliknya sendiri
    if ((role === "ANGGOTAKTB" || role === "KOORKTB") && idAnggota) {
        const bp = await db.badanPengurus.findFirst({
            where: { idAnggota, status: true },
            select: { id: true },
        })
        if (!bp || hpdt.idPengurus !== bp.id) {
            redirect("/admin/hpdt")
        }
    }

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
