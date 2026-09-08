import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { VisionMission } from "@/components/about/VisionMission";
import { Timeline } from "@/components/landing/Timeline";
import { TeamGrid } from "@/components/landing/TeamGrid";
import { AlumniNetwork } from "@/components/about/AlumniNetwork";
import { CallToAction } from "@/components/landing/CallToAction";

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
            <AboutHero />
            <VisionMission />
            <Timeline />
            <TeamGrid />
            <AlumniNetwork />
            <CallToAction />
        </div>
    );
}
