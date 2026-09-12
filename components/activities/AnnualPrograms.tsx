"use client";

import { motion } from "framer-motion";
import { Award, Sun, Heart, Sparkles, Calendar } from "lucide-react";

const programs = [
    {
        icon: Sparkles,
        title: "Ibadah Penerimaan Mahasiswa Baru",
        period: "Awal Semester Ganjil",
        description:
            "Ibadah Penerimaan Mahasiswa Baru (IPMB) dilakukan setiap awal tahun ajaran Baru",
    },
    {
        icon: Sun,
        title: "KTB Rechage",
        period: "Setiap Semester",
        description:
            "KTB Rechage adalah kegiatan refreshing yang biasanya dilakukan di tempat rekreasi.",
    },
    {
        icon: Award,
        title: "Ibadah Raya Paskah & Natal",
        period: "April & Desember",
        description:
            "Ibadah Raya Paskah & Natal adalah ibadah yang dilakukan setiap merayakan hari Raya Paskah & Natal",
    },
    {
        icon: Heart,
        title: "Camp Regenerasi",
        period: "Setahun Sekali",
        description:
            "Camp Regenerasi adalah kegiatan kamp yang dilakukan untuk meregenerasi Badan Pengurus PMK MIPA.",
    },
];

export function AnnualPrograms() {
    return (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b-2 border-foreground/10">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12 md:space-y-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-4 sm:space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#25211f] border-2 border-foreground text-foreground text-xs font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Agenda Rutin Tahunan</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                        Program Besar <span className="text-primary italic">Tahunan</span>
                    </h2>
                </div>

                {/* 4 Cards: Horizontal Snap Carousel on Mobile, Grid on Desktop */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 pt-2 px-4 sm:px-6 -mx-4 sm:-mx-6 md:mx-0 md:px-0 md:pb-0 md:pt-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {programs.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="flex-[0_0_82%] sm:flex-[0_0_60%] md:flex-auto md:w-full snap-center md:snap-align-none shrink-0 md:shrink p-6 sm:p-8 bg-white dark:bg-[#25211f] border-4 border-foreground retro-shadow hover:-translate-y-2 hover:retro-shadow-lg transition-transform duration-300 flex flex-col justify-between space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary border-4 border-foreground flex items-center justify-center text-foreground retro-shadow-sm">
                                        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                                    </div>

                                    <div className="space-y-3">
                                        <span className="text-xs font-serif font-bold uppercase tracking-widest text-primary block border-b-2 border-dashed border-foreground/30 pb-2">
                                            {item.period}
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed tracking-wide">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile Swipe Hint */}
                <div className="flex md:hidden items-center justify-center gap-2 mt-2 text-xs font-serif font-bold text-foreground/70">
                    <span className="w-6 h-[1.5px] bg-foreground/30" />
                    <span>← Geser untuk melihat program lainnya →</span>
                    <span className="w-6 h-[1.5px] bg-foreground/30" />
                </div>
            </div>
        </section>
    );
}
