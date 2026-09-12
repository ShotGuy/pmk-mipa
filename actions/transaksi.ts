"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { Role } from "@prisma/client"
import { requireRole } from "@/lib/rbac"

const TransaksiInputSchema = z.object({
    idKas: z.string().min(1, "Akun kas wajib dipilih"),
    jenisTransaksi: z.enum(["PEMASUKAN", "PENGELUARAN"], {
        message: "Jenis transaksi wajib dipilih",
    }),
    nominal: z.coerce.number().positive("Nominal harus lebih dari 0"),
    tanggal: z.string().min(1, "Tanggal transaksi wajib diisi"),
    keterangan: z.string().optional().nullable(),
})

export type TransaksiFormValues = z.infer<typeof TransaksiInputSchema>

export async function getKasOptionsForTransaksi() {
    const authCheck = await requireRole([Role.ADMIN, Role.KETUA, Role.BENDAHARA])
    if (!authCheck.success) {
        return []
    }

    try {
        const kasList = await db.kas.findMany({
            orderBy: { nama: "asc" },
        })

        // Agregasi mutasi kas terkini untuk info saldo saat memilih kas
        const summary = await db.transaksi.groupBy({
            by: ["idKas", "jenisTransaksi"],
            _sum: { nominal: true },
        })

        return kasList.map((k) => {
            const saldoAwal = Number(k.saldo)
            const masuk = summary.find(
                (s) => s.idKas === k.id && s.jenisTransaksi === "PEMASUKAN"
            )?._sum.nominal
            const keluar = summary.find(
                (s) => s.idKas === k.id && s.jenisTransaksi === "PENGELUARAN"
            )?._sum.nominal

            const totalMasuk = masuk ? Number(masuk) : 0
            const totalKeluar = keluar ? Number(keluar) : 0
            const saldoTerkini = saldoAwal + totalMasuk - totalKeluar

            return {
                value: k.id,
                label: k.nama,
                saldoTerkini,
            }
        })
    } catch (error) {
        console.error("Error fetching kas options for transaksi:", error)
        return []
    }
}

export async function getAllTransaksi() {
    const authCheck = await requireRole([Role.ADMIN, Role.KETUA, Role.BENDAHARA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message, data: [] }
    }

    try {
        const rawData = await db.transaksi.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                kas: {
                    select: {
                        id: true,
                        nama: true,
                    },
                },
            },
        })

        const data = rawData.map((item) => ({
            id: item.id,
            jenisTransaksi: item.jenisTransaksi,
            nominal: Number(item.nominal),
            keterangan: item.keterangan,
            idKas: item.idKas,
            kasNama: item.kas?.nama || "Kas Dihapus",
            createdAt: item.createdAt,
        }))

        return { success: true, data }
    } catch (error) {
        console.error("Error fetching all transaksi:", error)
        return { success: false, message: "Gagal mengambil data transaksi", data: [] }
    }
}

export async function getTransaksi(id: string) {
    const authCheck = await requireRole([Role.ADMIN, Role.KETUA, Role.BENDAHARA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const data = await db.transaksi.findUnique({
            where: { id },
            include: {
                kas: {
                    select: {
                        id: true,
                        nama: true,
                    },
                },
            },
        })

        if (!data) {
            return { success: false, message: "Transaksi tidak ditemukan" }
        }

        return {
            success: true,
            data: {
                id: data.id,
                jenisTransaksi: data.jenisTransaksi,
                nominal: Number(data.nominal),
                keterangan: data.keterangan,
                idKas: data.idKas,
                kas: data.kas,
                createdAt: data.createdAt,
            },
        }
    } catch (error) {
        console.error("Error fetching transaksi by id:", error)
        return { success: false, message: "Gagal mengambil data transaksi" }
    }
}

export async function getTransaksiMetrics() {
    const authCheck = await requireRole([Role.ADMIN, Role.KETUA, Role.BENDAHARA])
    if (!authCheck.success) {
        return {
            totalPemasukan: 0,
            totalPengeluaran: 0,
            netMutasi: 0,
        }
    }

    try {
        const summary = await db.transaksi.groupBy({
            by: ["jenisTransaksi"],
            _sum: { nominal: true },
        })

        const pemasukanRow = summary.find((s) => s.jenisTransaksi === "PEMASUKAN")
        const pengeluaranRow = summary.find((s) => s.jenisTransaksi === "PENGELUARAN")

        const totalPemasukan = pemasukanRow?._sum.nominal
            ? Number(pemasukanRow._sum.nominal)
            : 0
        const totalPengeluaran = pengeluaranRow?._sum.nominal
            ? Number(pengeluaranRow._sum.nominal)
            : 0
        const netMutasi = totalPemasukan - totalPengeluaran

        return {
            totalPemasukan,
            totalPengeluaran,
            netMutasi,
        }
    } catch (error) {
        console.error("Error fetching transaksi metrics:", error)
        return {
            totalPemasukan: 0,
            totalPengeluaran: 0,
            netMutasi: 0,
        }
    }
}

export async function createTransaksi(values: TransaksiFormValues) {
    const authCheck = await requireRole([Role.ADMIN, Role.BENDAHARA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const validated = TransaksiInputSchema.safeParse(values)
    if (!validated.success) {
        return { success: false, message: "Data transaksi tidak valid" }
    }

    const { idKas, jenisTransaksi, nominal, tanggal, keterangan } = validated.data

    try {
        const transactionDate = new Date(tanggal)
        // Set time to current time or noon to preserve date
        const now = new Date()
        transactionDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds())

        await db.transaksi.create({
            data: {
                idKas,
                jenisTransaksi,
                nominal,
                keterangan: keterangan?.trim() || null,
                createdAt: transactionDate,
            },
        })

        revalidatePath("/admin/transaksi")
        revalidatePath("/admin/kas")
        return { success: true, message: "Transaksi berhasil dicatat" }
    } catch (error) {
        console.error("Error creating transaksi:", error)
        return { success: false, message: "Gagal mencatat transaksi" }
    }
}

export async function updateTransaksi(id: string, values: TransaksiFormValues) {
    const authCheck = await requireRole([Role.ADMIN, Role.BENDAHARA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const validated = TransaksiInputSchema.safeParse(values)
    if (!validated.success) {
        return { success: false, message: "Data transaksi tidak valid" }
    }

    const { idKas, jenisTransaksi, nominal, tanggal, keterangan } = validated.data

    try {
        const transactionDate = new Date(tanggal)
        const now = new Date()
        transactionDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds())

        await db.transaksi.update({
            where: { id },
            data: {
                idKas,
                jenisTransaksi,
                nominal,
                keterangan: keterangan?.trim() || null,
                createdAt: transactionDate,
            },
        })

        revalidatePath("/admin/transaksi")
        revalidatePath("/admin/kas")
        return { success: true, message: "Transaksi berhasil diperbarui" }
    } catch (error) {
        console.error("Error updating transaksi:", error)
        return { success: false, message: "Gagal memperbarui transaksi" }
    }
}

export async function deleteTransaksi(id: string) {
    const authCheck = await requireRole([Role.ADMIN, Role.BENDAHARA])
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        await db.transaksi.delete({
            where: { id },
        })

        revalidatePath("/admin/transaksi")
        revalidatePath("/admin/kas")
        return { success: true, message: "Transaksi berhasil dihapus" }
    } catch (error) {
        console.error("Error deleting transaksi:", error)
        return { success: false, message: "Gagal menghapus transaksi" }
    }
}
