"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import crypto from "crypto"
import { auth } from "@/auth"

// Helper function to generate unique alphanumeric token
function generateToken(): string {
    return crypto.randomBytes(6).toString("hex") // 12 chars
}

const ManualKehadiranSchema = z.object({
    idKegiatan: z.string().min(1, "Kegiatan wajib dipilih"),
    tipe: z.enum(["ANGGOTA", "PENGUNJUNG"]),
    idAnggota: z.string().optional(),
    nama: z.string().min(1, "Nama wajib diisi"),
    status: z.enum(["APMK", "NON_APMK", "AKTB"]),
    prodi: z.string().optional().nullable(),
    angkatan: z.coerce.number().optional().nullable(),
    noHp: z.string().optional().nullable(),
    jenisKelamin: z.string().optional().nullable(),
    tauPmkDariMana: z.string().optional().nullable(),
})

const PengunjungSchema = z.object({
    nama: z.string().min(2, "Nama minimal 2 karakter"),
    jenisKelamin: z.enum(["L", "P"], { message: "Pilih jenis kelamin" }),
    prodi: z.string().optional(),
    angkatan: z.coerce.number().min(1990).max(2100).optional().nullable(),
    noHp: z.string().optional(),
    tauPmkDariMana: z.string().optional(),
})

export type ManualKehadiranValues = z.infer<typeof ManualKehadiranSchema>
export type PengunjungValues = z.infer<typeof PengunjungSchema>

/**
 * Mengambil daftar seluruh kegiatan untuk dropdown manajemen presensi admin
 */
export async function getKegiatanListForKehadiran() {
    try {
        const list = await db.kegiatan.findMany({
            orderBy: { tanggal: "desc" },
            include: {
                jenisKegiatan: { select: { nama: true } },
                _count: { select: { kehadiran: true } },
            },
        })

        return list.map((k) => ({
            id: k.id,
            nama: k.nama,
            tanggal: k.tanggal,
            lokasi: k.lokasi,
            waktu: k.waktu,
            isPresensiOpen: k.isPresensiOpen,
            presensiToken: k.presensiToken,
            jenisKegiatanNama: k.jenisKegiatan.nama,
            totalKehadiran: k._count.kehadiran,
        }))
    } catch (error) {
        console.error("Failed to get kegiatan list for kehadiran:", error)
        return []
    }
}

/**
 * Mengambil seluruh data rekaman kehadiran untuk 1 kegiatan terpilih
 */
export async function getKehadiranByKegiatan(idKegiatan: string) {
    try {
        return await db.kehadiran.findMany({
            where: { idKegiatan },
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
                kegiatan: {
                    select: {
                        id: true,
                        nama: true,
                        tanggal: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
    } catch (error) {
        console.error("Failed to get kehadiran by kegiatan:", error)
        return []
    }
}

/**
 * Mengambil kartu metrik ringkasan kehadiran untuk kegiatan terpilih
 */
export async function getKehadiranMetrics(idKegiatan: string) {
    try {
        const [totalHadir, totalAnggotaHadir, totalPengunjung, totalAnggotaPMK] = await Promise.all([
            db.kehadiran.count({ where: { idKegiatan } }),
            db.kehadiran.count({
                where: {
                    idKegiatan,
                    status: { in: ["APMK", "AKTB"] },
                },
            }),
            db.kehadiran.count({
                where: {
                    idKegiatan,
                    status: "NON_APMK",
                },
            }),
            db.anggota.count(),
        ])

        const persentaseHadir =
            totalAnggotaPMK > 0 ? Math.round((totalAnggotaHadir / totalAnggotaPMK) * 100) : 0

        return {
            totalHadir,
            totalAnggotaHadir,
            totalPengunjung,
            totalAnggotaPMK,
            persentaseHadir,
        }
    } catch (error) {
        console.error("Failed to get kehadiran metrics:", error)
        return {
            totalHadir: 0,
            totalAnggotaHadir: 0,
            totalPengunjung: 0,
            totalAnggotaPMK: 0,
            persentaseHadir: 0,
        }
    }
}

/**
 * Toggle Buka/Tutup Presensi dan pastikan token unik terbentuk
 */
export async function togglePresensiKegiatan(idKegiatan: string, forceStatus?: boolean) {
    const session = await auth()
    if (session?.user?.role === "KETUA") {
        return { success: false, message: "Ketua hanya memiliki hak akses membaca (read-only)." }
    }

    try {
        const kegiatan = await db.kegiatan.findUnique({
            where: { id: idKegiatan },
            select: { id: true, isPresensiOpen: true, presensiToken: true, nama: true },
        })

        if (!kegiatan) {
            return { success: false, message: "Kegiatan tidak ditemukan" }
        }

        const nextStatus = forceStatus !== undefined ? forceStatus : !kegiatan.isPresensiOpen
        let token = kegiatan.presensiToken

        // Buat token baru jika belum ada
        if (!token) {
            token = generateToken()
        }

        await db.kegiatan.update({
            where: { id: idKegiatan },
            data: {
                isPresensiOpen: nextStatus,
                presensiToken: token,
            },
        })

        revalidatePath("/admin/kehadiran")
        if (token) {
            revalidatePath(`/presensi/${token}`)
        }

        return {
            success: true,
            isPresensiOpen: nextStatus,
            presensiToken: token,
            message: nextStatus
                ? `Presensi untuk "${kegiatan.nama}" berhasil DIBUKA.`
                : `Presensi untuk "${kegiatan.nama}" telah DITUTUP.`,
        }
    } catch (error) {
        console.error("Failed to toggle presensi kegiatan:", error)
        return { success: false, message: "Gagal memperbarui status presensi kegiatan" }
    }
}

/**
 * Mengambil informasi ringkas kegiatan untuk halaman publik presensi mandiri (/presensi/[token])
 */
export async function getPublicKegiatanByToken(token: string) {
    try {
        const kegiatan = await db.kegiatan.findUnique({
            where: { presensiToken: token },
            select: {
                id: true,
                nama: true,
                tanggal: true,
                waktu: true,
                lokasi: true,
                pembicara: true,
                isPresensiOpen: true,
                presensiToken: true,
                jenisKegiatan: { select: { nama: true } },
            },
        })

        if (!kegiatan) return null

        return kegiatan
    } catch (error) {
        console.error("Failed to get public kegiatan by token:", error)
        return null
    }
}

/**
 * Mengambil daftar anggota PMK beserta info apakah sudah absen di kegiatan ini
 */
export async function getAnggotaListForPresensi(idKegiatan: string) {
    try {
        const [anggotaList, alreadyAttended] = await Promise.all([
            db.anggota.findMany({
                select: {
                    id: true,
                    nama: true,
                    prodi: true,
                    angkatan: true,
                    anggotaKTB: {
                        where: { isAktif: true, ktb: { status: "AKTIF" } },
                        select: { id: true },
                    },
                    ktbDipimpin: {
                        where: { status: "AKTIF" },
                        select: { id: true },
                    },
                },
                orderBy: { nama: "asc" },
            }),
            db.kehadiran.findMany({
                where: {
                    idKegiatan,
                    idAnggota: { not: null },
                },
                select: { idAnggota: true },
            }),
        ])

        const attendedSet = new Set(alreadyAttended.map((k) => k.idAnggota))

        return anggotaList.map((a) => {
            const isAKTB = (a.anggotaKTB && a.anggotaKTB.length > 0) || (a.ktbDipimpin && a.ktbDipimpin.length > 0)
            return {
                id: a.id,
                nama: a.nama,
                prodi: a.prodi || "-",
                angkatan: a.angkatan,
                sudahHadir: attendedSet.has(a.id),
                isAKTB,
            }
        })
    } catch (error) {
        console.error("Failed to get anggota list for presensi:", error)
        return []
    }
}

/**
 * Submit presensi mandiri oleh Anggota PMK (Cegah dobel absen)
 */
export async function submitPresensiAnggota(token: string, idAnggota: string) {
    try {
        const kegiatan = await db.kegiatan.findUnique({
            where: { presensiToken: token },
            select: { id: true, nama: true, isPresensiOpen: true },
        })

        if (!kegiatan) {
            return { success: false, message: "Kegiatan tidak ditemukan atau link tidak valid" }
        }

        if (!kegiatan.isPresensiOpen) {
            return {
                success: false,
                message: "Presensi untuk kegiatan ini sedang ditutup oleh pengurus.",
            }
        }

        // Cek apakah sudah pernah absen di kegiatan ini
        const existing = await db.kehadiran.findFirst({
            where: {
                idKegiatan: kegiatan.id,
                idAnggota,
            },
        })

        if (existing) {
            const timeStr = existing.createdAt.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            })
            return {
                success: false,
                message: `Anda sudah tercatat hadir pada kegiatan ini sebelumnya (pukul ${timeStr} WIB).`,
            }
        }

        const anggota = await db.anggota.findUnique({
            where: { id: idAnggota },
            select: {
                id: true,
                nama: true,
                prodi: true,
                angkatan: true,
                noHp: true,
                anggotaKTB: {
                    where: { isAktif: true, ktb: { status: "AKTIF" } },
                    select: { id: true },
                },
                ktbDipimpin: {
                    where: { status: "AKTIF" },
                    select: { id: true },
                },
            },
        })

        if (!anggota) {
            return { success: false, message: "Data anggota tidak ditemukan di sistem." }
        }

        const isAKTB = (anggota.anggotaKTB && anggota.anggotaKTB.length > 0) || (anggota.ktbDipimpin && anggota.ktbDipimpin.length > 0)
        const status: "AKTB" | "APMK" = isAKTB ? "AKTB" : "APMK"

        await db.kehadiran.create({
            data: {
                idKegiatan: kegiatan.id,
                idAnggota: anggota.id,
                nama: anggota.nama,
                status,
                prodi: anggota.prodi,
                angkatan: anggota.angkatan,
                noHp: anggota.noHp,
            },
        })

        revalidatePath("/admin/kehadiran")
        revalidatePath(`/presensi/${token}`)

        return {
            success: true,
            nama: anggota.nama,
            message: `Puji Tuhan! Presensi atas nama ${anggota.nama} berhasil dicatat. Selamat beribadah!`,
        }
    } catch (error) {
        console.error("Failed to submit presensi anggota:", error)
        return { success: false, message: "Terjadi kesalahan pada server saat memproses presensi." }
    }
}

/**
 * Submit presensi mandiri oleh Pengunjung / Simpatisan Luar (NON_APMK)
 */
export async function submitPresensiPengunjung(token: string, rawValues: PengunjungValues) {
    try {
        const validated = PengunjungSchema.safeParse(rawValues)
        if (!validated.success) {
            return {
                success: false,
                message: validated.error.issues[0]?.message || "Data formulir tidak valid",
            }
        }

        const values = validated.data

        const kegiatan = await db.kegiatan.findUnique({
            where: { presensiToken: token },
            select: { id: true, nama: true, isPresensiOpen: true },
        })

        if (!kegiatan) {
            return { success: false, message: "Kegiatan tidak ditemukan atau link tidak valid" }
        }

        if (!kegiatan.isPresensiOpen) {
            return {
                success: false,
                message: "Presensi untuk kegiatan ini sedang ditutup oleh pengurus.",
            }
        }

        // Cek jika nama pengunjung persis sudah absen dalam kegiatan ini
        const existing = await db.kehadiran.findFirst({
            where: {
                idKegiatan: kegiatan.id,
                idAnggota: null,
                nama: { equals: values.nama.trim(), mode: "insensitive" },
            },
        })

        if (existing) {
            return {
                success: false,
                message: `Presensi atas nama "${values.nama}" sudah pernah dikirimkan sebelumnya pada kegiatan ini.`,
            }
        }

        await db.kehadiran.create({
            data: {
                idKegiatan: kegiatan.id,
                idAnggota: null,
                nama: values.nama.trim(),
                status: "NON_APMK",
                prodi: values.prodi || null,
                angkatan: values.angkatan ? Number(values.angkatan) : null,
                noHp: values.noHp || null,
                jenisKelamin: values.jenisKelamin,
                tauPmkDariMana: values.tauPmkDariMana || null,
            },
        })

        revalidatePath("/admin/kehadiran")
        revalidatePath(`/presensi/${token}`)

        return {
            success: true,
            nama: values.nama,
            message: `Selamat datang di PMK MIPA, ${values.nama}! Presensi Anda telah berhasil dicatat.`,
        }
    } catch (error) {
        console.error("Failed to submit presensi pengunjung:", error)
        return { success: false, message: "Gagal memproses presensi pengunjung." }
    }
}

/**
 * Input manual kehadiran oleh Badan Pengurus melalui Admin Dashboard
 */
export async function createManualKehadiran(rawValues: ManualKehadiranValues) {
    const session = await auth()
    if (session?.user?.role === "KETUA") {
        return { success: false, message: "Ketua hanya memiliki hak akses membaca (read-only)." }
    }

    try {
        const validated = ManualKehadiranSchema.safeParse(rawValues)
        if (!validated.success) {
            return {
                success: false,
                message: validated.error.issues[0]?.message || "Validasi gagal",
            }
        }

        const {
            idKegiatan,
            tipe,
            idAnggota,
            nama,
            status,
            prodi,
            angkatan,
            noHp,
            jenisKelamin,
            tauPmkDariMana,
        } = validated.data

        if (tipe === "ANGGOTA" && idAnggota) {
            // Cek duplikasi
            const existing = await db.kehadiran.findFirst({
                where: { idKegiatan, idAnggota },
            })
            if (existing) {
                return { success: false, message: "Anggota ini sudah tercatat hadir di kegiatan ini." }
            }

            const anggota = await db.anggota.findUnique({ where: { id: idAnggota } })
            if (!anggota) {
                return { success: false, message: "Anggota tidak ditemukan" }
            }

            await db.kehadiran.create({
                data: {
                    idKegiatan,
                    idAnggota: anggota.id,
                    nama: anggota.nama,
                    status,
                    prodi: anggota.prodi,
                    angkatan: anggota.angkatan,
                    noHp: anggota.noHp,
                },
            })
        } else {
            await db.kehadiran.create({
                data: {
                    idKegiatan,
                    idAnggota: null,
                    nama: nama.trim(),
                    status: "NON_APMK",
                    prodi: prodi || null,
                    angkatan: angkatan ? Number(angkatan) : null,
                    noHp: noHp || null,
                    jenisKelamin: jenisKelamin || null,
                    tauPmkDariMana: tauPmkDariMana || null,
                },
            })
        }

        revalidatePath("/admin/kehadiran")
        return { success: true, message: "Data kehadiran berhasil ditambahkan secara manual." }
    } catch (error) {
        console.error("Failed to create manual kehadiran:", error)
        return { success: false, message: "Gagal menyimpan data kehadiran" }
    }
}

/**
 * Menghapus data rekaman kehadiran
 */
export async function deleteKehadiran(id: string) {
    const session = await auth()
    if (session?.user?.role === "KETUA") {
        return { success: false, message: "Ketua hanya memiliki hak akses membaca (read-only)." }
    }

    try {
        await db.kehadiran.delete({
            where: { id },
        })

        revalidatePath("/admin/kehadiran")
        return { success: true, message: "Catatan kehadiran berhasil dihapus." }
    } catch (error) {
        console.error("Failed to delete kehadiran:", error)
        return { success: false, message: "Gagal menghapus rekaman kehadiran." }
    }
}
