import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { VisionMission } from "@/components/about/VisionMission";
import { Timeline } from "@/components/landing/Timeline";
import { TeamGrid } from "@/components/landing/TeamGrid";
import { CallToAction } from "@/components/landing/CallToAction";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
    title: "Tentang Kami",
    description:
        "Mengenal profil, visi, misi, sejarah, struktur Badan Pengurus, dan jejaring alumni PMK MIPA FST Universitas Nusa Cendana (Undana) Kupang.",
    alternates: {
        canonical: "/about",
    },
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <BreadcrumbJsonLd
                items={[
                    { name: "Beranda", url: "https://www.pmkmipa.web.id" },
                    { name: "Tentang Kami", url: "https://www.pmkmipa.web.id/about" },
                ]}
            />
            <AboutHero />
            <VisionMission />
            <Timeline />
            <TeamGrid />
            <CallToAction />
        </div>
    );
}
