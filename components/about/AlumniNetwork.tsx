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
        <section className="py-24 bg-zinc-900 text-zinc-100 dark:bg-[#121110] relative overflow-hidden border-t-2 border-foreground/10">
            {/* Ambient Background Light */}
            <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10 space-y-20">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground text-xs font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm">
                        <Network className="w-4 h-4 text-primary" />
                        <span>Jejaring & Dampak</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#f5f3eb] leading-tight">
                        Koneksi Alumni <span className="text-primary italic">Lintas Generasi</span>
                    </h2>

                    <p className="text-lg text-[#f5f3eb]/80 font-serif font-bold leading-relaxed max-w-xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Sectors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sectors.map((sector, index) => {
                        const Icon = sector.icon;
                        return (
                            <motion.div
                                key={sector.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="p-8 bg-[#f5f3eb] dark:bg-[#25211f] border-4 border-foreground retro-shadow transition-all flex flex-col justify-between space-y-6 hover:-translate-y-2 hover:retro-shadow-lg"
                            >
                                <div className="space-y-4">
                                    <div className="w-14 h-14 bg-primary border-2 border-foreground flex items-center justify-center text-foreground retro-shadow-sm">
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold font-serif text-foreground leading-snug">
                                        {sector.title}
                                    </h3>
                                    <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed uppercase tracking-wide">
                                        {sector.examples}
                                    </p>
                                </div>

                                <div className="pt-4 border-t-2 border-dashed border-foreground/30 text-sm font-serif font-bold uppercase tracking-widest text-primary">
                                    {sector.count}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mentorship Program Highlight */}
                <div className="p-8 sm:p-12 bg-white dark:bg-[#25211f] border-4 border-foreground retro-shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-xs uppercase font-serif font-bold tracking-[0.2em] text-primary">
                            <HeartHandshake className="w-4 h-4" />
                            <span>Program Pendampingan Mahasiswa</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-foreground leading-tight">
                            Program Mentorship Skripsi & Persiapan Karir
                        </h3>
                        <p className="text-base text-foreground/80 font-serif font-bold leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>

                    <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button className="w-full bg-primary text-foreground border-2 border-foreground hover:bg-primary/90 dark:hover:text-zinc-900 rounded-none px-10 py-8 font-serif font-bold uppercase tracking-widest retro-shadow hover:retro-shadow-sm hover:translate-y-1 transition-all">
                                Hubungi Pengurus Alumni
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Testimonial Quote */}
                <div className="max-w-3xl mx-auto text-center space-y-6 pt-8">
                    <Quote className="w-12 h-12 mx-auto text-primary" />
                    <p className="text-2xl md:text-3xl font-serif italic text-[#f5f3eb] font-bold leading-relaxed">
                        &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.&rdquo;
                    </p>
                    <p className="text-sm font-serif font-bold uppercase tracking-[0.2em] text-primary pt-4 border-t-2 border-dashed border-primary/30 max-w-xs mx-auto">
                        — Alumni PMK MIPA <br /> (Lorem Ipsum Dolor)
                    </p>
                </div>
            </div>
        </section>
    );
}
