import { db } from "@/lib/db";
import { JenisKegiatanClient } from "@/components/admin/jenis-kegiatan/JenisKegiatanClient";

export default async function JenisKegiatanPage() {
    const data = await db.jenisKegiatan.findMany({
        orderBy: { nama: 'asc' }
    });

    return (
        <JenisKegiatanClient data={data} />
    );
}
