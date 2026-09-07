import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { TransaksiForm } from "@/components/admin/transaksi/TransaksiForm"
import { getKasOptionsForTransaksi } from "@/actions/transaksi"

export default async function CreateTransaksiPage() {
    const kasOptions = await getKasOptionsForTransaksi()

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Catat Transaksi Baru"
                description="Catat mutasi pemasukan atau pengeluaran dana kas PMK MIPA"
                href="/admin/transaksi"
                addLabel="Kembali"
                isBack
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Transaksi", href: "/admin/transaksi" },
                    { label: "Catat" },
                ]}
            />
            <TransaksiForm kasOptions={kasOptions} />
        </div>
    )
}
