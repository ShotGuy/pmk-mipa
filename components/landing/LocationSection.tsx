"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=-10.1577683,123.6639163";

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Ambient Background Light */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase border border-primary/20"
                    >
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>Lokasi & Sekretariat</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-serif font-bold text-foreground"
                    >
                        Kunjungi <span className="text-primary">Sekretariat Kami</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-muted-foreground leading-relaxed"
                    >
                        Tempat kami berkumpul, belajar bersama, saling berbagi cerita, dan bertumbuh dalam iman.
                        Pintu kami selalu terbuka hangat menyambutmu.
                    </motion.p>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Info Card (5 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-card border border-border shadow-md space-y-6"
                    >
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif font-bold text-foreground">
                                Titik Kumpul & Pelayanan
                            </h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-primary mt-0.5">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-foreground">Alamat Sekretariat</h4>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Sekretariat PMK MIPA (JULANOFA&apos;S KOST),<br />
                                            Kota Kupang, Nusa Tenggara Timur
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-primary mt-0.5">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-foreground">Waktu Kunjungan</h4>
                                        <p className="text-muted-foreground">
                                            Senin – Sabtu • 09.00 – 18.00 WITA<br />
                                            (Terbuka untuk diskusi studi & persekutuan)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-primary mt-0.5">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-foreground">Narahubung</h4>
                                        <p className="text-muted-foreground">
                                            +62 812 3456 7890 (Pengurus BPH)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row gap-3">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold">
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Petunjuk Arah
                                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Interactive Map (7 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-7 h-[380px] lg:h-auto min-h-[380px] rounded-3xl overflow-hidden border border-border shadow-lg relative bg-muted"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.440073477659!2d123.66391627492243!3d-10.157768309611306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c56837af8a46fa1%3A0x8317f1112af97e03!2sJULANOFA'S%20KOST!5e1!3m2!1sid!2sid!4v1788633372411!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full"
                            title="Peta Lokasi Sekretariat PMK MIPA di Beranda"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
