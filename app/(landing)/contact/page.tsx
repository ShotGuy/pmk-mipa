import type { Metadata } from "next";
import { ContactForm } from "@/components/landing/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";
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
        <div className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-transparent">
            <BreadcrumbJsonLd
                items={[
                    { name: "Beranda", url: "https://www.pmkmipa.web.id" },
                    { name: "Hubungi Kami", url: "https://www.pmkmipa.web.id/contact" },
                ]}
            />
            {/* Scribble decoration */}
            <svg className="absolute top-20 right-10 w-24 h-24 text-blue-500 opacity-40 rotate-12" viewBox="0 0 100 100">
                <path d="M10,50 Q50,10 90,50 T10,50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-pixel text-xs tracking-wide uppercase scrapbook-border -rotate-2">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        <span>Kirim Surat</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-black">
                        Hubungi <span className="bg-primary px-3 text-white inline-block rotate-1 scrapbook-border">Kami</span>
                    </h1>

                    <p className="text-2xl font-handwriting font-bold text-black/80 max-w-2xl mx-auto leading-relaxed">
                        Jangan ragu untuk menyapa atau bertanya. Kami dengan senang hati akan merespons!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start">
                    {/* Info Side */}
                    <div className="space-y-12">
                        {/* Notes Card */}
                        <div className="bg-yellow-100 p-8 sm:p-10 scrapbook-border shadow-[12px_12px_0px_rgba(0,0,0,1)] rotate-1 relative">
                            {/* Tape */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/60 border border-gray-300/50 rotate-[-4deg] z-10" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}></div>

                            <h3 className="text-3xl font-display font-black text-black mb-8 relative z-10">
                                Informasi Kontak
                            </h3>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black -rotate-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-black text-xl text-black">Alamat</h4>
                                        <p className="text-lg font-handwriting font-bold text-black/80 leading-relaxed mt-1">
                                            Sekretariat PMK MIPA (JULANOFA&apos;S KOST),<br />
                                            Kota Kupang, Nusa Tenggara Timur
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black rotate-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-black text-xl text-black">Email</h4>
                                        <p className="text-lg font-handwriting font-bold text-black/80 mt-1">info@pmkmipa.id</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black -rotate-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-black text-xl text-black">Telepon / WA</h4>
                                        <p className="text-lg font-handwriting font-bold text-black/80 mt-1">+62 812 3456 7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Embed (Polaroid Style) */}
                        <div className="bg-white p-4 pb-12 scrapbook-border shadow-[12px_12px_0px_rgba(0,0,0,1)] -rotate-2 relative">
                            {/* Pin */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] border-2 border-black z-20"></div>

                            <div className="w-full h-[300px] border-2 border-black bg-gray-200 mt-4 relative z-10 overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.440073477659!2d123.66391627492243!3d-10.157768309611306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c56837af8a46fa1%3A0x8317f1112af97e03!2sJULANOFA'S%20KOST!5e1!3m2!1sid!2sid!4v1788633372411!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                                    title="Peta Lokasi Sekretariat PMK MIPA"
                                />
                            </div>

                            <div className="absolute bottom-3 left-0 right-0 text-center">
                                <p className="font-handwriting font-bold text-xl text-black">Sekretariat Kita!</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
