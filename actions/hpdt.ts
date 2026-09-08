"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const HpdtInputSchema = z.object({
    idPengurus: z.string().min(1, "Badan Pengurus wajib dipilih"),
    tanggal: z.date({ message: "Tanggal wajib diisi" }),
    isSate: z.boolean().default(false),
    isDoa: z.boolean().default(false),
    isAttendedKTB: z.boolean().default(false),
    isGereja: z.boolean().default(false),
    ayatAlkitab: z.string().optional().nullable(),
    judulBuku: z.string().optional().nullable(),
});

export type HpdtFormValues = z.infer<typeof HpdtInputSchema>;

// Helper normalize date to midnight UTC/Local
function normalizeToDateOnly(d: Date): Date {
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}

export async function getPengurusOptionsForHPDT() {
    try {
        const bpList = await db.badanPengurus.findMany({
            where: { status: true },
            include: {
                anggota: {
                    select: {
                        id: true,
                        nama: true,
                        prodi: true,
                        angkatan: true,
                    }
                }
            },
            orderBy: { jabatan: "asc" }
        });

        return bpList.map(bp => ({
            value: bp.id,
            label: `${bp.anggota.nama} (${bp.jabatan})`,
            nama: bp.anggota.nama,
            jabatan: bp.jabatan,
            prodi: bp.prodi || bp.anggota.prodi || "",
        }));
    } catch (error) {
        console.error("Error fetching pengurus options for HPDT:", error);
        return [];
    }
}

export async function getHPDTOverview(month: number, year: number) {
    try {
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const now = new Date();
        const isCurrentMonth = now.getFullYear() === year && (now.getMonth() + 1) === month;
        const daysInMonth = new Date(year, month, 0).getDate();
        const elapsedDays = isCurrentMonth ? Math.min(now.getDate(), daysInMonth) : daysInMonth;

        const allPengurus = await db.badanPengurus.findMany({
            where: { status: true },
            include: {
                anggota: {
                    select: {
                        id: true,
                        nama: true,
                        angkatan: true,
                        prodi: true,
                    }
                },
                hpdt: {
                    where: {
                        tanggal: {
                            gte: startDate,
                            lte: endDate,
                        }
                    },
                    orderBy: { tanggal: "asc" }
                }
            },
            orderBy: { jabatan: "asc" }
        });

        const pengurusStats = allPengurus.map(bp => {
            const records = bp.hpdt;
            const totalSate = records.filter(r => r.isSate).length;
            const totalDoa = records.filter(r => r.isDoa).length;
            const totalKtb = records.filter(r => r.isAttendedKTB).length;
            const totalGereja = records.filter(r => r.isGereja).length;

            const satePercentage = elapsedDays > 0 ? Math.round((totalSate / elapsedDays) * 100) : 0;
            const doaPercentage = elapsedDays > 0 ? Math.round((totalDoa / elapsedDays) * 100) : 0;

            return {
                idPengurus: bp.id,
                nama: bp.anggota.nama,
                jabatan: bp.jabatan,
                prodi: bp.prodi || bp.anggota.prodi || "-",
                totalSate,
                totalDoa,
                totalKtb,
                totalGereja,
                satePercentage,
                doaPercentage,
                totalRecordedDays: records.length,
                elapsedDays,
                daysInMonth,
            };
        });

        // Calculate organization-wide metrics
        const totalPengurus = pengurusStats.length;
        const avgSatePercentage = totalPengurus > 0
            ? Math.round(pengurusStats.reduce((acc, curr) => acc + curr.satePercentage, 0) / totalPengurus)
            : 0;

        const avgDoaPercentage = totalPengurus > 0
            ? Math.round(pengurusStats.reduce((acc, curr) => acc + curr.doaPercentage, 0) / totalPengurus)
            : 0;

        return {
            success: true,
            data: {
                month,
                year,
                elapsedDays,
                daysInMonth,
                avgSatePercentage,
                avgDoaPercentage,
                totalPengurus,
                pengurusStats,
            }
        };
    } catch (error) {
        console.error("Error getting HPDT overview:", error);
        return { success: false, message: "Gagal memuat rekapitulasi HPDT" };
    }
}

export async function getHPDTLogs(params?: {
    startDate?: string;
    endDate?: string;
    idPengurus?: string;
}) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause: any = {};

        if (params?.idPengurus) {
            whereClause.idPengurus = params.idPengurus;
        }

        if (params?.startDate || params?.endDate) {
            whereClause.tanggal = {};
            if (params.startDate) {
                whereClause.tanggal.gte = new Date(params.startDate);
            }
            if (params.endDate) {
                const end = new Date(params.endDate);
                end.setHours(23, 59, 59, 999);
                whereClause.tanggal.lte = end;
            }
        }

        const data = await db.hpdt.findMany({
            where: whereClause,
            include: {
                pengurus: {
                    include: {
                        anggota: {
                            select: {
                                id: true,
                                nama: true,
                                prodi: true,
                                angkatan: true,
                            }
                        }
                    }
                }
            },
            orderBy: { tanggal: "desc" },
            take: 100, // Limit to recent 100 entries for fast render
        });

        return { success: true, data };
    } catch (error) {
        console.error("Error getting HPDT logs:", error);
        return { success: false, message: "Gagal mengambil log HPDT" };
    }
}

export async function getHPDTDetailByPengurus(idPengurus: string, month: number, year: number) {
    try {
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const records = await db.hpdt.findMany({
            where: {
                idPengurus,
                tanggal: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            include: {
                pengurus: {
                    include: {
                        anggota: {
                            select: { nama: true }
                        }
                    }
                }
            },
            orderBy: { tanggal: "asc" }
        });

        return { success: true, data: records };
    } catch (error) {
        console.error("Error fetching HPDT detail by pengurus:", error);
        return { success: false, message: "Gagal mengambil catatan jurnal pengurus" };
    }
}

export async function getHPDT(id: string) {
    try {
        const data = await db.hpdt.findUnique({
            where: { id },
            include: {
                pengurus: {
                    include: {
                        anggota: {
                            select: { nama: true, prodi: true, angkatan: true }
                        }
                    }
                }
            }
        });
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching HPDT by id:", error);
        return { success: false, message: "Gagal mengambil data HPDT" };
    }
}

export async function createHPDT(values: HpdtFormValues) {
    const validated = HpdtInputSchema.safeParse(values);
    if (!validated.success) {
        return { success: false, message: "Data tidak valid" };
    }

    const { idPengurus, tanggal, isSate, isDoa, isAttendedKTB, isGereja, ayatAlkitab, judulBuku } = validated.data;

    // Validate future date
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    if (tanggal > todayEnd) {
        return { success: false, message: "Pengisian HPDT tidak boleh untuk tanggal di masa depan." };
    }

    const normalizedDate = normalizeToDateOnly(tanggal);

    try {
        // Check unique constraint manually for friendly message
        const existing = await db.hpdt.findFirst({
            where: {
                idPengurus,
                tanggal: normalizedDate
            }
        });

        if (existing) {
            return {
                success: false,
                message: "Catatan HPDT untuk pengurus ini pada tanggal tersebut sudah pernah dibuat. Silakan gunakan tombol edit."
            };
        }

        await db.hpdt.create({
            data: {
                idPengurus,
                tanggal: normalizedDate,
                isSate,
                isDoa,
                isAttendedKTB,
                isGereja,
                ayatAlkitab: ayatAlkitab?.trim() || null,
                judulBuku: judulBuku?.trim() || null,
            }
        });

        revalidatePath("/admin/hpdt");
        return { success: true, message: "Catatan HPDT berhasil disimpan" };
    } catch (error) {
        console.error("Error creating HPDT:", error);
        const msg = error instanceof Error ? error.message : "Gagal menyimpan data HPDT";
        return { success: false, message: msg };
    }
}

export async function updateHPDT(id: string, values: HpdtFormValues) {
    const validated = HpdtInputSchema.safeParse(values);
    if (!validated.success) {
        return { success: false, message: "Data tidak valid" };
    }

    const { idPengurus, tanggal, isSate, isDoa, isAttendedKTB, isGereja, ayatAlkitab, judulBuku } = validated.data;

    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    if (tanggal > todayEnd) {
        return { success: false, message: "Tanggal tidak boleh di masa depan." };
    }

    const normalizedDate = normalizeToDateOnly(tanggal);

    try {
        // Check if updating to another date that already exists
        const existing = await db.hpdt.findFirst({
            where: {
                idPengurus,
                tanggal: normalizedDate,
                NOT: { id }
            }
        });

        if (existing) {
            return {
                success: false,
                message: "Sudah ada catatan HPDT lain untuk pengurus ini pada tanggal tersebut."
            };
        }

        await db.hpdt.update({
            where: { id },
            data: {
                idPengurus,
                tanggal: normalizedDate,
                isSate,
                isDoa,
                isAttendedKTB,
                isGereja,
                ayatAlkitab: ayatAlkitab?.trim() || null,
                judulBuku: judulBuku?.trim() || null,
            }
        });

        revalidatePath("/admin/hpdt");
        return { success: true, message: "Catatan HPDT berhasil diperbarui" };
    } catch (error) {
        console.error("Error updating HPDT:", error);
        const msg = error instanceof Error ? error.message : "Gagal memperbarui data HPDT";
        return { success: false, message: msg };
    }
}

export async function deleteHPDT(id: string) {
    try {
        await db.hpdt.delete({
            where: { id }
        });

        revalidatePath("/admin/hpdt");
        return { success: true, message: "Catatan HPDT berhasil dihapus" };
    } catch (error) {
        console.error("Error deleting HPDT:", error);
        return { success: false, message: "Gagal menghapus data HPDT" };
    }
}
