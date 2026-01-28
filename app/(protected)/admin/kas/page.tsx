import { db } from "@/lib/db";
import { KasClient } from "@/components/admin/kas/KasClient";

export default async function KasPage() {
    const data = await db.kas.findMany({
        orderBy: { nama: 'asc' }
    });

    // Prisma Decimal is not directly serializable to Client Component in some Next.js versions without conversion.
    // However, recent versions are smarter. If error occurs, we map it.
    // Let's map it to number/string to be safe.
    const formattedData = data.map(item => ({
        ...item,
        saldo: item.saldo.toNumber() // Convert Decimal to JS Number
    }));

    return (
        <KasClient data={formattedData} />
    );
}
