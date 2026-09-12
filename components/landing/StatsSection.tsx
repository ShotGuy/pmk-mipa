"use client";

import { motion } from "framer-motion";
import { Award, Users, GraduationCap, HeartHandshake } from "lucide-react";

const stats = [
    {
        icon: Award,
        value: "25+",
        label: "Tahun Kesetiaan",
        sub: "Melayani generasi mahasiswa sejak 1998",
    },
    {
        icon: Users,
        value: "500+",
        label: "Alumni Terhubung",
        sub: "Bersebaran di industri & akademisi",
    },
    {
        icon: GraduationCap,
        value: "4",
        label: "Jurusan MIPA",
        sub: "Matematika, Fisika, Kimia & Biologi/Ilkom",
    },
    {
        icon: HeartHandshake,
        value: "1",
        label: "Keluarga Kristus",
        sub: "Saling dukung dalam iman & studi",
    },
];

export function StatsSection() {
    return (
        <section className="py-32 bg-zinc-900 dark:bg-[#121110] text-zinc-50 relative overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
                    <p className="text-xs uppercase font-semibold tracking-[0.2em] text-primary">
                        Perjalanan & Komunitas Kami
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                        Bertumbuh Bersama <br className="hidden sm:block" />
                        <span className="italic font-light">Melintasi Generasi</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-primary mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30">
                                    <Icon className="w-7 h-7 stroke-[1.5]" />
                                </div>
                                <span className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight mb-4">
                                    {item.value}
                                </span>
                                <h3 className="text-xl font-bold text-zinc-200 mb-2">
                                    {item.label}
                                </h3>
                                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                                    {item.sub}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
