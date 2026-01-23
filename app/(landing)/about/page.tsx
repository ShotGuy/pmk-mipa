import { Timeline } from "@/components/landing/Timeline";
import { TeamGrid } from "@/components/landing/TeamGrid";

export default function AboutPage() {
    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4 text-center mb-20 space-y-6">
                <h1 className="text-4xl md:text-6xl font-serif font-bold">Tentang Kami</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Mengenal lebih dekat sejarah, visi, dan orang-orang di balik pelayanan PMK MIPA.
                </p>
            </div>

            <Timeline />
            <TeamGrid />
        </div>
    );
}
