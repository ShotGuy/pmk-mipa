"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Building2, Cpu, Network, Quote, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const sectors = [
    {
        icon: GraduationCap,
        title: "Pendidikan & Akademisi",
        examples: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
        count: "150+ Alumni",
    },
    {
        icon: Cpu,
        title: "Teknologi & Industri Data",
        examples: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
        count: "120+ Alumni",
    },
    {
        icon: Building2,
        title: "Pemerintahan & BUMN",
        examples: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui.",
        count: "130+ Alumni",
    },
    {
        icon: Briefcase,
        title: "Wirausaha & Industri Sains",
        examples: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi.",
        count: "100+ Alumni",
    },
];

export function AlumniNetwork() {
    return (
        <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
            {/* Ambient Background Light */}
            <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10 space-y-20">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-semibold tracking-wide uppercase border border-primary/30">
                        <Network className="w-3.5 h-3.5" />
                        <span>Jejaring & Dampak</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-secondary-foreground">
                        Koneksi Alumni <span className="text-primary">Lintas Generasi</span>
                    </h2>

                    <p className="text-base text-muted-foreground leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Sectors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sectors.map((sector, index) => {
                        const Icon = sector.icon;
                        return (
                            <motion.div
                                key={sector.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="p-6 rounded-3xl bg-secondary-foreground/5 border border-secondary-foreground/10 hover:border-primary/50 transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold font-serif text-secondary-foreground">
                                        {sector.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {sector.examples}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-secondary-foreground/10 text-xs font-bold text-primary">
                                    {sector.count}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mentorship Program Highlight */}
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-secondary-foreground/10 via-secondary-foreground/5 to-transparent border border-secondary-foreground/15 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-primary">
                            <HeartHandshake className="w-4 h-4" />
                            <span>Program Pendampingan Mahasiswa</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-secondary-foreground">
                            Program Mentorship Skripsi & Persiapan Karir
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>

                    <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 font-semibold">
                                Hubungi Pengurus Alumni
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Testimonial Quote */}
                <div className="max-w-3xl mx-auto text-center space-y-4 pt-4">
                    <Quote className="w-8 h-8 mx-auto text-primary opacity-60" />
                    <p className="text-lg md:text-xl font-serif italic text-secondary-foreground font-light leading-relaxed">
                        &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.&rdquo;
                    </p>
                    <p className="text-xs uppercase tracking-widest text-primary font-semibold">
                        — Alumni PMK MIPA (Lorem Ipsum Dolor)
                    </p>
                </div>
            </div>
        </section>
    );
}
