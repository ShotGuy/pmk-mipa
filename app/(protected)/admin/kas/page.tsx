import { KasClient } from "@/components/admin/kas/KasClient"
import { getKasWithBalance } from "@/actions/kas"
import { auth } from "@/auth"

export default async function KasPage() {
    const session = await auth()
    const isReadOnly = session?.user?.role === "KETUA"

    const res = await getKasWithBalance()
    const data = res.success ? res.data : []
    const metrics = res.success
        ? res.metrics
        : {
              totalSaldoTerkini: 0,
              totalSaldoAwal: 0,
              totalPemasukanAll: 0,
              totalPengeluaranAll: 0,
              totalAkunKas: 0,
          }

    return <KasClient data={data} metrics={metrics} isReadOnly={isReadOnly} />
}
