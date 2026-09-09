"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { parseIndonesianTTL } from "@/lib/date-parser";
import { auth } from "@/auth";

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
    const session = await auth();
    const role = session?.user?.role;
    if (["KETUA", "BENDAHARA", "KOORACARA", "ANGGOTAACARA"].includes(role || "")) {
        return { success: false, message: "Akses ditolak: role Anda hanya memiliki izin membaca (read-only) pada data anggota." };
    }

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
    const session = await auth();
    const role = session?.user?.role;
    if (["KETUA", "BENDAHARA", "KOORACARA", "ANGGOTAACARA"].includes(role || "")) {
        return { success: false, message: "Akses ditolak: role Anda hanya memiliki izin membaca (read-only) pada data anggota." };
    }

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
    const session = await auth();
    const role = session?.user?.role;
    if (["KETUA", "BENDAHARA", "KOORACARA", "ANGGOTAACARA"].includes(role || "")) {
        return { success: false, message: "Akses ditolak: role Anda hanya memiliki izin membaca (read-only) pada data anggota." };
    }

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

export interface RawAnggotaRow {
    nama: string;
    jenisKelamin?: string | null;
    prodi?: string | null;
    angkatan?: number | string | null;
    noHp?: string | null;
    tanggalLahir?: string | Date | null;
}

export interface ImportAnggotaOptions {
    skipDuplicates?: boolean;
}

export interface ImportAnggotaResult {
    success: boolean;
    message: string;
    totalProcessed: number;
    insertedCount: number;
    skippedCount: number;
    duplicateCount: number;
    errors?: string[];
}

export async function importAnggotaBulk(
    rows: RawAnggotaRow[],
    options: ImportAnggotaOptions = { skipDuplicates: true }
): Promise<ImportAnggotaResult> {
    try {
        const session = await auth();
        const role = session?.user?.role;
        if (["KETUA", "BENDAHARA", "KOORACARA", "ANGGOTAACARA"].includes(role || "")) {
            return {
                success: false,
                message: "Akses ditolak: role Anda hanya memiliki izin membaca (read-only) pada data anggota.",
                totalProcessed: 0,
                insertedCount: 0,
                skippedCount: 0,
                duplicateCount: 0,
            };
        }

        if (!rows || rows.length === 0) {
            return {
                success: false,
                message: "Tidak ada data yang diproses.",
                totalProcessed: 0,
                insertedCount: 0,
                skippedCount: 0,
                duplicateCount: 0,
            };
        }

        // Ambil data anggota eksisting untuk proteksi duplikasi jika opsi skipDuplicates aktif
        let existingKeySet = new Set<string>();
        if (options.skipDuplicates) {
            const existingAnggota = await db.anggota.findMany({
                select: { nama: true, angkatan: true },
            });
            existingKeySet = new Set(
                existingAnggota.map(
                    (a) => `${a.nama.trim().toLowerCase()}_${a.angkatan ?? 0}`
                )
            );
        }

        const seenInFileKeySet = new Set<string>();
        const validRowsToInsert: Array<{
            nama: string;
            jenisKelamin: string;
            prodi: string | null;
            angkatan: number | null;
            noHp: string | null;
            tanggalLahir: Date | null;
        }> = [];

        let skippedCount = 0;
        let duplicateCount = 0;

        for (const row of rows) {
            // 1. Validasi Nama
            const rawNama = row.nama ? String(row.nama).trim() : "";
            if (!rawNama) {
                skippedCount++;
                continue;
            }

            // 2. Normalisasi Jenis Kelamin (L/P)
            let jk = "L";
            if (row.jenisKelamin) {
                const strJk = String(row.jenisKelamin).trim().toUpperCase();
                if (strJk.startsWith("P") || strJk.startsWith("W")) {
                    jk = "P";
                } else if (strJk.startsWith("L")) {
                    jk = "L";
                }
            }

            // 3. Normalisasi Prodi
            const prodi = row.prodi ? String(row.prodi).trim() : null;

            // 4. Normalisasi Angkatan
            let angkatan: number | null = null;
            if (row.angkatan !== undefined && row.angkatan !== null && row.angkatan !== "") {
                if (typeof row.angkatan === "number" && !isNaN(row.angkatan)) {
                    angkatan = Math.round(row.angkatan);
                } else {
                    const digits = String(row.angkatan).replace(/\D/g, "");
                    if (digits) {
                        const parsedNum = parseInt(digits, 10);
                        if (parsedNum >= 1990 && parsedNum <= 2050) {
                            angkatan = parsedNum;
                        } else if (parsedNum < 100) {
                            angkatan = 2000 + parsedNum;
                        }
                    }
                }
            }

            // 5. Normalisasi No HP
            const noHp = row.noHp ? String(row.noHp).trim() : null;

            // 6. Normalisasi Tanggal Lahir / TTL (Opsional)
            const parsedTTL = parseIndonesianTTL(row.tanggalLahir);
            const tanggalLahir: Date | null = parsedTTL.date;

            // 7. Cek Duplikasi (Database & Dalam File yang Sama)
            const deduplicationKey = `${rawNama.toLowerCase()}_${angkatan ?? 0}`;
            if (options.skipDuplicates) {
                if (existingKeySet.has(deduplicationKey) || seenInFileKeySet.has(deduplicationKey)) {
                    duplicateCount++;
                    continue;
                }
            }

            seenInFileKeySet.add(deduplicationKey);
            validRowsToInsert.push({
                nama: rawNama,
                jenisKelamin: jk,
                prodi: prodi || null,
                angkatan,
                noHp: noHp || null,
                tanggalLahir,
            });
        }

        // 8. Batch Insert menggunakan createMany (Chunk per 500 baris)
        const CHUNK_SIZE = 500;
        let insertedCount = 0;

        for (let i = 0; i < validRowsToInsert.length; i += CHUNK_SIZE) {
            const chunk = validRowsToInsert.slice(i, i + CHUNK_SIZE);
            const result = await db.anggota.createMany({
                data: chunk,
                skipDuplicates: true,
            });
            insertedCount += result.count;
        }

        revalidatePath("/admin/anggota");
        revalidatePath("/admin/dashboard");

        return {
            success: true,
            message: `Berhasil mengimpor ${insertedCount} data anggota baru.`,
            totalProcessed: rows.length,
            insertedCount,
            skippedCount,
            duplicateCount,
        };
    } catch (error) {
        console.error("Error importAnggotaBulk:", error);
        return {
            success: false,
            message: "Gagal memproses import data anggota ke database.",
            totalProcessed: rows.length,
            insertedCount: 0,
            skippedCount: 0,
            duplicateCount: 0,
            errors: [error instanceof Error ? error.message : "Terjadi kesalahan server"],
        };
    }
}

