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
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl space-y-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase border border-primary/20">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Agenda Unggulan</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                        Program Besar <span className="text-primary">Tahunan</span>
                    </h2>

                    <p className="text-base text-muted-foreground leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {programs.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="p-7 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5"
                            >
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                            {item.period}
                                        </span>
                                        <h3 className="text-lg font-serif font-bold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
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
