"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Jabatan, Role } from "@prisma/client";
import { requireRole } from "@/lib/rbac";

const JABATAN_ENUM = [
    "KETUA",
    "SEKRETARIS",
    "BENDAHARA",
    "KOORDINATOR_ACARA",
    "ANGGOTA_ACARA",
    "KOORDINATOR_KTB",
    "ANGGOTA_KTB",
    "KOORDINATOR_DOA_DAN_PEMERHATI",
    "ANGGOTA_DOA_DAN_PEMERHATI",
] as const;

const BadanPengurusSchema = z.object({
    idAnggota: z.string().min(1, "Anggota wajib dipilih"),
    jabatan: z.enum(JABATAN_ENUM, { message: "Jabatan wajib dipilih" }),
    masaJabatan: z.string().min(1, "Masa jabatan wajib diisi (contoh: 2024/2025)"),
    status: z.boolean().default(true),
    prodi: z.string().optional().nullable(),
    socialMedia: z.string().optional().nullable(),
});

export type BadanPengurusFormValues = z.infer<typeof BadanPengurusSchema>;

const BP_READ_ROLES = [
    Role.ADMIN,
    Role.KETUA,
    Role.SEKRETARIS,
    Role.BENDAHARA,
    Role.KOORDOA,
    Role.ANGGOTADOA,
    Role.KOORKTB,
    Role.ANGGOTAKTB,
    Role.KOORACARA,
    Role.ANGGOTAACARA,
];

export async function getAnggotaOptionsForBP() {
    const authCheck = await requireRole([Role.ADMIN, Role.KOORDOA, Role.ANGGOTADOA]);
    if (!authCheck.success) {
        return [];
    }

    try {
        const anggotaList = await db.anggota.findMany({
            orderBy: { nama: "asc" },
            select: {
                id: true,
                nama: true,
                prodi: true,
                angkatan: true,
            }
        });

        return anggotaList.map(a => ({
            label: `${a.nama} ${a.angkatan ? `(${a.angkatan})` : ''}`,
            value: a.id,
            prodi: a.prodi || "",
        }));
    } catch (error) {
        console.error("Error fetching anggota options:", error);
        return [];
    }
}

export async function getAllBadanPengurus() {
    const authCheck = await requireRole(BP_READ_ROLES);
    if (!authCheck.success) {
        return { success: false, message: authCheck.message, data: [] };
    }

    try {
        const data = await db.badanPengurus.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                anggota: {
                    select: {
                        id: true,
                        nama: true,
                        angkatan: true,
                        prodi: true,
                        noHp: true,
                    }
                }
            }
        });

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching all badan pengurus:", error);
        return { success: false, message: "Gagal memuat data badan pengurus", data: [] };
    }
}

export async function getBadanPengurus(id: string) {
    const authCheck = await requireRole(BP_READ_ROLES);
    if (!authCheck.success) {
        return { success: false, message: authCheck.message };
    }

    try {
        const data = await db.badanPengurus.findUnique({
            where: { id },
            include: {
                anggota: {
                    select: {
                        id: true,
                        nama: true,
                        angkatan: true,
                        prodi: true,
                    }
                }
            }
        });

        if (!data) {
            return { success: false, message: "Data badan pengurus tidak ditemukan" };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching badan pengurus by id:", error);
        return { success: false, message: "Gagal memuat detail badan pengurus" };
    }
}

export async function createBadanPengurus(values: BadanPengurusFormValues) {
    const authCheck = await requireRole([Role.ADMIN, Role.KOORDOA, Role.ANGGOTADOA]);
    if (!authCheck.success) {
        return { success: false, message: authCheck.message };
    }

    const validatedFields = BadanPengurusSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Data yang dimasukkan tidak valid" };
    }

    const { idAnggota, jabatan, masaJabatan, status, prodi, socialMedia } = validatedFields.data;

    try {
        await db.badanPengurus.create({
            data: {
                idAnggota,
                jabatan: jabatan as Jabatan,
                masaJabatan,
                status,
                prodi: prodi || null,
                socialMedia: socialMedia || null,
            }
        });

        revalidatePath("/admin/badan-pengurus");
        revalidatePath("/admin/users");
        return { success: true, message: "Badan Pengurus berhasil ditambahkan" };
    } catch (error) {
        console.error("Error creating badan pengurus:", error);
        const msg = error instanceof Error ? error.message : "Gagal menambahkan badan pengurus";
        return { success: false, message: msg };
    }
}

export async function updateBadanPengurus(id: string, values: BadanPengurusFormValues) {
    const authCheck = await requireRole([Role.ADMIN, Role.KOORDOA, Role.ANGGOTADOA]);
    if (!authCheck.success) {
        return { success: false, message: authCheck.message };
    }

    const validatedFields = BadanPengurusSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Data yang dimasukkan tidak valid" };
    }

    const { idAnggota, jabatan, masaJabatan, status, prodi, socialMedia } = validatedFields.data;

    try {
        await db.badanPengurus.update({
            where: { id },
            data: {
                idAnggota,
                jabatan: jabatan as Jabatan,
                masaJabatan,
                status,
                prodi: prodi || null,
                socialMedia: socialMedia || null,
            }
        });

        revalidatePath("/admin/badan-pengurus");
        revalidatePath("/admin/users");
        return { success: true, message: "Data badan pengurus berhasil diperbarui" };
    } catch (error) {
        console.error("Error updating badan pengurus:", error);
        const msg = error instanceof Error ? error.message : "Gagal memperbarui badan pengurus";
        return { success: false, message: msg };
    }
}

export async function deleteBadanPengurus(id: string) {
    const authCheck = await requireRole([Role.ADMIN, Role.KOORDOA, Role.ANGGOTADOA]);
    if (!authCheck.success) {
        return { success: false, message: authCheck.message };
    }

    try {
        const ktbCount = await db.kTB.count({
            where: { idPengurus: id }
        });

        if (ktbCount > 0) {
            return {
                success: false,
                message: "Tidak dapat menghapus: Pengurus ini terikat dengan data KTB yang dibina."
            };
        }

        await db.badanPengurus.delete({
            where: { id }
        });

        revalidatePath("/admin/badan-pengurus");
        revalidatePath("/admin/users");
        return { success: true, message: "Data badan pengurus berhasil dihapus" };
    } catch (error) {
        console.error("Error deleting badan pengurus:", error);
        return { success: false, message: "Gagal menghapus data badan pengurus" };
    }
}
