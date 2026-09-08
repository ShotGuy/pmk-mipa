import type { Metadata } from "next";
import { ActivitiesHero } from "@/components/activities/ActivitiesHero";
import { ScheduleCard } from "@/components/landing/ScheduleCard";
import { MinistryDivisions } from "@/components/activities/MinistryDivisions";
import { AnnualPrograms } from "@/components/activities/AnnualPrograms";
import { GalleryCarousel } from "@/components/landing/GalleryCarousel";
import { ActivitiesFAQ } from "@/components/activities/ActivitiesFAQ";
import { CallToAction } from "@/components/landing/CallToAction";
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
                        <p className="text-muted-foreground text-base">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <ScheduleCard
                            type="friday"
                            title="Ibadah Raya Jumat"
                            time="11.30 – 13.00 WITA"
                            location="Ruang Multimedia FMIPA Undana"
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                        <ScheduleCard
                            type="tuesday"
                            title="Persekutuan Doa Syafaat"
                            time="16.00 – 17.30 WITA"
                            location="Sekretariat PMK (JULANOFA'S KOST)"
                            description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat."
                        />
                    </div>
                </div>
            </section>

            {/* Ministry Divisions (2x2 Grid) */}
            <MinistryDivisions />

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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
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
