"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 relative z-10 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-400/5 to-background border-2 border-primary/30 p-8 sm:p-12 md:p-16 text-center shadow-xl"
                >
                    {/* Decorative Ambient Light */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />

                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-foreground text-xs font-semibold uppercase tracking-wider">
                            <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                            <span>Pintu Kami Terbuka untuk Anda</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                            Rindu Memiliki Keluarga Rohani di Kampus?
                        </h2>

                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Apapun jurusanmu di Fakultas MIPA, mari bertumbuh bersama dalam iman, saling mendukung dalam perkuliahan, dan melayani dengan segenap hati.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <a
                                href="https://wa.me/6281234567890?text=Halo%20Pengurus%20PMK%20MIPA,%20saya%20ingin%20bergabung"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-full font-semibold shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all"
                                >
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Gabung via WhatsApp
                                </Button>
                            </a>

                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto text-base px-8 py-6 rounded-full font-semibold hover:border-primary hover:-translate-y-1 transition-all"
                                >
                                    Kirim Pesan / Pokok Doa
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        <p className="text-xs text-muted-foreground pt-4">
                            Sekretariat PMK MIPA Undana • Buka setiap hari perkuliahan
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
