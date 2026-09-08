"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export function SpiritualCore() {
    return (
        <section className="relative py-28 overflow-hidden bg-accent/70 border-y border-primary/20">
            {/* Watermark Background Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06] -z-0">
                <Image
                    src="/logo.png"
                    alt="Watermark PMK MIPA"
                    width={500}
                    height={500}
                    className="object-contain"
                />
            </div>

            {/* Decorative Subtle Light */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    {/* Badge Icon */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-foreground text-xs font-semibold uppercase tracking-wider">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span>Landasan Pelayanan Kami</span>
                    </div>

                    {/* Verse Quotation */}
                    <blockquote className="space-y-4">
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground italic leading-snug tracking-tight">
                            &ldquo;Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.&rdquo;
                        </p>
                        <footer className="pt-2">
                            <cite className="not-italic text-base md:text-lg font-semibold text-primary uppercase tracking-widest block">
                                — Kolose 3:14 (TB)
                            </cite>
                        </footer>
                    </blockquote>

                    {/* Short Reflection */}
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-4 font-sans">
                        Di tengah kesibukan kuliah sains dan dinamika kehidupan kampus, kasih Kristus adalah kompas dan pondasi utama kami dalam melayani serta berelasi satu sama lain.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
