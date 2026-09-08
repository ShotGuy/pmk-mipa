"use server";

import { db } from "@/lib/db";

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
    {
        id: "default-friday-service",
        title: "Ibadah Raya Persekutuan Jumat",
        date: "Setiap Jumat",
        time: "11.30 - 13.00 WIB",
        location: "Ruang Multimedia FMIPA",
        speaker: "Hamba Tuhan / Dosen Tamu",
        description: "Ibadah persekutuan mingguan mahasiswa FMIPA. Terbuka bagi seluruh angkatan untuk memuji, menyembah, dan dikuatkan dalam firman.",
        type: "friday",
        badgeText: "Ibadah Mingguan",
    },
    {
        id: "default-tuesday-prayer",
        title: "Persekutuan Doa Syafaat",
        date: "Setiap Selasa",
        time: "16.00 - 17.30 WIB",
        location: "Sekretariat PMK MIPA",
        speaker: "Sie Doa & Pengurus",
        description: "Waktu sehati berdoa bagi perkuliahan, bangsa, pergumulan pribadi, dan pelayanan di lingkungan Fakultas MIPA.",
        type: "tuesday",
        badgeText: "Doa Syafaat",
    },
    {
        id: "default-welcoming-maba",
        title: "Welcoming Gathering Mahasiswa Baru",
        date: "Agenda Mendatang",
        time: "10.00 - Selesai",
        location: "Aula FMIPA",
        speaker: "Badan Pengurus Harian & Alumni",
        description: "Temu ramah, pengenalan keluarga PMK MIPA, tips adaptasi perkuliahan sains, dan kebersamaan lintas angkatan.",
        type: "special",
        badgeText: "Acara Khusus",
    },
];

const DEFAULT_GALLERY_HIGHLIGHTS: GalleryHighlightItem[] = [
    {
        id: "gal-1",
        title: "Retreat & Ibadah Padang",
        category: "Kebersamaan",
        image: "/images/hero-bg.jpg",
        description: "Momen penguatan rohani di alam terbuka bersama seluruh keluarga besar PMK MIPA.",
    },
    {
        id: "gal-2",
        title: "Ibadah Raya & Perayaan Natal",
        category: "Ibadah Besar",
        image: "/images/hero-bg.jpg",
        description: "Sukacita perayaan kelahiran Kristus bersama mahasiswa, dosen, dan alumni FMIPA.",
    },
    {
        id: "gal-3",
        title: "Bakti Sosial & Pelayanan Kasih",
        category: "Aksi Sosial",
        image: "/images/hero-bg.jpg",
        description: "Wujud nyata kasih Kristus melalui kepedulian sosial kepada sesama dan masyarakat sekitar.",
    },
    {
        id: "gal-4",
        title: "Kelompok Tumbuh Bersama (KTB)",
        category: "Pemuridan",
        image: "/images/hero-bg.jpg",
        description: "Kelompok kecil pemuridan untuk saling mendoakan, belajar firman, dan membangun kedisiplinan rohani.",
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
