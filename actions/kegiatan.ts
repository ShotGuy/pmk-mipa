"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireRole } from "@/lib/rbac"
import { Role } from "@prisma/client"

const KegiatanInputSchema = z.object({
    nama: z.string().min(1, "Nama kegiatan wajib diisi"),
    idJenisKegiatan: z.string().min(1, "Jenis kegiatan wajib dipilih"),
    tanggal: z.date({ message: "Tanggal kegiatan wajib diisi" }),
    waktu: z.string().optional().nullable(), // HH:mm format e.g. "18:00"
    lokasi: z.string().optional().nullable(),
    pembicara: z.string().optional().nullable(),
})

export type KegiatanFormValues = z.infer<typeof KegiatanInputSchema>

// Helper to convert "HH:mm" to Date object for PostgreSQL @db.Time
function parseTimeToDate(timeStr?: string | null): Date | null {
    if (!timeStr || !timeStr.trim()) return null
    const parts = timeStr.trim().split(":")
    if (parts.length < 2) return null
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    if (isNaN(hours) || isNaN(minutes)) return null

    // Use UTC base for @db.Time compatibility in Prisma
    const d = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0))
    return d
}

export async function getJenisKegiatanOptions() {
    try {
        const list = await db.jenisKegiatan.findMany({
            orderBy: { nama: "asc" },
        })
        return list.map((item) => ({
            value: item.id,
            label: item.nama,
        }))
    } catch (error) {
        console.error("Error fetching jenis kegiatan options:", error)
        return []
    }
}


const KEGIATAN_READ_ROLES = [
    Role.ADMIN,
    Role.KETUA,
    Role.SEKRETARIS,
    Role.KOORACARA,
    Role.ANGGOTAACARA,
]

const KEGIATAN_MUTATION_ROLES = [
    Role.ADMIN,
    Role.SEKRETARIS,
    Role.KOORACARA,
    Role.ANGGOTAACARA,
]

export async function getAllKegiatan() {
    const authCheck = await requireRole(KEGIATAN_READ_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message, data: [] }
    }

    try {
        const data = await db.kegiatan.findMany({
            orderBy: { tanggal: "desc" },
            include: {
                jenisKegiatan: {
                    select: {
                        id: true,
                        nama: true,
                    },
                },
            },
        })
        return { success: true, data }
    } catch (error) {
        console.error("Error fetching all kegiatan:", error)
        return { success: false, message: "Gagal mengambil data kegiatan", data: [] }
    }
}

export async function getKegiatan(id: string) {
    const authCheck = await requireRole(KEGIATAN_READ_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const data = await db.kegiatan.findUnique({
            where: { id },
            include: {
                jenisKegiatan: true,
            },
        })
        if (!data) {
            return { success: false, message: "Kegiatan tidak ditemukan" }
        }
        return { success: true, data }
    } catch (error) {
        console.error("Error fetching kegiatan by id:", error)
        return { success: false, message: "Gagal mengambil data kegiatan" }
    }
}

export async function createKegiatan(values: KegiatanFormValues) {
    const authCheck = await requireRole(KEGIATAN_MUTATION_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const validated = KegiatanInputSchema.safeParse(values)
    if (!validated.success) {
        return { success: false, message: "Data tidak valid" }
    }

    const { nama, idJenisKegiatan, tanggal, waktu, lokasi, pembicara } = validated.data
    const parsedWaktu = parseTimeToDate(waktu)

    try {
        await db.kegiatan.create({
            data: {
                nama: nama.trim(),
                idJenisKegiatan,
                tanggal,
                waktu: parsedWaktu,
                lokasi: lokasi?.trim() || null,
                pembicara: pembicara?.trim() || null,
            },
        })

        revalidatePath("/admin/kegiatan")
        return { success: true, message: "Kegiatan berhasil ditambahkan" }
    } catch (error) {
        console.error("Error creating kegiatan:", error)
        return { success: false, message: "Gagal menambahkan kegiatan" }
    }
}

export async function updateKegiatan(id: string, values: KegiatanFormValues) {
    const authCheck = await requireRole(KEGIATAN_MUTATION_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const validated = KegiatanInputSchema.safeParse(values)
    if (!validated.success) {
        return { success: false, message: "Data tidak valid" }
    }

    const { nama, idJenisKegiatan, tanggal, waktu, lokasi, pembicara } = validated.data
    const parsedWaktu = parseTimeToDate(waktu)

    try {
        await db.kegiatan.update({
            where: { id },
            data: {
                nama: nama.trim(),
                idJenisKegiatan,
                tanggal,
                waktu: parsedWaktu,
                lokasi: lokasi?.trim() || null,
                pembicara: pembicara?.trim() || null,
            },
        })

        revalidatePath("/admin/kegiatan")
        return { success: true, message: "Kegiatan berhasil diperbarui" }
    } catch (error) {
        console.error("Error updating kegiatan:", error)
        return { success: false, message: "Gagal memperbarui kegiatan" }
    }
}

export async function deleteKegiatan(id: string) {
    const authCheck = await requireRole(KEGIATAN_MUTATION_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        // Protect from deleting if kehadiran or gallery exists
        const [kehadiranCount, galleryCount] = await Promise.all([
            db.kehadiran.count({ where: { idKegiatan: id } }),
            db.gallery.count({ where: { idKegiatan: id } }),
        ])

        if (kehadiranCount > 0 || galleryCount > 0) {
            const reasons: string[] = []
            if (kehadiranCount > 0) reasons.push(`${kehadiranCount} data kehadiran`)
            if (galleryCount > 0) reasons.push(`${galleryCount} foto gallery`)
            return {
                success: false,
                message: `Tidak dapat menghapus kegiatan karena masih terhubung dengan ${reasons.join(" dan ")}.`,
            }
        }

        await db.kegiatan.delete({
            where: { id },
        })

        revalidatePath("/admin/kegiatan")
        return { success: true, message: "Kegiatan berhasil dihapus" }
    } catch (error) {
        console.error("Error deleting kegiatan:", error)
        return { success: false, message: "Gagal menghapus kegiatan" }
    }
}
