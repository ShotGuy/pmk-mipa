"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
    return (
        <section className="py-32 relative overflow-hidden bg-transparent border-t-2 border-foreground/10">
            <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative bg-primary border-4 border-foreground p-10 sm:p-16 md:p-20 text-center retro-shadow-lg"
                >
                    {/* Decorative Top Left Badge */}
                    <div className="absolute -top-6 -left-6 z-20 bg-zinc-900 text-[#f5f3eb] p-3 border-4 border-white dark:border-[#25211f] retro-shadow rotate-[-10deg]">
                        <Heart className="w-8 h-8 fill-primary stroke-none animate-pulse" />
                    </div>

                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#25211f] border-2 border-foreground text-foreground text-xs font-serif font-bold uppercase tracking-[0.2em] retro-shadow-sm">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>Pintu Kami Terbuka</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-zinc-900 leading-[1.1]">
                            Rindu Memiliki <br className="hidden sm:block" />
                            <span className="italic font-light">Keluarga Rohani</span> di Kampus?
                        </h2>

                        <p className="text-lg md:text-xl text-zinc-800 font-serif font-bold leading-relaxed max-w-2xl mx-auto">
                            Apapun jurusanmu di Fakultas Sains dan Teknik, mari bertumbuh bersama dalam iman, saling mendukung dalam perkuliahan, dan melayani dengan segenap hati.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                            <a
                                href="https://wa.me/6281234567890?text=Halo%20Pengurus%20PMK%20MIPA,%20saya%20ingin%20bergabung"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-zinc-900 text-[#f5f3eb] hover:bg-zinc-800 text-lg px-10 py-7 border-2 border-foreground rounded-full font-serif font-bold retro-shadow hover:translate-y-1 hover:shadow-none transition-all duration-200 cursor-pointer"
                                >
                                    <MessageCircle className="mr-3 h-5 w-5" />
                                    WhatsApp Kami
                                </Button>
                            </a>

                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-white dark:bg-[#25211f] text-foreground hover:bg-[#f5f3eb] dark:hover:bg-zinc-800 text-lg px-10 py-7 border-2 border-foreground rounded-full font-serif font-bold retro-shadow hover:translate-y-1 hover:shadow-none transition-all duration-200 group cursor-pointer"
                                >
                                    Kirim Pesan
                                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 flex items-center justify-center gap-4">
                            <div className="h-0.5 flex-1 bg-zinc-900/20 max-w-[100px]"></div>
                            <p className="text-sm text-zinc-900 font-serif font-bold uppercase tracking-widest">
                                Badan Pengurus PMK MIPA Undana
                            </p>
                            <div className="h-0.5 flex-1 bg-zinc-900/20 max-w-[100px]"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
