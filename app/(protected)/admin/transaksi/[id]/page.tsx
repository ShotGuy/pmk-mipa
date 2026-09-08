import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { TransaksiForm } from "@/components/admin/transaksi/TransaksiForm"
import { getTransaksi, getKasOptionsForTransaksi } from "@/actions/transaksi"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditTransaksiPage({ params }: PageProps) {
    const { id } = await params
    const [transaksiRes, kasOptions] = await Promise.all([
        getTransaksi(id),
        getKasOptionsForTransaksi(),
    ])

    if (!transaksiRes.success || !transaksiRes.data) {
        notFound()
    }

    const transaksi = transaksiRes.data

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Edit Transaksi"
                description={`Perbarui catatan transaksi: ${transaksi.keterangan || "Transaksi"}`}
                href="/admin/transaksi"
                addLabel="Kembali"
                isBack
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Transaksi", href: "/admin/transaksi" },
                    { label: "Edit" },
                ]}
            />
            <TransaksiForm
                initialData={transaksi}
                kasOptions={kasOptions}
            />
        </div>
    )
}
