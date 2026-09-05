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
        <section className="py-20 bg-secondary text-secondary-foreground relative overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <p className="text-xs uppercase font-bold tracking-widest text-primary">
                        Perjalanan & Komunitas Kami
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-foreground">
                        Bertumbuh Bersama Melintasi Generasi
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {stats.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary-foreground/5 border border-secondary-foreground/10 hover:border-primary/50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary mb-4">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight mb-2">
                                    {item.value}
                                </span>
                                <h3 className="text-lg font-bold text-secondary-foreground mb-1">
                                    {item.label}
                                </h3>
                                <p className="text-xs text-muted-foreground">
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
