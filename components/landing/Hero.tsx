"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] w-full flex items-center pt-32 pb-20 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 relative"
                    >
                        {/* Decorative Sparkle */}
                        <div className="absolute -top-12 -left-8 text-foreground/20">
                            <Sparkles className="w-16 h-16" strokeWidth={1} />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.1] font-bold">
                            Bersaksi, <br />
                            Bersekutu, <br />
                            <span className="italic font-light flex items-center gap-4">
                                Melayani
                                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-foreground/80 max-w-md font-serif leading-relaxed">
                            Wadah persekutuan mahasiswa Kristen di FST UNDANA yang berkomitmen untuk tumbuh bersama dalam iman dan kasih Kristus.
                        </p>

                        <div className="pt-8">
                            <Link href="/about">
                                <Button
                                    size="lg"
                                    className="bg-primary text-foreground border-2 border-foreground hover:bg-primary/80 text-lg px-8 py-7 rounded-full font-serif font-bold transition-all duration-200 retro-shadow hover:translate-y-1 hover:shadow-none group"
                                >
                                    Kenali Kami
                                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        {/* Stats / Numbers like in reference */}
                        <div className="grid grid-cols-3 gap-8 pt-16 border-t-2 border-foreground/10 max-w-md">
                            <div>
                                <h4 className="text-3xl font-serif font-bold text-primary">20+</h4>
                                <p className="text-sm font-bold text-foreground/70 uppercase tracking-widest mt-1">Tahun</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-serif font-bold text-primary">350+</h4>
                                <p className="text-sm font-bold text-foreground/70 uppercase tracking-widest mt-1">Alumni</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-serif font-bold text-primary">20+</h4>
                                <p className="text-sm font-bold text-foreground/70 uppercase tracking-widest mt-1">Kegiatan</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Arched Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="relative w-full max-w-md mx-auto lg:ml-auto"
                    >
                        {/* Decorative Badge */}
                        <div className="absolute -top-8 -left-8 z-20 bg-[#f5f3eb] dark:bg-[#25211f] rounded-full border-2 border-foreground retro-shadow w-28 h-28 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-foreground">
                                <path id="curve" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                                <text className="text-[14px] font-bold font-sans uppercase tracking-widest fill-current">
                                    <textPath href="#curve" startOffset="0">
                                        • PMK MIPA • FST UNDANA
                                    </textPath>
                                </text>
                            </svg>
                        </div>

                        {/* Arched Frame */}
                        <div className="relative aspect-[3/4] w-full rounded-t-full rounded-b-none overflow-hidden border-4 border-foreground retro-shadow-lg bg-white dark:bg-[#25211f]">
                            <Image
                                src="/images/hero-bg.jpg"
                                alt="Kegiatan PMK MIPA"
                                fill
                                className="object-cover sepia-[0.2] hover:sepia-0 transition-all duration-700"
                                priority
                            />
                            {/* Inner Arch border decoration */}
                            <div className="absolute inset-4 rounded-t-full border-2 border-dashed border-white/50 pointer-events-none" />
                        </div>

                        {/* Floating Small Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="absolute bottom-10 -left-12 bg-zinc-900 text-[#f5f3eb] dark:bg-[#25211f] dark:text-[#f5f3eb] p-4 border-2 border-foreground retro-shadow w-48 hidden md:block"
                        >
                            <h5 className="font-serif font-bold text-lg mb-1">Berakar & Bertumbuh</h5>
                            <p className="text-xs opacity-80">Menjadi berkat bagi sesama mahasiswa di FST Undana.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
