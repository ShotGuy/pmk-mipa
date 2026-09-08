import type { Metadata } from "next";
import { ContactForm } from "@/components/landing/ContactForm";
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
        <div className="pt-24 pb-20 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold">Hubungi Kami</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Jangan ragu untuk menghubungi kami jika ada pertanyaan atau ingin bergabung.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Info Side */}
                    <div className="space-y-8">
                        <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10 space-y-6">
                            <h3 className="text-2xl font-bold font-serif">Informasi Kontak</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Alamat</h4>
                                        <p className="text-muted-foreground">
                                            Sekretariat PMK MIPA (JULANOFA&apos;S KOST),<br />
                                            Kota Kupang, Nusa Tenggara Timur
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Email</h4>
                                        <p className="text-muted-foreground">info@pmkmipa.id</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Telepon / WA</h4>
                                        <p className="text-muted-foreground">+62 812 3456 7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Embed */}
                        <div className="h-[350px] bg-muted rounded-2xl overflow-hidden relative border border-border shadow-md">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.440073477659!2d123.66391627492243!3d-10.157768309611306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c56837af8a46fa1%3A0x8317f1112af97e03!2sJULANOFA'S%20KOST!5e1!3m2!1sid!2sid!4v1788633372411!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                                className="w-full h-full"
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
