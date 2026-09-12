"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=-10.1577683,123.6639163";

    return (
        <section className="py-28 bg-[#f5f3eb] dark:bg-[#181614] relative overflow-hidden border-b-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground text-xs font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm"
                    >
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Lokasi & Sekretariat</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight"
                    >
                        Kunjungi <span className="text-primary italic">Sekretariat Kami</span>
                    </motion.h2>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    {/* Left: Info Card (5 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="lg:col-span-5 flex flex-col justify-between p-10 bg-white dark:bg-[#25211f] border-4 border-foreground retro-shadow space-y-8"
                    >
                        <div className="space-y-8">
                            <h3 className="text-3xl font-serif font-bold text-foreground tracking-tight border-b-2 border-dashed border-foreground/30 pb-4">
                                Titik Kumpul & Pelayanan
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-primary border-4 border-foreground flex items-center justify-center shrink-0 text-foreground retro-shadow-sm">
                                        <MapPin className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        <h4 className="font-serif font-bold text-xl text-foreground">Alamat Sekretariat</h4>
                                        <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed tracking-wide">
                                            Sekretariat PMK MIPA (JULANOFA&apos;S KOST),<br />
                                            Kota Kupang, Nusa Tenggara Timur
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-primary border-4 border-foreground flex items-center justify-center shrink-0 text-foreground retro-shadow-sm">
                                        <Clock className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        <h4 className="font-serif font-bold text-xl text-foreground">Waktu Kunjungan</h4>
                                        <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed tracking-wide">
                                            Senin – Jumat • 09.00 – 16.00 WITA<br />
                                            (Harap menghubungi BP sebelum melakukan kunjungan)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-primary border-4 border-foreground flex items-center justify-center shrink-0 text-foreground retro-shadow-sm">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        <h4 className="font-serif font-bold text-xl text-foreground">Narahubung</h4>
                                        <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed tracking-wide">
                                            +62 815 5842 3379 (Kak Lily)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-8 border-t-2 border-dashed border-foreground/30 flex flex-col sm:flex-row gap-4">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <Button className="w-full bg-zinc-900 text-white dark:bg-primary dark:text-zinc-900 hover:bg-primary hover:text-foreground border-2 border-foreground transition-colors rounded-none font-serif font-bold uppercase tracking-widest py-8 text-sm retro-shadow-sm hover:retro-shadow-none">
                                    <Navigation className="w-5 h-5 mr-3" />
                                    Petunjuk Arah
                                    <ExternalLink className="w-4 h-4 ml-3 opacity-70" />
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Interactive Map (7 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="lg:col-span-7 h-[420px] lg:h-auto min-h-[420px] overflow-hidden relative bg-white dark:bg-[#25211f] border-4 border-foreground p-2 retro-shadow"
                    >
                        <div className="w-full h-full overflow-hidden border-2 border-foreground">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.440073477659!2d123.66391627492243!3d-10.157768309611306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c56837af8a46fa1%3A0x8317f1112af97e03!2sJULANOFA'S%20KOST!5e1!3m2!1sid!2sid!4v1788633372411!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full grayscale opacity-90 contrast-125"
                                title="Peta Lokasi Sekretariat PMK MIPA di Beranda"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
