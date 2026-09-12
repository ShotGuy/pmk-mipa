"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export function SpiritualCore() {
    return (
        <section className="relative py-32 overflow-hidden bg-transparent border-t-4 border-b-4 border-foreground">
            {/* Watermark Background Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] -z-0">
                <Image
                    src="/logo.png"
                    alt="Watermark PMK MIPA"
                    width={600}
                    height={600}
                    className="object-contain"
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-12"
                >
                    {/* Badge Icon */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f3eb] dark:bg-[#25211f] border-2 border-foreground text-foreground text-xs font-serif font-bold uppercase tracking-[0.2em] retro-shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Landasan Pelayanan</span>
                        <Sparkles className="w-4 h-4 text-primary" />
                    </div>

                    {/* Verse Quotation */}
                    <blockquote className="space-y-8 relative">
                        {/* Decorative lines like in reference */}
                        <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto mb-8">
                            <div className="h-0.5 flex-1 bg-foreground"></div>
                            <Sparkles className="w-6 h-6 text-primary shrink-0" />
                            <div className="h-0.5 flex-1 bg-foreground"></div>
                        </div>

                        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.3] font-bold">
                            &ldquo;Kamu telah menerima Kristus Yesus, Tuhan kita. Karena itu hendaklah hidupmu <span className="text-primary italic font-light">tetap di dalam Dia</span>.&rdquo;
                        </p>

                        <footer className="pt-8 flex flex-col items-center gap-4">
                            <cite className="not-italic text-sm md:text-base font-bold font-serif text-foreground/80 uppercase tracking-[0.3em] block">
                                — Kolose 2 : 6 (TB)
                            </cite>
                        </footer>

                        <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto mt-8">
                            <div className="h-0.5 flex-1 bg-foreground"></div>
                            <Sparkles className="w-6 h-6 text-primary shrink-0" />
                            <div className="h-0.5 flex-1 bg-foreground"></div>
                        </div>
                    </blockquote>
                </motion.div>
            </div>
        </section>
    );
}
