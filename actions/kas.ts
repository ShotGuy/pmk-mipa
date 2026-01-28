"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema
// For Decimal, we accept number or string in Zod, but Prisma expects specific handling or it autoconverts JS number.
// Best practice: Use `z.coerce.number()` to handle string inputs safely.
const KasSchema = z.object({
    nama: z.string().min(1, "Nama kas wajib diisi"),
    saldo: z.coerce.number().min(0, "Saldo tidak boleh negatif"),
})

export async function createKas(data: z.infer<typeof KasSchema>) {
    try {
        const validated = KasSchema.parse(data)

        await db.kas.create({
            data: {
                nama: validated.nama,
                saldo: validated.saldo
            }
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
                nama: validated.nama,
                saldo: validated.saldo
            }
        })

        revalidatePath("/admin/kas")
        return { success: true, message: "Data kas berhasil diperbarui" }
    } catch {
        return { success: false, message: "Gagal memperbarui data kas" }
    }
}

export async function deleteKas(id: string) {
    try {
        // Check if used in transactions? 
        // Usually DB prevents this via foreign key constraint, or we check manually.
        await db.kas.delete({
            where: { id }
        })

        revalidatePath("/admin/kas")
        return { success: true, message: "Data kas berhasil dihapus" }
    } catch {
        return { success: false, message: "Gagal menghapus data kas (Mungkin ada transaksi terkait)" }
    }
}
