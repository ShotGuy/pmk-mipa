import type { Metadata } from "next";
import { ContactForm } from "@/components/landing/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Hubungi Kami & Sekretariat",
    description:
        "Informasi kontak sekretariat, nomor telepon pengurus, alamat, dan formulir pesan PMK MIPA FST Universitas Nusa Cendana Kupang.",
    alternates: {
        canonical: "/contact",
    },
};

export default function ContactPage() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-background">
            <BreadcrumbJsonLd
                items={[
                    { name: "Beranda", url: "https://www.pmkmipa.web.id" },
                    { name: "Hubungi Kami", url: "https://www.pmkmipa.web.id/contact" },
                ]}
            />
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-[1.1]">
                        Hubungi <span className="italic font-light">Kami</span>
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-serif font-bold">
                        Jangan ragu untuk menghubungi kami jika ada pertanyaan atau ingin bergabung.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start">
                    {/* Info Side */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 border-4 border-foreground retro-shadow space-y-8">
                            <h3 className="text-3xl font-bold font-serif text-foreground">Informasi Kontak</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-primary border-4 border-foreground flex items-center justify-center shrink-0 text-foreground retro-shadow-sm">
                                        <MapPin className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        <h4 className="font-serif font-bold text-xl text-foreground">Alamat</h4>
                                        <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed uppercase tracking-wide">
                                            Sekretariat PMK MIPA (JULANOFA&apos;S KOST),<br />
                                            Kota Kupang, Nusa Tenggara Timur
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-primary border-4 border-foreground flex items-center justify-center shrink-0 text-foreground retro-shadow-sm">
                                        <Mail className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        <h4 className="font-serif font-bold text-xl text-foreground">Email</h4>
                                        <p className="text-sm font-serif font-bold text-foreground/80 uppercase tracking-wide">info@pmkmipa.id</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-primary border-4 border-foreground flex items-center justify-center shrink-0 text-foreground retro-shadow-sm">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        <h4 className="font-serif font-bold text-xl text-foreground">Telepon / WA</h4>
                                        <p className="text-sm font-serif font-bold text-foreground/80 uppercase tracking-wide">+62 812 3456 7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Embed */}
                        <div className="h-[400px] bg-white border-4 border-foreground retro-shadow p-2">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.440073477659!2d123.66391627492243!3d-10.157768309611306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c56837af8a46fa1%3A0x8317f1112af97e03!2sJULANOFA'S%20KOST!5e1!3m2!1sid!2sid!4v1788633372411!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                                className="w-full h-full grayscale opacity-90 contrast-125 border-2 border-foreground"
                                title="Peta Lokasi Sekretariat PMK MIPA"
                            />
                        </div>
                    </div>

                    {/* Form Side */}
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
