"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

export function ActivitiesHero() {
    return (
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-transparent border-b-2 border-foreground/10">
            {/* Subtle Watermark Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none -z-10">
                <Image
                    src="/logo.png"
                    alt="PMK MIPA Watermark"
                    width={500}
                    height={500}
                    className="object-contain grayscale"
                />
            </div>

            <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-[#f5f3eb] dark:bg-[#25211f] dark:text-primary border-2 border-foreground text-xs font-serif font-bold uppercase tracking-[0.2em] retro-shadow-sm"
                >
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span>Jadwal & Kepelayanan</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[1.1]"
                >
                    Wadah Bertumbuh, <br />
                    <span className="italic font-light">Melayani, dan Berbuah</span>
                </motion.h1>
            </div>
        </section>
    );
}
