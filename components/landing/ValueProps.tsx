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
            "Kuliah sains dan matematika memang menantang, tapi kamu tidak sendirian. Kami saling mendukung melalui kelompok belajar, bimbingan materi, dan tips sukses dari senior.",
        accentColor: "from-amber-500/20 to-amber-500/5",
        borderColor: "group-hover:border-primary/50",
    },
    {
        icon: Users,
        title: "Komunitas Hangat",
        tag: "Keluarga Rohani",
        description:
            "Keluarga kedua yang menyambutmu apa adanya tanpa sekat senioritas. Tempat aman untuk saling mendoakan, berbagi cerita kehidupan, dan bertumbuh bersama dalam iman.",
        accentColor: "from-amber-400/20 to-amber-400/5",
        borderColor: "group-hover:border-primary/50",
    },
    {
        icon: Briefcase,
        title: "Koneksi Alumni",
        tag: "Mentorship Karir",
        description:
            "Terhubung dengan jejaring ratusan alumni PMK MIPA yang berkarier di industri teknologi, riset sains, pendidikan, dan pemerintahan yang siap memberikan bimbingan masa depan.",
        accentColor: "from-amber-600/20 to-amber-600/5",
        borderColor: "group-hover:border-primary/50",
    },
];

export function ValueProps() {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase border border-primary/20"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Mengapa PMK MIPA?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight"
                    >
                        Iman yang Bertumbuh, <br className="hidden sm:block" />
                        <span className="text-primary">Logika yang Utuh</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-muted-foreground leading-relaxed"
                    >
                        Kami percaya bahwa sains dan iman tidak saling bertentangan, melainkan saling melengkapi. 
                        Tempat di mana studimu didukung dan kerohanianmu dikuatkan.
                    </motion.p>
                </div>

                {/* 3 Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
                                className={`group relative flex flex-col justify-between p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${item.borderColor}`}
                            >
                                <div className="space-y-5">
                                    {/* Icon with Soft Gradient Ring */}
                                    <div className="flex items-center justify-between">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accentColor} border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/10 text-muted-foreground">
                                            {item.tag}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-3 pt-2">
                                        <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                                    <span>Jelajahi Lebih Jauh</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Link to About */}
                <div className="text-center mt-12">
                    <Link href="/about">
                        <Button variant="outline" className="rounded-full px-6 hover:border-primary">
                            Pelajari Visi & Misi Kami
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
