"use server"

import { db } from "@/lib/db";
// import { Anggota } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AnggotaSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    jenisKelamin: z.string().min(1, "Pilih jenis kelamin"),
    tanggalLahir: z.date().optional().nullable(),
    noHp: z.string().optional().nullable(),
    prodi: z.string().optional().nullable(),
    angkatan: z.coerce.number().optional().nullable(),
    idKTB: z.string().optional().nullable()
});

export const getAnggota = async (id: string) => {
    try {
        const anggota = await db.anggota.findUnique({
            where: { id },
            include: {
                anggotaKTB: {
                    where: { isAktif: true },
                    include: {
                        ktb: {
                            select: {
                                id: true,
                                nama: true,
                                angkatan: true,
                                pemimpin: { select: { nama: true } }
                            }
                        }
                    }
                }
            }
        });
        if (!anggota) return { success: false, message: "Anggota tidak ditemukan" };

        const activeKTB = anggota.anggotaKTB?.[0]?.ktb?.id || null;

        return {
            success: true,
            data: {
                ...anggota,
                idKTB: activeKTB,
            }
        };
    } catch {
        return { success: false, message: "Gagal mengambil data anggota" };
    }
};

export const getAllAnggota = async () => {
    try {
        const anggota = await db.anggota.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                anggotaKTB: {
                    where: { isAktif: true },
                    include: {
                        ktb: {
                            select: {
                                id: true,
                                nama: true,
                                angkatan: true,
                                pemimpin: { select: { nama: true } }
                            }
                        }
                    }
                }
            }
        });
        return { success: true, data: anggota };
    } catch {
        return { success: false, message: "Gagal mengambil data anggota" };
    }
};

export const getKTBOptions = async () => {
    try {
        const ktbList = await db.kTB.findMany({
            include: {
                pemimpin: {
                    select: { nama: true }
                }
            },
            orderBy: { angkatan: 'desc' }
        });

        // Format: [Nama KTB] - [Nama Pemimpin] ([Angkatan])
        const options = ktbList.map(ktb => ({
            label: `${ktb.nama} - ${ktb.pemimpin.nama} (${ktb.angkatan})`,
            value: ktb.id
        }));

        return options;
    } catch {
        return [];
    }
};

export const createAnggota = async (values: z.infer<typeof AnggotaSchema>) => {
    const validatedFields = AnggotaSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Input tidak valid" };
    }

    try {
        const { idKTB, ...data } = validatedFields.data;
        await db.anggota.create({
            data: {
                ...data,
                tanggalLahir: data.tanggalLahir ?? null,
                noHp: data.noHp || null,
                prodi: data.prodi || null,
                angkatan: data.angkatan || null,
                ...(idKTB ? {
                    anggotaKTB: {
                        create: {
                            idKTB,
                            isAktif: true,
                        }
                    }
                } : {})
            }
        });

        revalidatePath("/admin/anggota");
        revalidatePath("/admin/ktb");
        return { success: true, message: "Anggota berhasil ditambahkan" };
    } catch (error) {
        console.error("Error creating anggota:", error);
        return { success: false, message: "Gagal menambahkan anggota" };
    }
};

export const updateAnggota = async (id: string, values: z.infer<typeof AnggotaSchema>) => {
    const validatedFields = AnggotaSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Input tidak valid" };
    }

    try {
        const { idKTB, ...data } = validatedFields.data;

        await db.anggota.update({
            where: { id },
            data: {
                ...data,
                tanggalLahir: data.tanggalLahir ?? null,
                noHp: data.noHp || null,
                prodi: data.prodi || null,
                angkatan: data.angkatan || null,
            }
        });

        if (idKTB) {
            const existing = await db.kTBAnggota.findUnique({
                where: {
                    idKTB_idAnggota: {
                        idKTB,
                        idAnggota: id,
                    }
                }
            });

            await db.kTBAnggota.updateMany({
                where: {
                    idAnggota: id,
                    idKTB: { not: idKTB },
                    isAktif: true,
                },
                data: { isAktif: false }
            });

            if (existing) {
                await db.kTBAnggota.update({
                    where: { id: existing.id },
                    data: { isAktif: true }
                });
            } else {
                await db.kTBAnggota.create({
                    data: {
                        idKTB,
                        idAnggota: id,
                        isAktif: true,
                    }
                });
            }
        } else {
            await db.kTBAnggota.updateMany({
                where: {
                    idAnggota: id,
                    isAktif: true,
                },
                data: { isAktif: false }
            });
        }

        revalidatePath("/admin/anggota");
        revalidatePath("/admin/ktb");
        return { success: true, message: "Anggota berhasil diperbarui" };
    } catch (error) {
        console.error("Error updating anggota:", error);
        return { success: false, message: "Gagal memperbarui anggota" };
    }
};

export const deleteAnggota = async (id: string) => {
    try {
        await db.anggota.delete({
            where: { id }
        });

        revalidatePath("/admin/anggota");
        return { success: true, message: "Anggota berhasil dihapus" };
    } catch {
        return { success: false, message: "Gagal menghapus anggota (Mungkin data terkait user/pengurus)" };
    }
};
// ... existing code ...

export const getAnggotaFilterOptions = async () => {
    try {
        // Fetch specific unique values for filters
        const prodiList = await db.anggota.findMany({
            distinct: ['prodi'],
            select: { prodi: true },
            where: { prodi: { not: null } },
            orderBy: { prodi: 'asc' }
        });

        return {
            prodi: prodiList.map(p => p.prodi).filter(Boolean) as string[],
        };
    } catch (error) {
        console.error("Error fetching filter options:", error);
        return { prodi: [] };
    }
};
