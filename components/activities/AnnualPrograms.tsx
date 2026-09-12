"use client";

import { motion } from "framer-motion";
import { Award, Sun, Heart, Sparkles, Calendar } from "lucide-react";

const programs = [
    {
        icon: Sparkles,
        title: "Welcoming Mahasiswa Baru",
        period: "Awal Semester Ganjil",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    },
    {
        icon: Sun,
        title: "Retreat & Ibadah Padang",
        period: "Pertengahan Tahun",
        description:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    },
    {
        icon: Award,
        title: "Ibadah Paskah & Natal FMIPA",
        period: "April & Desember",
        description:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.",
    },
    {
        icon: Heart,
        title: "Bakti Sosial & Aksi Kasih",
        period: "Berkala Setiap Semester",
        description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    },
];

export function AnnualPrograms() {
    return (
        <section className="py-24 bg-background relative overflow-hidden border-b-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-6xl space-y-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-foreground text-foreground text-xs font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Agenda Unggulan</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                        Program Besar <span className="text-primary italic">Tahunan</span>
                    </h2>

                    <p className="text-lg text-foreground/80 font-serif font-bold max-w-xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {programs.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="p-8 bg-white border-4 border-foreground retro-shadow hover:-translate-y-2 hover:retro-shadow-lg transition-transform duration-300 flex flex-col justify-between space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-primary border-4 border-foreground flex items-center justify-center text-foreground retro-shadow-sm">
                                        <Icon className="w-8 h-8" />
                                    </div>

                                    <div className="space-y-3">
                                        <span className="text-xs font-serif font-bold uppercase tracking-widest text-primary block border-b-2 border-dashed border-foreground/30 pb-2">
                                            {item.period}
                                        </span>
                                        <h3 className="text-2xl font-serif font-bold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed uppercase tracking-wide">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
