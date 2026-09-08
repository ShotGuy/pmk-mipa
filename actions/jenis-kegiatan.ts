"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema Validation
const JenisKegiatanSchema = z.object({
    nama: z.string().min(1, "Nama jenis kegiatan wajib diisi"),
})

export async function createJenisKegiatan(data: z.infer<typeof JenisKegiatanSchema>) {
    try {
        const validated = JenisKegiatanSchema.parse(data)

        await db.jenisKegiatan.create({
            data: {
                nama: validated.nama
            }
        })

        revalidatePath("/admin/jenis-kegiatan")
        return { success: true, message: "Jenis Kegiatan berhasil ditambahkan" }
    } catch {
        return { success: false, message: "Gagal membuat jenis kegiatan" }
    }
}

export async function updateJenisKegiatan(id: string, data: z.infer<typeof JenisKegiatanSchema>) {
    try {
        const validated = JenisKegiatanSchema.parse(data)

        await db.jenisKegiatan.update({
            where: { id },
            data: { nama: validated.nama }
        })

        revalidatePath("/admin/jenis-kegiatan")
        revalidatePath("/admin/kegiatan") // Revalidate dependent page
        return { success: true, message: "Jenis Kegiatan berhasil diupdate" }
    } catch {
        return { success: false, message: "Gagal mengupdate jenis kegiatan" }
    }
}

export async function deleteJenisKegiatan(id: string) {
    try {
        // Check usage first? Or typically Prisma throws specific error if FK constraint.
        await db.jenisKegiatan.delete({
            where: { id }
        })

        revalidatePath("/admin/jenis-kegiatan")
        return { success: true, message: "Jenis Kegiatan berhasil dihapus" }
    } catch {
        return { success: false, message: "Gagal menghapus data (Mungkin sedang digunakan di Kegiatan lain)" }
    }
}
