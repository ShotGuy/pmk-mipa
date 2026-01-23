import { Hero } from "@/components/landing/Hero";

export default function Home() {
    return (
        <div className="flex flex-col gap-16 pb-16">
            <Hero />

            {/* Short About Preview (Optional, to make it not empty below fold) */}
            <section className="container mx-auto px-4 text-center py-20">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">
                    Selamat Datang di <span className="text-primary">PMK MIPA</span>
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                    Kami adalah keluarga Allah yang ditempatkan di Fakultas MIPA untuk menjadi garam dan terang.
                    Mari bertumbuh bersama dalam pengenalan akan Tuhan.
                </p>
            </section>
        </div>
    );
}
