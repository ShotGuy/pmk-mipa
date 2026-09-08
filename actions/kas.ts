"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const KasSchema = z.object({
    nama: z.string().min(1, "Nama kas wajib diisi"),
    saldo: z.coerce.number().min(0, "Saldo tidak boleh negatif"),
})

export async function getKasWithBalance() {
    try {
        const kasList = await db.kas.findMany({
            orderBy: { nama: "asc" },
        })

        // Agregasi efisien langsung di level PostgreSQL via Prisma groupBy
        const summary = await db.transaksi.groupBy({
            by: ["idKas", "jenisTransaksi"],
            _sum: {
                nominal: true,
            },
        })

        const data = kasList.map((item) => {
            const saldoAwal = Number(item.saldo)
            const pemasukanRow = summary.find(
                (s) => s.idKas === item.id && s.jenisTransaksi === "PEMASUKAN"
            )
            const pengeluaranRow = summary.find(
                (s) => s.idKas === item.id && s.jenisTransaksi === "PENGELUARAN"
            )

            const totalPemasukan = pemasukanRow?._sum.nominal
                ? Number(pemasukanRow._sum.nominal)
                : 0
            const totalPengeluaran = pengeluaranRow?._sum.nominal
                ? Number(pengeluaranRow._sum.nominal)
                : 0
            const saldoTerkini = saldoAwal + totalPemasukan - totalPengeluaran

            return {
                id: item.id,
                nama: item.nama,
                saldoAwal,
                totalPemasukan,
                totalPengeluaran,
                saldoTerkini,
            }
        })

        const totalSaldoTerkini = data.reduce((acc, curr) => acc + curr.saldoTerkini, 0)
        const totalSaldoAwal = data.reduce((acc, curr) => acc + curr.saldoAwal, 0)
        const totalPemasukanAll = data.reduce((acc, curr) => acc + curr.totalPemasukan, 0)
        const totalPengeluaranAll = data.reduce((acc, curr) => acc + curr.totalPengeluaran, 0)

        return {
            success: true,
            data,
            metrics: {
                totalSaldoTerkini,
                totalSaldoAwal,
                totalPemasukanAll,
                totalPengeluaranAll,
                totalAkunKas: data.length,
            },
        }
    } catch (error) {
        console.error("Error fetching kas with balance:", error)
        return {
            success: false,
            message: "Gagal memuat data kas",
            data: [],
            metrics: {
                totalSaldoTerkini: 0,
                totalSaldoAwal: 0,
                totalPemasukanAll: 0,
                totalPengeluaranAll: 0,
                totalAkunKas: 0,
            },
        }
    }
}

export async function createKas(data: z.infer<typeof KasSchema>) {
    try {
        const validated = KasSchema.parse(data)

        await db.kas.create({
            data: {
                nama: validated.nama.trim(),
                saldo: validated.saldo,
            },
        })

        revalidatePath("/admin/kas")
        return { success: true, message: "Data kas berhasil disimpan" }
    } catch {
        return { success: false, message: "Gagal menyimpan data kas" }
    }
}

export async function updateKas(id: string, data: z.infer<typeof KasSchema>) {
    try {
        const validated = KasSchema.parse(data)

        await db.kas.update({
            where: { id },
            data: {
                nama: validated.nama.trim(),
                saldo: validated.saldo,
            },
        })

        revalidatePath("/admin/kas")
        return { success: true, message: "Data kas berhasil diperbarui" }
    } catch {
        return { success: false, message: "Gagal memperbarui data kas" }
    }
}

export async function deleteKas(id: string) {
    try {
        // Proteksi jika kas masih memiliki riwayat transaksi
        const transaksiCount = await db.transaksi.count({
            where: { idKas: id },
        })

        if (transaksiCount > 0) {
            return {
                success: false,
                message: `Tidak dapat menghapus akun kas ini karena masih memiliki ${transaksiCount} riwayat transaksi. Hapus atau pindahkan transaksi terkait terlebih dahulu.`,
            }
        }

        await db.kas.delete({
            where: { id },
        })

        revalidatePath("/admin/kas")
        return { success: true, message: "Data kas berhasil dihapus" }
    } catch (error) {
        console.error("Error deleting kas:", error)
        return { success: false, message: "Gagal menghapus data kas" }
    }
}
