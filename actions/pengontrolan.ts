"use server"

import { db } from "@/lib/db"
import { StatusPengontrolan } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"

const PengontrolanSchema = z.object({
    idKTB: z.string().min(1, "Pilih kelompok KTB"),
    tanggal: z.date({ message: "Tanggal wajib diisi" }),
    bahan: z.string().optional().nullable(),
    status: z.nativeEnum(StatusPengontrolan),
    keterangan: z.string().optional().nullable(),
})

export type PengontrolanFormValues = z.infer<typeof PengontrolanSchema>

export async function getAllPengontrolan() {
    try {
        const session = await auth()
        const role = session?.user?.role
        const idAnggota = session?.user?.idAnggota

        let idPengurusFilter: string | undefined = undefined

        // Jika ANGGOTAKTB, batasi hanya pada KTB yang ia dampingi
        if (role === "ANGGOTAKTB" && idAnggota) {
            const bp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            })
            if (bp) {
                idPengurusFilter = bp.id
            } else {
                return { success: true, data: [] }
            }
        }

        const data = await db.pengontrolan.findMany({
            where: idPengurusFilter
                ? { ktb: { idPengurus: idPengurusFilter } }
                : undefined,
            orderBy: [{ tanggal: "desc" }, { createdAt: "desc" }],
            include: {
                ktb: {
                    select: {
                        id: true,
                        nama: true,
                        angkatan: true,
                        status: true,
                        pemimpin: {
                            select: {
                                id: true,
                                nama: true,
                                prodi: true,
                                angkatan: true,
                            },
                        },
                        pengurus: {
                            select: {
                                id: true,
                                jabatan: true,
                                anggota: {
                                    select: {
                                        nama: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        return { success: true, data }
    } catch (error) {
        console.error("Error getAllPengontrolan:", error)
        return { success: false, message: "Gagal memuat riwayat pengontrolan", data: [] }
    }
}

export async function getPengontrolan(id: string) {
    try {
        const data = await db.pengontrolan.findUnique({
            where: { id },
            include: {
                ktb: {
                    select: {
                        id: true,
                        nama: true,
                        angkatan: true,
                        status: true,
                        pemimpin: {
                            select: {
                                id: true,
                                nama: true,
                            },
                        },
                        pengurus: {
                            select: {
                                id: true,
                                jabatan: true,
                                anggota: {
                                    select: {
                                        nama: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!data) return { success: false, message: "Data pengontrolan tidak ditemukan" }
        return { success: true, data }
    } catch (error) {
        console.error("Error getPengontrolan:", error)
        return { success: false, message: "Gagal mengambil data pengontrolan" }
    }
}

export async function getKTBOptionsForPengontrolan() {
    try {
        const session = await auth()
        const role = session?.user?.role
        const idAnggota = session?.user?.idAnggota

        let idPengurusFilter: string | undefined = undefined
        if (role === "ANGGOTAKTB" && idAnggota) {
            const bp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            })
            if (bp) {
                idPengurusFilter = bp.id
            } else {
                return []
            }
        }

        const ktbs = await db.kTB.findMany({
            where: idPengurusFilter ? { idPengurus: idPengurusFilter } : undefined,
            orderBy: [{ status: "asc" }, { angkatan: "desc" }, { nama: "asc" }],
            include: {
                pemimpin: {
                    select: {
                        nama: true,
                    },
                },
                pengurus: {
                    select: {
                        anggota: {
                            select: {
                                nama: true,
                            },
                        },
                    },
                },
            },
        })

        return ktbs.map((k) => ({
            value: k.id,
            label: `${k.nama} - Pemimpin: ${k.pemimpin.nama} (${k.angkatan})`,
            subtitle: `Pendamping: ${k.pengurus.anggota.nama} • Status: ${k.status}`,
            status: k.status,
        }))
    } catch (error) {
        console.error("Error getKTBOptionsForPengontrolan:", error)
        return []
    }
}

export async function createPengontrolan(values: PengontrolanFormValues) {
    const session = await auth()
    const role = session?.user?.role
    const idAnggota = session?.user?.idAnggota

    const validated = PengontrolanSchema.safeParse(values)
    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues[0]?.message || "Input tidak valid",
        }
    }

    // Validasi kepemilikan KTB untuk ANGGOTAKTB
    if (role === "ANGGOTAKTB" && idAnggota) {
        const bp = await db.badanPengurus.findFirst({
            where: { idAnggota, status: true },
            select: { id: true },
        })
        const targetKTB = await db.kTB.findUnique({
            where: { id: validated.data.idKTB },
            select: { idPengurus: true },
        })
        if (!bp || targetKTB?.idPengurus !== bp.id) {
            return {
                success: false,
                message: "Anda hanya diizinkan mengisi pengontrolan untuk kelompok KTB yang Anda dampingi.",
            }
        }
    }

    try {
        const created = await db.pengontrolan.create({
            data: {
                idKTB: validated.data.idKTB,
                tanggal: validated.data.tanggal,
                bahan: validated.data.bahan || null,
                status: validated.data.status,
                keterangan: validated.data.keterangan || null,
            },
        })

        revalidatePath("/admin/pengontrolan")
        revalidatePath(`/admin/ktb/${validated.data.idKTB}`)
        return { success: true, message: "Pengontrolan KTB berhasil dicatat", id: created.id }
    } catch (error) {
        console.error("Error createPengontrolan:", error)
        return { success: false, message: "Gagal mencatat pengontrolan KTB" }
    }
}

export async function updatePengontrolan(id: string, values: PengontrolanFormValues) {
    const validated = PengontrolanSchema.safeParse(values)
    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues[0]?.message || "Input tidak valid",
        }
    }

    try {
        const updated = await db.pengontrolan.update({
            where: { id },
            data: {
                idKTB: validated.data.idKTB,
                tanggal: validated.data.tanggal,
                bahan: validated.data.bahan || null,
                status: validated.data.status,
                keterangan: validated.data.keterangan || null,
            },
        })

        revalidatePath("/admin/pengontrolan")
        revalidatePath(`/admin/ktb/${updated.idKTB}`)
        return { success: true, message: "Data pengontrolan berhasil diperbarui" }
    } catch (error) {
        console.error("Error updatePengontrolan:", error)
        return { success: false, message: "Gagal memperbarui data pengontrolan" }
    }
}

export async function deletePengontrolan(id: string) {
    try {
        const item = await db.pengontrolan.delete({
            where: { id },
            select: { idKTB: true },
        })

        revalidatePath("/admin/pengontrolan")
        revalidatePath(`/admin/ktb/${item.idKTB}`)
        return { success: true, message: "Catatan pengontrolan berhasil dihapus" }
    } catch (error) {
        console.error("Error deletePengontrolan:", error)
        return { success: false, message: "Gagal menghapus catatan pengontrolan" }
    }
}

export async function getPengontrolanMetrics() {
    try {
        const session = await auth()
        const role = session?.user?.role
        const idAnggota = session?.user?.idAnggota

        let idPengurusFilter: string | undefined = undefined
        if (role === "ANGGOTAKTB" && idAnggota) {
            const bp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            })
            if (bp) {
                idPengurusFilter = bp.id
            } else {
                return { total: 0, terkontrolMingguIni: 0, aktif: 0, macetAtauVakum: 0 }
            }
        }

        const now = new Date()
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(now.getDate() - 7)
        sevenDaysAgo.setHours(0, 0, 0, 0)

        const baseWhere = idPengurusFilter ? { ktb: { idPengurus: idPengurusFilter } } : undefined

        const [total, terkontrolMingguIni, aktif, macetAtauVakum] = await Promise.all([
            db.pengontrolan.count({ where: baseWhere }),
            db.pengontrolan.count({
                where: {
                    ...baseWhere,
                    tanggal: { gte: sevenDaysAgo },
                },
            }),
            db.pengontrolan.count({
                where: {
                    ...baseWhere,
                    status: StatusPengontrolan.AKTIF,
                },
            }),
            db.pengontrolan.count({
                where: {
                    ...baseWhere,
                    status: { in: [StatusPengontrolan.MACET, StatusPengontrolan.VAKUM] },
                },
            }),
        ])

        return {
            total,
            terkontrolMingguIni,
            aktif,
            macetAtauVakum,
        }
    } catch (error) {
        console.error("Error getPengontrolanMetrics:", error)
        return {
            total: 0,
            terkontrolMingguIni: 0,
            aktif: 0,
            macetAtauVakum: 0,
        }
    }
}

export async function getPengontrolanByKTB(idKTB: string) {
    try {
        const data = await db.pengontrolan.findMany({
            where: { idKTB },
            orderBy: { tanggal: "desc" },
        })
        return { success: true, data }
    } catch (error) {
        console.error("Error getPengontrolanByKTB:", error)
        return { success: false, data: [] }
    }
}
