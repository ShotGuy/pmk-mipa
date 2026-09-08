import { Hero } from "@/components/landing/Hero";
import { ValueProps } from "@/components/landing/ValueProps";
import { SpiritualCore } from "@/components/landing/SpiritualCore";
import { UpcomingEvents } from "@/components/landing/UpcomingEvents";
import { StatsSection } from "@/components/landing/StatsSection";
import { MiniGallery } from "@/components/landing/MiniGallery";
import { LocationSection } from "@/components/landing/LocationSection";
import { CallToAction } from "@/components/landing/CallToAction";
import { getUpcomingEventsForHome, getGalleryHighlightsForHome } from "@/actions/landing";

export default async function Home() {
    const [events, galleries] = await Promise.all([
        getUpcomingEventsForHome(),
        getGalleryHighlightsForHome(),
    ]);

    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <ValueProps />
            <SpiritualCore />
            <UpcomingEvents events={events} />
            <StatsSection />
            <MiniGallery galleries={galleries} />
            <LocationSection />
            <CallToAction />
        </div>
    );
}
