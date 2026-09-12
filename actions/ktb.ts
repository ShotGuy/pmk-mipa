"use server"

import { db } from "@/lib/db"
import { StatusKTB, Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireRole } from "@/lib/rbac"

const KTB_READ_ROLES = [Role.ADMIN, Role.KETUA, Role.KOORKTB, Role.ANGGOTAKTB]
const KTB_MANAGE_ROLES = [Role.ADMIN, Role.KOORKTB]
const KTB_MEMBER_ROLES = [Role.ADMIN, Role.KOORKTB, Role.ANGGOTAKTB]

const KTBSchema = z.object({
    nama: z.string().min(1, "Nama KTB wajib diisi"),
    angkatan: z.coerce.number().int().min(2000, "Angkatan tidak valid"),
    terbentukDimana: z.string().optional().nullable(),
    idPemimpin: z.string().min(1, "Pilih pemimpin KTB"),
    idPengurus: z.string().min(1, "Pilih pengurus pendamping"),
    status: z.nativeEnum(StatusKTB),
})

export type KTBFormValues = z.infer<typeof KTBSchema>

export async function getAllKTB() {
    const authCheck = await requireRole(KTB_READ_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message, data: [] }
    }
    try {
        const data = await db.kTB.findMany({
            orderBy: [{ status: "asc" }, { angkatan: "desc" }, { createdAt: "desc" }],
            include: {
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
                anggotaKTB: {
                    include: {
                        anggota: {
                            select: {
                                id: true,
                                nama: true,
                                prodi: true,
                                angkatan: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        })

        return { success: true, data }
    } catch (error) {
        console.error("Error getAllKTB:", error)
        return { success: false, message: "Gagal memuat data KTB", data: [] }
    }
}

export async function getKTB(id: string) {
    const authCheck = await requireRole(KTB_READ_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const data = await db.kTB.findUnique({
            where: { id },
            include: {
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
                anggotaKTB: {
                    include: {
                        anggota: {
                            select: {
                                id: true,
                                nama: true,
                                prodi: true,
                                angkatan: true,
                                noHp: true,
                            },
                        },
                    },
                    orderBy: [{ isAktif: "desc" }, { createdAt: "asc" }],
                },
                pengontrolan: {
                    orderBy: { tanggal: "desc" },
                },
            },
        })

        if (!data) return { success: false, message: "KTB tidak ditemukan" }
        return { success: true, data }
    } catch (error) {
        console.error("Error getKTB:", error)
        return { success: false, message: "Gagal mengambil data KTB" }
    }
}

export async function getAnggotaOptionsForPemimpin() {
    try {
        const anggotas = await db.anggota.findMany({
            orderBy: { nama: "asc" },
            select: {
                id: true,
                nama: true,
                prodi: true,
                angkatan: true,
            },
        })

        return anggotas.map((a) => ({
            value: a.id,
            label: `${a.nama} (${a.prodi || "-"} ${a.angkatan ? `'${String(a.angkatan).slice(-2)}` : ""})`,
        }))
    } catch (error) {
        console.error("Error getAnggotaOptionsForPemimpin:", error)
        return []
    }
}

export async function getPengurusOptionsForKTB() {
    try {
        const pengurus = await db.badanPengurus.findMany({
            where: { status: true },
            include: {
                anggota: {
                    select: {
                        nama: true,
                    },
                },
            },
            orderBy: { jabatan: "asc" },
        })

        return pengurus.map((p) => {
            const formattedJabatan = p.jabatan.replace(/_/g, " ")
            return {
                value: p.id,
                label: `${p.anggota.nama} - ${formattedJabatan}`,
            }
        })
    } catch (error) {
        console.error("Error getPengurusOptionsForKTB:", error)
        return []
    }
}

export async function createKTB(values: KTBFormValues) {
    const authCheck = await requireRole(KTB_MANAGE_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const validated = KTBSchema.safeParse(values)
    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues[0]?.message || "Input tidak valid",
        }
    }

    try {
        const created = await db.kTB.create({
            data: {
                nama: validated.data.nama,
                angkatan: validated.data.angkatan,
                terbentukDimana: validated.data.terbentukDimana || null,
                idPemimpin: validated.data.idPemimpin,
                idPengurus: validated.data.idPengurus,
                status: validated.data.status,
            },
        })

        revalidatePath("/admin/ktb")
        return { success: true, message: "Kelompok KTB berhasil dibuat", id: created.id }
    } catch (error) {
        console.error("Error createKTB:", error)
        return { success: false, message: "Gagal membuat kelompok KTB" }
    }
}

export async function updateKTB(id: string, values: KTBFormValues) {
    const authCheck = await requireRole(KTB_MANAGE_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    const validated = KTBSchema.safeParse(values)
    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues[0]?.message || "Input tidak valid",
        }
    }

    try {
        await db.kTB.update({
            where: { id },
            data: {
                nama: validated.data.nama,
                angkatan: validated.data.angkatan,
                terbentukDimana: validated.data.terbentukDimana || null,
                idPemimpin: validated.data.idPemimpin,
                idPengurus: validated.data.idPengurus,
                status: validated.data.status,
            },
        })

        revalidatePath("/admin/ktb")
        revalidatePath(`/admin/ktb/${id}`)
        return { success: true, message: "Data KTB berhasil diperbarui" }
    } catch (error) {
        console.error("Error updateKTB:", error)
        return { success: false, message: "Gagal memperbarui data KTB" }
    }
}

export async function deleteKTB(id: string) {
    const authCheck = await requireRole(KTB_MANAGE_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        // Cek riwayat pengontrolan
        const pengontrolanCount = await db.pengontrolan.count({
            where: { idKTB: id },
        })

        if (pengontrolanCount > 0) {
            return {
                success: false,
                message: `KTB ini memiliki ${pengontrolanCount} catatan pengontrolan dan tidak dapat dihapus. Anda dapat mengubah statusnya menjadi MERGER.`,
            }
        }

        await db.kTB.delete({
            where: { id },
        })

        revalidatePath("/admin/ktb")
        return { success: true, message: "Kelompok KTB berhasil dihapus" }
    } catch (error) {
        console.error("Error deleteKTB:", error)
        return { success: false, message: "Gagal menghapus kelompok KTB" }
    }
}

// -------------------------------------------------------------
// OPERASI KEANGGOTAAN KTB (MEMBERSHIP & MERGER)
// -------------------------------------------------------------

export async function getAvailableAnggotaForKTB(idKTB: string) {
    try {
        // Ambil anggota yang belum tergabung aktif di KTB ini
        const existingMembers = await db.kTBAnggota.findMany({
            where: { idKTB, isAktif: true },
            select: { idAnggota: true },
        })

        const excludedIds = existingMembers.map((m) => m.idAnggota)

        const anggotas = await db.anggota.findMany({
            where: {
                id: { notIn: excludedIds },
            },
            include: {
                anggotaKTB: {
                    where: { isAktif: true },
                    include: {
                        ktb: {
                            select: {
                                nama: true,
                            },
                        },
                    },
                },
            },
            orderBy: { nama: "asc" },
        })

        return anggotas.map((a) => {
            const activeKtbName = a.anggotaKTB?.[0]?.ktb?.nama
            return {
                value: a.id,
                label: a.nama,
                subtitle: `${a.prodi || "-"} ${a.angkatan ? `(${a.angkatan})` : ""}${
                    activeKtbName ? ` • Saat ini di: ${activeKtbName}` : " • Belum punya KTB"
                }`,
            }
        })
    } catch (error) {
        console.error("Error getAvailableAnggotaForKTB:", error)
        return []
    }
}

export async function addAnggotaToKTB(idKTB: string, idAnggota: string) {
    const authCheck = await requireRole(KTB_MEMBER_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        // Nonaktifkan keanggotaan aktif sebelumnya di KTB lain jika ada
        await db.kTBAnggota.updateMany({
            where: {
                idAnggota,
                idKTB: { not: idKTB },
                isAktif: true,
            },
            data: { isAktif: false },
        })

        // Upsert ke KTBAnggota untuk KTB ini
        await db.kTBAnggota.upsert({
            where: {
                idKTB_idAnggota: {
                    idKTB,
                    idAnggota,
                },
            },
            update: {
                isAktif: true,
            },
            create: {
                idKTB,
                idAnggota,
                isAktif: true,
            },
        })

        revalidatePath(`/admin/ktb/${idKTB}`)
        revalidatePath("/admin/ktb")
        revalidatePath("/admin/anggota")
        return { success: true, message: "Anggota berhasil ditambahkan ke kelompok KTB" }
    } catch (error) {
        console.error("Error addAnggotaToKTB:", error)
        return { success: false, message: "Gagal menambahkan anggota ke KTB" }
    }
}

export async function toggleStatusAnggotaKTB(idKTBAnggota: string, isAktif: boolean) {
    const authCheck = await requireRole(KTB_MEMBER_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const item = await db.kTBAnggota.update({
            where: { id: idKTBAnggota },
            data: { isAktif },
            select: { idKTB: true },
        })

        revalidatePath(`/admin/ktb/${item.idKTB}`)
        revalidatePath("/admin/ktb")
        revalidatePath("/admin/anggota")
        return {
            success: true,
            message: `Status keanggotaan diubah menjadi ${isAktif ? "Aktif" : "Riwayat / Nonaktif"}`,
        }
    } catch (error) {
        console.error("Error toggleStatusAnggotaKTB:", error)
        return { success: false, message: "Gagal memperbarui status keanggotaan" }
    }
}

export async function removeAnggotaFromKTB(idKTBAnggota: string) {
    const authCheck = await requireRole(KTB_MEMBER_ROLES)
    if (!authCheck.success) {
        return { success: false, message: authCheck.message }
    }

    try {
        const item = await db.kTBAnggota.delete({
            where: { id: idKTBAnggota },
            select: { idKTB: true },
        })

        revalidatePath(`/admin/ktb/${item.idKTB}`)
        revalidatePath("/admin/ktb")
        revalidatePath("/admin/anggota")
        return { success: true, message: "Anggota berhasil dikeluarkan dari riwayat KTB" }
    } catch (error) {
        console.error("Error removeAnggotaFromKTB:", error)
        return { success: false, message: "Gagal menghapus anggota dari KTB" }
    }
}

export async function getKTBMetrics() {
    const authCheck = await requireRole(KTB_READ_ROLES)
    if (!authCheck.success) {
        return {
            totalKTB: 0,
            aktifKTB: 0,
            mergerKTB: 0,
            totalAnggotaTerbina: 0,
        }
    }

    try {
        const [totalKTB, aktifKTB, mergerKTB, totalAnggotaTerbina] = await Promise.all([
            db.kTB.count(),
            db.kTB.count({ where: { status: StatusKTB.AKTIF } }),
            db.kTB.count({ where: { status: StatusKTB.MERGER } }),
            db.kTBAnggota.count({ where: { isAktif: true } }),
        ])

        return {
            totalKTB,
            aktifKTB,
            mergerKTB,
            totalAnggotaTerbina,
        }
    } catch (error) {
        console.error("Error getKTBMetrics:", error)
        return {
            totalKTB: 0,
            aktifKTB: 0,
            mergerKTB: 0,
            totalAnggotaTerbina: 0,
        }
    }
}
