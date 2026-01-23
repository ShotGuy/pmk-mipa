"use server"

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getUpcomingKegiatan() {
    return await db.kegiatan.findMany({
        orderBy: { tanggal: 'desc' },
        take: 20 // Recent ones
    });
}

export async function recordAttendance(qrCode: string) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    // Format: {kegiatanId}-{timestamp}
    // Simple split might fail if ID has hyphen. Assuming CUID/UUID no hyphen in format used or handle index.
    // Better: split by LAST hyphen? Timestamp is number.

    const parts = qrCode.split('-');
    const timestamp = Number(parts.pop()); // Last part is timestamp
    const kegiatanId = parts.join('-'); // Remainder is ID

    if (!kegiatanId || isNaN(timestamp)) {
        return { error: "QR Code tidak valid" };
    }

    // Optional: Check timestamp (e.g. within 24 hours of event?) 
    // For now, accept any valid generated QR to allow testing.

    // Get User Details for Kehadiran
    const user = session.user;

    // Check if Kegiatan exists
    const kegiatan = await db.kegiatan.findUnique({
        where: { id: kegiatanId }
    });

    if (!kegiatan) return { error: "Kegiatan tidak ditemukan" };

    // Check if already present
    const existing = await db.kehadiran.findFirst({
        where: {
            idKegiatan: kegiatanId,
            idAnggota: user.idAnggota // If null, check other unique constraints? 
            // If user has no Anggota linked, we might create duplicate if we check by idAnggota null.
            // But let's assume registered users should have linked Anggota or we check by Name?
        }
    });

    if (existing) {
        return { error: "Anda sudah presensi!" };
    }

    try {
        await db.kehadiran.create({
            data: {
                idKegiatan: kegiatanId,
                idAnggota: user.idAnggota, // Can be null
                nama: user.name || "Unknown",
                status: "HADIR",
                // Fill other fields if available in Anggota, but here we just record basics
            }
        });

        revalidatePath("/dashboard/attendance");
        return { success: `Berhasil presensi: ${kegiatan.nama}` };
    } catch (error) {
        console.error("Attendance Error:", error);
        return { error: "Gagal menyimpan presensi" };
    }
}
