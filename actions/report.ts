"use server"



export async function getHPDTReport(startDate: Date, endDate: Date) {
    try {
        const data = await db.hpdt.findMany({
            where: {
                tanggal: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                anggota: true
            },
            orderBy: {
                tanggal: 'asc'
            }
        });

        // Flatten data for Excel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((item: any) => ({
            Nama: item.anggota?.nama || "Unknown",
            Tanggal: item.tanggal.toISOString().split('T')[0],
            SaatTeduh: item.isSate ? "Ya" : "Tidak",
            Doa: item.isDoa ? "Ya" : "Tidak",
            KTB: item.isAttendedKTB ? "Ya" : "Tidak",
            Gereja: item.isGereja ? "Ya" : "Tidak",
            Ayat: item.ayatAlkitab || "-",
            Buku: item.judulBuku || "-"
        }));

    } catch (error) {
        console.error("Report Error:", error);
        return [];
    }
}
