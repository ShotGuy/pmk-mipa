"use server"

import { db } from "@/lib/db"
import { StatusPengontrolan, Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireRole } from "@/lib/rbac"

const PENGONTROLAN_READ_ROLES = [Role.ADMIN, Role.KETUA, Role.KOORKTB, Role.ANGGOTAKTB]
const PENGONTROLAN_MUTATION_ROLES = [Role.ADMIN, Role.KOORKTB, Role.ANGGOTAKTB]

const PengontrolanSchema = z.object({
    idKTB: z.string().min(1, "Pilih kelompok KTB"),
    tanggal: z.date({ message: "Tanggal wajib diisi" }),
    bahan: z.string().optional().nullable(),
    status: z.nativeEnum(StatusPengontrolan),
    keterangan: z.string().optional().nullable(),
})

export type PengontrolanFormValues = z.infer<typeof PengontrolanSchema>

export async function getAllPengontrolan() {
    const authCheck = await requireRole(PENGONTROLAN_READ_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message, data: [] }
    }

    try {
        const { user } = authCheck
        const role = user.role
        const idAnggota = user.idAnggota

        let idPengurusFilter: string | undefined = undefined

        // Jika ANGGOTAKTB, batasi hanya pada KTB yang ia dampingi (Fail-closed)
        if (role === Role.ANGGOTAKTB) {
            if (!idAnggota) {
                return { success: true, data: [] }
            }
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
    const authCheck = await requireRole(PENGONTROLAN_READ_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const { user } = authCheck
    const role = user.role
    const idAnggota = user.idAnggota

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

        // Fail-closed ownership check jika pemanggil adalah ANGGOTAKTB
        if (role === Role.ANGGOTAKTB) {
            if (!idAnggota) {
                return { success: false, message: "Akses ditolak: Profil Anda belum terhubung." }
            }
            const bp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            })
            if (!bp || data.ktb?.pengurus?.id !== bp.id) {
                return { success: false, message: "Akses ditolak: Anda hanya dapat mengakses riwayat pengontrolan KTB yang Anda dampingi." }
            }
        }

        return { success: true, data }
    } catch (error) {
        console.error("Error getPengontrolan:", error)
        return { success: false, message: "Gagal mengambil data pengontrolan" }
    }
}

export async function getKTBOptionsForPengontrolan() {
    const authCheck = await requireRole(PENGONTROLAN_READ_ROLES)
    if (!authCheck.success) {
        return []
    }

    try {
        const { user } = authCheck
        const role = user.role
        const idAnggota = user.idAnggota

        let idPengurusFilter: string | undefined = undefined
        if (role === Role.ANGGOTAKTB) {
            if (!idAnggota) return []
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
    const authCheck = await requireRole(PENGONTROLAN_MUTATION_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const { user } = authCheck
    const role = user.role
    const idAnggota = user.idAnggota

    const validated = PengontrolanSchema.safeParse(values)
    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues[0]?.message || "Input tidak valid",
        }
    }

    // Validasi kepemilikan KTB untuk ANGGOTAKTB (Fail-closed)
    if (role === Role.ANGGOTAKTB) {
        if (!idAnggota) {
            return {
                success: false,
                message: "Akses ditolak: Akun Anda tidak terhubung dengan data profil Anggota.",
            }
        }
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
    const authCheck = await requireRole(PENGONTROLAN_MUTATION_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const { user } = authCheck
    const role = user.role
    const idAnggota = user.idAnggota

    const validated = PengontrolanSchema.safeParse(values)
    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues[0]?.message || "Input tidak valid",
        }
    }

    // Ownership check for ANGGOTAKTB (Fail-closed)
    if (role === Role.ANGGOTAKTB) {
        if (!idAnggota) {
            return {
                success: false,
                message: "Akses ditolak: Akun Anda tidak terhubung dengan data profil Anggota.",
            }
        }
        const existing = await db.pengontrolan.findUnique({
            where: { id },
            include: { ktb: { select: { idPengurus: true } } },
        })
        if (!existing) {
            return { success: false, message: "Data pengontrolan tidak ditemukan" }
        }
        const bp = await db.badanPengurus.findFirst({
            where: { idAnggota, status: true },
            select: { id: true },
        })
        if (!bp || existing.ktb.idPengurus !== bp.id) {
            return {
                success: false,
                message: "Akses ditolak: Anda hanya dapat memperbarui pengontrolan untuk KTB yang Anda dampingi.",
            }
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
    const authCheck = await requireRole(PENGONTROLAN_MUTATION_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const { user } = authCheck
    const role = user.role
    const idAnggota = user.idAnggota

    // Ownership check for ANGGOTAKTB (Fail-closed)
    if (role === Role.ANGGOTAKTB) {
        if (!idAnggota) {
            return {
                success: false,
                message: "Akses ditolak: Akun Anda tidak terhubung dengan data profil Anggota.",
            }
        }
        const existing = await db.pengontrolan.findUnique({
            where: { id },
            include: { ktb: { select: { idPengurus: true } } },
        })
        if (!existing) {
            return { success: false, message: "Data pengontrolan tidak ditemukan" }
        }
        const bp = await db.badanPengurus.findFirst({
            where: { idAnggota, status: true },
            select: { id: true },
        })
        if (!bp || existing.ktb.idPengurus !== bp.id) {
            return {
                success: false,
                message: "Akses ditolak: Anda hanya dapat menghapus catatan pengontrolan untuk KTB yang Anda dampingi.",
            }
        }
    }

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
    const authCheck = await requireRole(PENGONTROLAN_READ_ROLES)
    if (!authCheck.success) {
        return {
            total: 0,
            terkontrolMingguIni: 0,
            aktif: 0,
            macetAtauVakum: 0,
        }
    }

    try {
        const { user } = authCheck
        const role = user.role
        const idAnggota = user.idAnggota

        let idPengurusFilter: string | undefined = undefined
        if (role === Role.ANGGOTAKTB) {
            if (!idAnggota) {
                return { total: 0, terkontrolMingguIni: 0, aktif: 0, macetAtauVakum: 0 }
            }
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
    const authCheck = await requireRole(PENGONTROLAN_READ_ROLES)
    if (!authCheck.success) {
        return { success: false, data: [] }
    }

    try {
        const { user } = authCheck
        const role = user.role
        const idAnggota = user.idAnggota

        if (role === Role.ANGGOTAKTB) {
            if (!idAnggota) {
                return { success: false, message: "Akses ditolak: Profil belum terhubung.", data: [] }
            }
            const bp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            })
            const targetKTB = await db.kTB.findUnique({
                where: { id: idKTB },
                select: { idPengurus: true },
            })
            if (!bp || targetKTB?.idPengurus !== bp.id) {
                return {
                    success: false,
                    message: "Akses ditolak: Anda hanya dapat melihat riwayat kelompok KTB yang Anda dampingi.",
                    data: [],
                }
            }
        }

        const data = await db.pengontrolan.findMany({
            where: { idKTB },
            orderBy: { tanggal: "desc" },
        })
        return { success: true, data }
    } catch (error) {
        console.error("Error getPengontrolanByKTB:", error)
        return { success: false, message: "Gagal mengambil data pengontrolan", data: [] }
    }
}
