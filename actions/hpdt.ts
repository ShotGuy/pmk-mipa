"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";

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
        const session = await auth();
        const role = session?.user?.role;
        const idAnggota = session?.user?.idAnggota;

        // Jika bukan ADMIN (yaitu KETUA, BENDAHARA, SEKRETARIS, KOORKTB, ANGGOTAKTB), hanya boleh mengisi HPDT untuk diri sendiri
        if (role !== "ADMIN" && idAnggota) {
            const bp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
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
            });

            if (!bp) return [];

            return [{
                value: bp.id,
                label: `${bp.anggota?.nama || "Saya"} (${bp.jabatan})`,
                nama: bp.anggota?.nama || "Saya",
                jabatan: bp.jabatan,
                prodi: bp.prodi || bp.anggota?.prodi || "",
            }];
        }

        const bpList = await db.badanPengurus.findMany({
            where: { status: true },
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
            orderBy: { jabatan: "asc" },
        });

        return bpList.map((bp) => ({
            value: bp.id,
            label: `${bp.anggota?.nama || "Pengurus"} (${bp.jabatan})`,
            nama: bp.anggota?.nama || "Pengurus",
            jabatan: bp.jabatan,
            prodi: bp.prodi || bp.anggota?.prodi || "",
        }));
    } catch (error) {
        console.error("Error fetching pengurus options for HPDT:", error);
        return [];
    }
}

export async function getHPDTOverview(month: number, year: number) {
    try {
        const session = await auth();
        const role = session?.user?.role;
        const idAnggota = session?.user?.idAnggota;

        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const now = new Date();
        const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
        const daysInMonth = new Date(year, month, 0).getDate();
        const elapsedDays = isCurrentMonth ? Math.min(now.getDate(), daysInMonth) : daysInMonth;

        // Scoping per role:
        // ANGGOTAKTB: hanya dirinya sendiri
        // KOORKTB: dirinya sendiri dan anggota seksi KTB
        // BENDAHARA: dirinya sendiri dan Seksi Doa & Pemerhati
        // SEKRETARIS: dirinya sendiri dan Seksi Acara
        // KETUA / ADMIN: seluruh badan pengurus
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let bpWhere: any = { status: true };
        if (role === "ANGGOTAKTB" && idAnggota) {
            bpWhere = { idAnggota, status: true };
        } else if (role === "ANGGOTAACARA" && idAnggota) {
            bpWhere = { idAnggota, status: true };
        } else if (role === "KOORACARA") {
            bpWhere = {
                status: true,
                jabatan: { in: ["KOORDINATOR_ACARA", "ANGGOTA_ACARA"] },
            };
        } else if (role === "KOORKTB") {
            bpWhere = {
                status: true,
                jabatan: { in: ["KOORDINATOR_KTB", "ANGGOTA_KTB"] },
            };
        } else if (role === "BENDAHARA" && idAnggota) {
            bpWhere = {
                status: true,
                OR: [
                    { idAnggota },
                    { jabatan: { in: ["KOORDINATOR_DOA_DAN_PEMERHATI", "ANGGOTA_DOA_DAN_PEMERHATI"] } },
                ],
            };
        } else if (role === "SEKRETARIS" && idAnggota) {
            bpWhere = {
                status: true,
                OR: [
                    { idAnggota },
                    { jabatan: { in: ["KOORDINATOR_ACARA", "ANGGOTA_ACARA"] } },
                ],
            };
        } else if (role === "ANGGOTADOA" && idAnggota) {
            bpWhere = { idAnggota, status: true };
        } else if (role === "KOORDOA") {
            bpWhere = {
                status: true,
                jabatan: { in: ["KOORDINATOR_DOA_DAN_PEMERHATI", "ANGGOTA_DOA_DAN_PEMERHATI"] },
            };
        }

        const allPengurus = await db.badanPengurus.findMany({
            where: bpWhere,
            include: {
                anggota: {
                    select: {
                        id: true,
                        nama: true,
                        angkatan: true,
                        prodi: true,
                    },
                },
                hpdt: {
                    where: {
                        tanggal: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    orderBy: { tanggal: "asc" },
                },
            },
            orderBy: { jabatan: "asc" },
        });

        const pengurusStats = allPengurus.map((bp) => {
            const records = bp.hpdt;
            const totalSate = records.filter((r) => r.isSate).length;
            const totalDoa = records.filter((r) => r.isDoa).length;
            const totalKtb = records.filter((r) => r.isAttendedKTB).length;
            const totalGereja = records.filter((r) => r.isGereja).length;

            const satePercentage = elapsedDays > 0 ? Math.round((totalSate / elapsedDays) * 100) : 0;
            const doaPercentage = elapsedDays > 0 ? Math.round((totalDoa / elapsedDays) * 100) : 0;

            return {
                idPengurus: bp.id,
                nama: bp.anggota?.nama || "Pengurus",
                jabatan: bp.jabatan,
                prodi: bp.prodi || bp.anggota?.prodi || "-",
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

        // Calculate organization-wide / team-wide metrics
        const totalPengurus = pengurusStats.length;
        const avgSatePercentage =
            totalPengurus > 0
                ? Math.round(pengurusStats.reduce((acc, curr) => acc + curr.satePercentage, 0) / totalPengurus)
                : 0;

        const avgDoaPercentage =
            totalPengurus > 0
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
            },
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
        const session = await auth();
        const role = session?.user?.role;
        const idAnggota = session?.user?.idAnggota;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause: any = {};

        if ((role === "ANGGOTAKTB" || role === "ANGGOTAACARA" || role === "ANGGOTADOA") && idAnggota) {
            const myBp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            });
            if (myBp) {
                whereClause.idPengurus = myBp.id;
            } else {
                return { success: true, data: [] };
            }
        } else if (role === "KOORDOA") {
            const teamBps = await db.badanPengurus.findMany({
                where: {
                    status: true,
                    jabatan: { in: ["KOORDINATOR_DOA_DAN_PEMERHATI", "ANGGOTA_DOA_DAN_PEMERHATI"] },
                },
                select: { id: true },
            });
            const teamIds = teamBps.map((b) => b.id);
            if (params?.idPengurus && params.idPengurus !== "all" && teamIds.includes(params.idPengurus)) {
                whereClause.idPengurus = params.idPengurus;
            } else {
                whereClause.idPengurus = { in: teamIds };
            }
        } else if (role === "KOORACARA") {
            const teamBps = await db.badanPengurus.findMany({
                where: {
                    status: true,
                    jabatan: { in: ["KOORDINATOR_ACARA", "ANGGOTA_ACARA"] },
                },
                select: { id: true },
            });
            const teamIds = teamBps.map((b) => b.id);
            if (params?.idPengurus && params.idPengurus !== "all" && teamIds.includes(params.idPengurus)) {
                whereClause.idPengurus = params.idPengurus;
            } else {
                whereClause.idPengurus = { in: teamIds };
            }
        } else if (role === "KOORKTB") {
            const teamBps = await db.badanPengurus.findMany({
                where: {
                    status: true,
                    jabatan: { in: ["KOORDINATOR_KTB", "ANGGOTA_KTB"] },
                },
                select: { id: true },
            });
            const teamIds = teamBps.map((b) => b.id);
            if (params?.idPengurus && params.idPengurus !== "all" && teamIds.includes(params.idPengurus)) {
                whereClause.idPengurus = params.idPengurus;
            } else {
                whereClause.idPengurus = { in: teamIds };
            }
        } else if (role === "BENDAHARA" && idAnggota) {
            const teamBps = await db.badanPengurus.findMany({
                where: {
                    status: true,
                    OR: [
                        { idAnggota },
                        { jabatan: { in: ["KOORDINATOR_DOA_DAN_PEMERHATI", "ANGGOTA_DOA_DAN_PEMERHATI"] } },
                    ],
                },
                select: { id: true },
            });
            const teamIds = teamBps.map((b) => b.id);
            if (params?.idPengurus && params.idPengurus !== "all" && teamIds.includes(params.idPengurus)) {
                whereClause.idPengurus = params.idPengurus;
            } else {
                whereClause.idPengurus = { in: teamIds };
            }
        } else if (role === "SEKRETARIS" && idAnggota) {
            const teamBps = await db.badanPengurus.findMany({
                where: {
                    status: true,
                    OR: [
                        { idAnggota },
                        { jabatan: { in: ["KOORDINATOR_ACARA", "ANGGOTA_ACARA"] } },
                    ],
                },
                select: { id: true },
            });
            const teamIds = teamBps.map((b) => b.id);
            if (params?.idPengurus && params.idPengurus !== "all" && teamIds.includes(params.idPengurus)) {
                whereClause.idPengurus = params.idPengurus;
            } else {
                whereClause.idPengurus = { in: teamIds };
            }
        } else {
            if (params?.idPengurus && params.idPengurus !== "all") {
                whereClause.idPengurus = params.idPengurus;
            }
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
                            },
                        },
                    },
                },
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
        const session = await auth();
        const role = session?.user?.role;
        const idAnggota = session?.user?.idAnggota;

        // Validasi akses detail jurnal
        if ((role === "ANGGOTAKTB" || role === "ANGGOTAACARA" || role === "ANGGOTADOA") && idAnggota) {
            const myBp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            });
            if (!myBp || myBp.id !== idPengurus) {
                return { success: false, message: "Akses ditolak. Anda hanya dapat melihat jurnal HPDT Anda sendiri." };
            }
        } else if (role === "KOORDOA") {
            const targetBp = await db.badanPengurus.findUnique({
                where: { id: idPengurus },
                select: { jabatan: true },
            });
            if (!targetBp || (targetBp.jabatan !== "KOORDINATOR_DOA_DAN_PEMERHATI" && targetBp.jabatan !== "ANGGOTA_DOA_DAN_PEMERHATI")) {
                return { success: false, message: "Akses ditolak. Koordinator Doa hanya dapat memantau jurnal seksi Doa & Pemerhati." };
            }
        } else if (role === "KOORACARA") {
            const targetBp = await db.badanPengurus.findUnique({
                where: { id: idPengurus },
                select: { jabatan: true },
            });
            if (!targetBp || (targetBp.jabatan !== "KOORDINATOR_ACARA" && targetBp.jabatan !== "ANGGOTA_ACARA")) {
                return { success: false, message: "Akses ditolak. Koordinator Acara hanya dapat memantau jurnal seksi Acara." };
            }
        } else if (role === "KOORKTB") {
            const targetBp = await db.badanPengurus.findUnique({
                where: { id: idPengurus },
                select: { jabatan: true },
            });
            if (!targetBp || (targetBp.jabatan !== "KOORDINATOR_KTB" && targetBp.jabatan !== "ANGGOTA_KTB")) {
                return { success: false, message: "Akses ditolak. Koordinator KTB hanya dapat memantau jurnal seksi KTB." };
            }
        } else if (role === "BENDAHARA" && idAnggota) {
            const myBp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            });
            const targetBp = await db.badanPengurus.findUnique({
                where: { id: idPengurus },
                select: { jabatan: true },
            });
            const isOwn = myBp && myBp.id === idPengurus;
            const isSeksiDoa = targetBp && (targetBp.jabatan === "KOORDINATOR_DOA_DAN_PEMERHATI" || targetBp.jabatan === "ANGGOTA_DOA_DAN_PEMERHATI");
            if (!isOwn && !isSeksiDoa) {
                return { success: false, message: "Akses ditolak. Bendahara hanya dapat memantau jurnal sendiri dan Seksi Doa & Pemerhati." };
            }
        } else if (role === "SEKRETARIS" && idAnggota) {
            const myBp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            });
            const targetBp = await db.badanPengurus.findUnique({
                where: { id: idPengurus },
                select: { jabatan: true },
            });
            const isOwn = myBp && myBp.id === idPengurus;
            const isSeksiAcara = targetBp && (targetBp.jabatan === "KOORDINATOR_ACARA" || targetBp.jabatan === "ANGGOTA_ACARA");
            if (!isOwn && !isSeksiAcara) {
                return { success: false, message: "Akses ditolak. Sekretaris hanya dapat memantau jurnal sendiri dan Seksi Acara." };
            }
        }

        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const records = await db.hpdt.findMany({
            where: {
                idPengurus,
                tanggal: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                pengurus: {
                    include: {
                        anggota: {
                            select: { nama: true },
                        },
                    },
                },
            },
            orderBy: { tanggal: "asc" },
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
                            select: { nama: true, prodi: true, angkatan: true },
                        },
                    },
                },
            },
        });
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching HPDT by id:", error);
        return { success: false, message: "Gagal mengambil data HPDT" };
    }
}

export async function createHPDT(values: HpdtFormValues) {
    const session = await auth();
    const role = session?.user?.role;
    const idAnggota = session?.user?.idAnggota;

    const validated = HpdtInputSchema.safeParse(values);
    if (!validated.success) {
        return { success: false, message: "Data tidak valid" };
    }

    let { idPengurus } = validated.data;
    const { tanggal, isSate, isDoa, isAttendedKTB, isGereja, ayatAlkitab, judulBuku } = validated.data;

    // Untuk seluruh role non-ADMIN (KETUA, BENDAHARA, SEKRETARIS, KOORKTB, ANGGOTAKTB), paksa idPengurus adalah ID pengurus pengguna itu sendiri
    if (role !== "ADMIN" && idAnggota) {
        const myBp = await db.badanPengurus.findFirst({
            where: { idAnggota, status: true },
            select: { id: true },
        });
        if (!myBp) {
            return { success: false, message: "Profil Badan Pengurus Anda tidak aktif atau tidak ditemukan." };
        }
        idPengurus = myBp.id;
    }

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
                tanggal: normalizedDate,
            },
        });

        if (existing) {
            return {
                success: false,
                message: "Catatan HPDT untuk pengurus ini pada tanggal tersebut sudah pernah dibuat. Silakan gunakan tombol edit.",
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
            },
        });

        revalidatePath("/admin/hpdt");
        revalidatePath("/admin/dashboard");
        return { success: true, message: "Catatan HPDT berhasil disimpan" };
    } catch (error) {
        console.error("Error creating HPDT:", error);
        const msg = error instanceof Error ? error.message : "Gagal menyimpan data HPDT";
        return { success: false, message: msg };
    }
}

export async function updateHPDT(id: string, values: HpdtFormValues) {
    const session = await auth();
    const role = session?.user?.role;
    const idAnggota = session?.user?.idAnggota;

    const validated = HpdtInputSchema.safeParse(values);
    if (!validated.success) {
        return { success: false, message: "Data tidak valid" };
    }

    let { idPengurus } = validated.data;
    const { tanggal, isSate, isDoa, isAttendedKTB, isGereja, ayatAlkitab, judulBuku } = validated.data;

    // Cek kepemilikan untuk seluruh role non-ADMIN (hanya boleh mengedit milik sendiri)
    if (role !== "ADMIN" && idAnggota) {
        const myBp = await db.badanPengurus.findFirst({
            where: { idAnggota, status: true },
            select: { id: true },
        });
        const existing = await db.hpdt.findUnique({
            where: { id },
            select: { idPengurus: true },
        });
        if (!myBp || existing?.idPengurus !== myBp.id) {
            return { success: false, message: "Anda hanya dapat memperbarui catatan HPDT milik Anda sendiri." };
        }
        idPengurus = myBp.id;
    }

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
                NOT: { id },
            },
        });

        if (existing) {
            return {
                success: false,
                message: "Sudah ada catatan HPDT lain untuk pengurus ini pada tanggal tersebut.",
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
            },
        });

        revalidatePath("/admin/hpdt");
        revalidatePath("/admin/dashboard");
        return { success: true, message: "Catatan HPDT berhasil diperbarui" };
    } catch (error) {
        console.error("Error updating HPDT:", error);
        const msg = error instanceof Error ? error.message : "Gagal memperbarui data HPDT";
        return { success: false, message: msg };
    }
}

export async function deleteHPDT(id: string) {
    try {
        const session = await auth();
        const role = session?.user?.role;
        const idAnggota = session?.user?.idAnggota;

        // Cek kepemilikan untuk seluruh role non-ADMIN
        if (role !== "ADMIN" && idAnggota) {
            const myBp = await db.badanPengurus.findFirst({
                where: { idAnggota, status: true },
                select: { id: true },
            });
            const existing = await db.hpdt.findUnique({
                where: { id },
                select: { idPengurus: true },
            });
            if (!myBp || existing?.idPengurus !== myBp.id) {
                return { success: false, message: "Anda hanya dapat menghapus catatan HPDT milik Anda sendiri." };
            }
        }

        await db.hpdt.delete({
            where: { id },
        });

        revalidatePath("/admin/hpdt");
        revalidatePath("/admin/dashboard");
        return { success: true, message: "Catatan HPDT berhasil dihapus" };
    } catch (error) {
        console.error("Error deleting HPDT:", error);
        return { success: false, message: "Gagal menghapus data HPDT" };
    }
}

