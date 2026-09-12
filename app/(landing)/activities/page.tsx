import type { Metadata } from "next";
import { ActivitiesHero } from "@/components/activities/ActivitiesHero";
import { ScheduleCard } from "@/components/landing/ScheduleCard";
import { AnnualPrograms } from "@/components/activities/AnnualPrograms";
import { GalleryCarousel } from "@/components/landing/GalleryCarousel";
import { ActivitiesFAQ } from "@/components/activities/ActivitiesFAQ";
import { CallToAction } from "@/components/landing/CallToAction";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
    title: "Kegiatan & Jadwal Ibadah",
    description:
        "Jadwal ibadah rutin mingguan, persekutuan doa, kelompok tumbuh bersama (KTB), dan program kerja tahunan PMK MIPA FST Universitas Nusa Cendana.",
    alternates: {
        canonical: "/activities",
    },
};

export default function ActivitiesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <BreadcrumbJsonLd
                items={[
                    { name: "Beranda", url: "https://www.pmkmipa.web.id" },
                    { name: "Kegiatan & Jadwal Ibadah", url: "https://www.pmkmipa.web.id/activities" },
                ]}
            />
            {/* Header Hero */}
            <ActivitiesHero />

            {/* Weekly Schedule Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-6xl space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase border border-primary/20">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>Ibadah Mingguan</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                            Jadwal <span className="text-primary">Ibadah Rutin</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <ScheduleCard
                            type="friday"
                            title="Persekutuan Besar"
                            time="10.00 – 12.00 WITA"
                            location="Tentatif"
                            description="Persekutuan Besar diakan setiap Dua Minggu Sekali Pada Hari Sabtu"
                        />
                        <ScheduleCard
                            type="tuesday"
                            title="Ibadah Penerimaan Mahasiswa Baru"
                            time="10.00 – 12.00 WITA"
                            location="Tentatif"
                            description="Ibadah Penerimaan Mahasiswa Baru (IPMB) dilakukan setiap awal tahun ajaran Baru"
                        />
                    </div>
                </div>
            </section>

            {/* Annual Programs */}
            <AnnualPrograms />

            {/* Gallery Moments */}
            <section className="py-24 bg-secondary/5 relative overflow-hidden border-t border-border/50">
                <div className="container mx-auto px-4 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                            Galeri <span className="text-primary">Momen Pelayanan</span>
                        </h2>
                        <p className="text-muted-foreground text-base">
                            Kenangan Indah selama menjalankan pelayanan di PMK MIPA Undana Fakultas Sains dan Teknik Selama Bertahun tahun.
                        </p>
                    </div>
                    <GalleryCarousel />
                </div>
            </section>

            {/* Activities FAQ */}
            <ActivitiesFAQ />

            {/* Final CTA */}
            <CallToAction />
        </div>
    );
}
