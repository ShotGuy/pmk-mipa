"use server";

import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { z } from "zod";

export interface UpcomingEventItem {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    speaker?: string | null;
    description: string;
    type: "friday" | "tuesday" | "special";
    badgeText: string;
}

export interface GalleryHighlightItem {
    id: string;
    title: string;
    category: string;
    image: string;
    description: string;
}

const DEFAULT_UPCOMING_EVENTS: UpcomingEventItem[] = [
    // {
    //     id: "default-friday-service",
    //     title: "Ibadah Raya Persekutuan Jumat",
    //     date: "Setiap Jumat",
    //     time: "11.30 - 13.00 WIB",
    //     location: "Ruang Multimedia FMIPA",
    //     speaker: "Hamba Tuhan / Dosen Tamu",
    //     description: "Ibadah persekutuan mingguan mahasiswa FMIPA. Terbuka bagi seluruh angkatan untuk memuji, menyembah, dan dikuatkan dalam firman.",
    //     type: "friday",
    //     badgeText: "Ibadah Mingguan",
    // },
    // {
    //     id: "default-tuesday-prayer",
    //     title: "Persekutuan Doa Syafaat",
    //     date: "Setiap Selasa",
    //     time: "16.00 - 17.30 WIB",
    //     location: "Sekretariat PMK MIPA",
    //     speaker: "Sie Doa & Pengurus",
    //     description: "Waktu sehati berdoa bagi perkuliahan, bangsa, pergumulan pribadi, dan pelayanan di lingkungan Fakultas MIPA.",
    //     type: "tuesday",
    //     badgeText: "Doa Syafaat",
    // },
    // {
    //     id: "default-welcoming-maba",
    //     title: "Welcoming Gathering Mahasiswa Baru",
    //     date: "Agenda Mendatang",
    //     time: "10.00 - Selesai",
    //     location: "Aula FMIPA",
    //     speaker: "Badan Pengurus Harian & Alumni",
    //     description: "Temu ramah, pengenalan keluarga PMK MIPA, tips adaptasi perkuliahan sains, dan kebersamaan lintas angkatan.",
    //     type: "special",
    //     badgeText: "Acara Khusus",
    // },
];

const DEFAULT_GALLERY_HIGHLIGHTS: GalleryHighlightItem[] = [
    {
        id: "gal-1",
        title: "Kamp Regenerasi 2024",
        category: "Regenerasi",
        image: "/images/regenerasi-2024.jpg",
        description: " ",
    },
    {
        id: "gal-2",
        title: "Persekutuan Doa",
        category: "Persekutuan Doa",
        image: "/images/persekutuan-doa-bp.jpg",
        description: " ",
    },
    {
        id: "gal-3",
        title: "The End of Me",
        category: "Regenerasi",
        image: "/images/bp-2024.jpg",
        description: " ",
    },
    {
        id: "gal-4",
        title: "Visitasi Badan Pengurus",
        category: "Visitasi",
        image: "/images/visitasi-bp.jpg",
        description: " ",
    },
];

export async function getUpcomingEventsForHome(): Promise<UpcomingEventItem[]> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const events = await db.kegiatan.findMany({
            where: {
                tanggal: {
                    gte: today,
                },
            },
            include: {
                jenisKegiatan: true,
            },
            orderBy: {
                tanggal: "asc",
            },
            take: 3,
        });

        if (!events || events.length === 0) {
            return DEFAULT_UPCOMING_EVENTS;
        }

        return events.map((event) => {
            const dateFormatted = new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(new Date(event.tanggal));

            const isFriday = new Date(event.tanggal).getDay() === 5;
            const isTuesday = new Date(event.tanggal).getDay() === 2;

            return {
                id: event.id,
                title: event.nama,
                date: dateFormatted,
                time: event.waktu
                    ? new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(new Date(event.waktu)) + " WIB"
                    : "Waktu menyusul",
                location: event.lokasi || "FMIPA Undana",
                speaker: event.pembicara || null,
                description:
                    event.pembicara
                        ? `Dilayani oleh ${event.pembicara}. Mari hadir dan bersekutu bersama.`
                        : "Mari hadir dan bersekutu bersama di dalam hadirat Tuhan.",
                type: isFriday ? "friday" : isTuesday ? "tuesday" : "special",
                badgeText: event.jenisKegiatan?.nama || "Kegiatan",
            };
        });
    } catch (error) {
        console.warn("Could not query kegiatan from DB, using fallback data:", error);
        return DEFAULT_UPCOMING_EVENTS;
    }
}

export async function getGalleryHighlightsForHome(): Promise<GalleryHighlightItem[]> {
    try {
        const galleries = await db.gallery.findMany({
            where: {
                isPublish: true,
            },
            include: {
                kegiatan: {
                    include: {
                        jenisKegiatan: true,
                    },
                },
            },
            take: 4,
        });

        if (!galleries || galleries.length === 0) {
            return DEFAULT_GALLERY_HIGHLIGHTS;
        }

        return galleries.map((g, idx) => ({
            id: g.id,
            title: g.kegiatan?.nama || `Momen PMK MIPA #${idx + 1}`,
            category: g.kegiatan?.jenisKegiatan?.nama || "Dokumentasi",
            image: g.photos || "/images/hero-bg.jpg",
            description: g.kegiatan?.lokasi ? `Lokasi: ${g.kegiatan.lokasi}` : "Dokumentasi pelayanan PMK MIPA.",
        }));
    } catch (error) {
        console.warn("Could not query gallery from DB, using fallback data:", error);
        return DEFAULT_GALLERY_HIGHLIGHTS;
    }
}


const ContactMessageSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
    major: z.string().min(2, "Jurusan minimal 2 karakter").max(100, "Jurusan maksimal 100 karakter"),
    email: z.string().email("Format email tidak valid").max(100),
    message: z.string().min(10, "Pesan minimal 10 karakter").max(2000, "Pesan maksimal 2000 karakter"),
});

export async function submitContactMessage(rawData: z.infer<typeof ContactMessageSchema>) {
    const validated = ContactMessageSchema.safeParse(rawData);
    if (!validated.success) {
        return { success: false, message: validated.error.issues[0]?.message || "Input tidak valid" };
    }

    const { name, major, email, message } = validated.data;
    const cleanEmail = sanitizeString(email).toLowerCase();

    // Rate limit per email: max 3 messages per 10 minutes
    const limitKey = `contact:${cleanEmail}`;
    const limitResult = rateLimit(limitKey, { maxAttempts: 3, windowMs: 10 * 60 * 1000 });
    if (!limitResult.success) {
        return {
            success: false,
            message: `Terlalu banyak pesan yang dikirim dari email ini. Silakan coba kembali dalam ${Math.ceil(limitResult.resetInSeconds / 60)} menit.`,
        };
    }

    const cleanName = sanitizeString(name);
    const cleanMajor = sanitizeString(major);
    const cleanMessage = sanitizeString(message);

    // Log contact submission
    console.log(`[Contact Form] Dari: ${cleanName} (${cleanMajor}, ${cleanEmail}) - Pesan: ${cleanMessage}`);

    return {
        success: true,
        message: "Puji Tuhan! Pesan Anda berhasil dikirim ke pengurus PMK MIPA. Kami akan segera menghubungi Anda.",
    };
}

