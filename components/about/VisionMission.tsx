"use client";

import { motion } from "framer-motion";
import { Compass, Target, CheckCircle2, BookOpen } from "lucide-react";

const missionPoints = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
];

export function VisionMission() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden border-b-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-6xl space-y-20">
                {/* Vision & Mission Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col justify-between p-10 bg-white dark:bg-[#25211f] border-4 border-foreground retro-shadow-lg relative overflow-hidden"
                    >
                        <div className="space-y-6">
                            <div className="w-14 h-14 bg-primary border-2 border-foreground retro-shadow-sm flex items-center justify-center text-foreground">
                                <Compass className="w-7 h-7" />
                            </div>

                            <div className="space-y-3">
                                <span className="text-xs uppercase font-serif font-bold tracking-[0.2em] text-primary">
                                    Visi Kami
                                </span>
                                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-foreground leading-[1.2]">
                                    Menghasilkan Sarjana Sains yang Berakar Kuat dalam Kristus
                                </h3>
                            </div>

                            <p className="text-base text-foreground/80 font-serif font-bold leading-relaxed">
                                &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.&rdquo;
                            </p>
                        </div>

                        <div className="pt-6 mt-6 border-t-2 border-dashed border-foreground/30 flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-widest text-primary">
                            <BookOpen className="w-4 h-4" />
                            <span>Matius 5:14 — Garam dan Terang Dunia</span>
                        </div>
                    </motion.div>

                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="flex flex-col justify-between p-10 bg-[#f5f3eb] dark:bg-[#25211f] border-4 border-foreground retro-shadow-lg"
                    >
                        <div className="space-y-6">
                            <div className="w-14 h-14 bg-white dark:bg-[#191715] border-2 border-foreground retro-shadow-sm flex items-center justify-center text-foreground">
                                <Target className="w-7 h-7 text-primary" />
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs uppercase font-serif font-bold tracking-[0.2em] text-primary">
                                    Misi Kami
                                </span>
                                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-foreground leading-[1.2]">
                                    Langkah Nyata Pelayanan
                                </h3>
                            </div>

                            <ul className="space-y-4 pt-2">
                                {missionPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm font-serif font-bold text-foreground/80 leading-relaxed">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
