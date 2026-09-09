import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { TransaksiClient } from "@/components/admin/transaksi/TransaksiClient"
import {
    getAllTransaksi,
    getKasOptionsForTransaksi,
} from "@/actions/transaksi"
import { TransaksiWithKas } from "./columns"
import { auth } from "@/auth"

export default async function TransaksiPage() {
    const session = await auth()
    const isReadOnly = session?.user?.role === "KETUA"

    const [transaksiRes, kasOptions] = await Promise.all([
        getAllTransaksi(),
        getKasOptionsForTransaksi(),
    ])

    const data: TransaksiWithKas[] =
        transaksiRes.success && transaksiRes.data
            ? (transaksiRes.data as unknown as TransaksiWithKas[])
            : []

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Riwayat Transaksi"
                description="Catat dan pantau seluruh transaksi pemasukan dan pengeluaran kas PMK MIPA"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Transaksi" },
                ]}
                {...(!isReadOnly ? { addLabel: "Catat Transaksi", href: "/admin/transaksi/new" } : {})}
            />

            <TransaksiClient
                data={data}
                kasAccounts={kasOptions}
                isReadOnly={isReadOnly}
            />
        </div>
    )
}
