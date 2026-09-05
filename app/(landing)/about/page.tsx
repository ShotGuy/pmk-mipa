import { AboutHero } from "@/components/about/AboutHero";
import { VisionMission } from "@/components/about/VisionMission";
import { Timeline } from "@/components/landing/Timeline";
import { TeamGrid } from "@/components/landing/TeamGrid";
import { AlumniNetwork } from "@/components/about/AlumniNetwork";
import { CallToAction } from "@/components/landing/CallToAction";

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
