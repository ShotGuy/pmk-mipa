import { ScheduleCard } from "@/components/landing/ScheduleCard";
import { GalleryCarousel } from "@/components/landing/GalleryCarousel";

export default function ActivitiesPage() {
    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4 space-y-20">

                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold">Kegiatan Kami</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Berbagai aktivitas yang membangun, dari persekutuan rutin hingga program sosial.
                    </p>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <ScheduleCard
                        type="friday"
                        title="Persekutuan Jumat"
                        time="11.30 - 13.00 WIB"
                        location="Ruang Multimedia FMIPA"
                        description="Ibadah raya mingguan dengan pujian, penyembahan, dan firman Tuhan yang menguatkan."
                    />
                    <ScheduleCard
                        type="tuesday"
                        title="Persekutuan Doa"
                        time="16.00 - 17.30 WIB"
                        location="Sekretariat PMK"
                        description="Waktu khusus untuk berdoa syafaat bagi kampus, bangsa, dan kebutuhan pribadi."
                    />
                </div>

                {/* Gallery */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-serif font-bold mb-4">Galeri Momen</h2>
                        <p className="text-muted-foreground">Keceriuman dan kebersamaan dalam setiap kegiatan.</p>
                    </div>
                    <GalleryCarousel />
                </div>

            </div>
        </div>
    );
}
