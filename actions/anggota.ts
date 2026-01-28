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
                ktb: {
                    include: {
                        pemimpin: { select: { nama: true } }
                    }
                }
            }
        });
        return { success: true, data: anggota };
    } catch {
        return { success: false, message: "Gagal mengambil data anggota" };
    }
};

export const getAllAnggota = async () => {
    try {
        const anggota = await db.anggota.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                ktb: {
                    include: {
                        pemimpin: { select: { nama: true } }
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

        // Format as requested: [Nama Pemimpin] - [Angkatan]
        const options = ktbList.map(ktb => ({
            label: `${ktb.pemimpin.nama} - ${ktb.angkatan}`,
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
        await db.anggota.create({
            data: {
                ...validatedFields.data,
                tanggalLahir: validatedFields.data.tanggalLahir ?? null,
                noHp: validatedFields.data.noHp || null,
                prodi: validatedFields.data.prodi || null,
                angkatan: validatedFields.data.angkatan || null,
                idKTB: validatedFields.data.idKTB || null, // Ensure empty string becomes null
            }
        });

        revalidatePath("/admin/anggota");
        return { success: true, message: "Anggota berhasil ditambahkan" };
    } catch (error) {
        console.error("Error creating anggota:", error); // Log the actual error
        return { success: false, message: "Gagal menambahkan anggota" };
    }
};

export const updateAnggota = async (id: string, values: z.infer<typeof AnggotaSchema>) => {
    const validatedFields = AnggotaSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Input tidak valid" };
    }

    try {
        await db.anggota.update({
            where: { id },
            data: {
                ...validatedFields.data,
                tanggalLahir: validatedFields.data.tanggalLahir ?? null,
                noHp: validatedFields.data.noHp || null,
                prodi: validatedFields.data.prodi || null,
                angkatan: validatedFields.data.angkatan || null,
                idKTB: validatedFields.data.idKTB || null,
            }
        });

        revalidatePath("/admin/anggota");
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
