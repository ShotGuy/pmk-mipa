"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Briefcase, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
    {
        icon: GraduationCap,
        title: "Akademik Prioritas",
        tag: "Dukungan Studi",
        description:
            "Kuliah sains dan matematika memang menantang, tapi kamu tidak sendirian. Kami saling mendukung melalui Kelompok Tumbuh Bersama",
    },
    {
        icon: Users,
        title: "Komunitas Hangat",
        tag: "Keluarga Rohani",
        description:
            "Keluarga kedua yang menyambutmu apa adanya tanpa sekat senioritas. Tempat aman untuk saling mendoakan, berbagi cerita kehidupan, dan bertumbuh bersama dalam iman.",
    },
    {
        icon: Briefcase,
        title: "Koneksi Alumni",
        tag: "Mentorship",
        description:
            "Terhubung dengan jejaring alumni PMK MIPA yang berkarier di berbagai bidang yang siap memberikan bimbingan masa depan.",
    },
];

export function ValueProps() {
    return (
        <section className="py-32 relative bg-transparent overflow-hidden border-t-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-[#f5f3eb] dark:bg-[#25211f] dark:text-primary border-2 border-foreground text-xs font-serif font-bold uppercase tracking-widest retro-shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Mengapa PMK MIPA?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight"
                    >
                        Iman yang Bertumbuh, <br className="hidden sm:block" />
                        <span className="text-primary italic font-light flex items-center justify-center gap-4">
                            <Sparkles className="w-6 h-6 hidden sm:block" />
                            Logika yang Utuh
                            <Sparkles className="w-6 h-6 hidden sm:block" />
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-foreground/80 leading-relaxed font-serif max-w-2xl mx-auto"
                    >
                        Kami percaya bahwa sains dan iman tidak saling bertentangan, melainkan saling melengkapi.
                        Tempat di mana studimu didukung dan kerohanianmu dikuatkan.
                    </motion.p>
                </div>

                {/* 3 Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((item, index) => {
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * (index + 1), duration: 0.5, ease: "easeOut" }}
                                className="group relative flex flex-col justify-between p-8 md:p-10 bg-white dark:bg-[#25211f] border-4 border-foreground retro-shadow-lg transition-transform hover:-translate-y-2 hover:retro-shadow"
                            >
                                {/* Step Number */}
                                <div className="absolute -top-6 -left-6 w-12 h-12 bg-zinc-900 text-[#f5f3eb] dark:bg-[#191715] dark:text-primary font-serif font-bold text-2xl flex items-center justify-center border-4 border-white dark:border-[#25211f] retro-shadow z-10">
                                    {index + 1}
                                </div>

                                <div className="space-y-6 pt-4">
                                    {/* Icon */}
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-none bg-primary flex items-center justify-center text-foreground border-2 border-foreground retro-shadow-sm group-hover:-rotate-6 transition-transform duration-300">
                                            <item.icon className="w-7 h-7 stroke-[2]" />
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-4 pt-2">
                                        <h3 className="text-2xl font-bold font-serif text-foreground group-hover:text-primary transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-foreground/80 leading-relaxed font-serif text-[15px]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 mt-8 border-t-2 border-foreground/10 flex items-center justify-between text-sm font-bold text-foreground font-serif uppercase tracking-wider group-hover:text-primary transition-colors">
                                    <span>{item.tag}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Link to About */}
                <div className="text-center mt-24">
                    <Link href="/about">
                        <Button className="rounded-full px-10 py-7 text-lg font-serif font-bold bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground hover:bg-primary dark:hover:text-zinc-900 retro-shadow hover:translate-y-1 hover:shadow-none transition-all duration-200 group">
                            Pelajari Visi & Misi Kami
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
