"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const timelineEvents = [
    {
        year: "1998",
        title: "Awal Mula Persekutuan Doa",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    },
    {
        year: "2005",
        title: "Peresmian Wadah PMK MIPA",
        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    },
    {
        year: "2012",
        title: "Gerakan Pemuridan (KTB)",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.",
    },
    {
        year: "2024",
        title: "Transformasi & Integrasi Digital",
        description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    },
];

export function Timeline() {
    return (
        <section className="py-24 relative overflow-hidden bg-transparent border-b-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-24 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-foreground text-foreground text-xs font-serif font-bold uppercase tracking-[0.2em] retro-shadow-sm mb-4">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Jejak Langkah</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground">Sejarah Kami</h2>
                    <p className="text-foreground/80 font-serif font-bold max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                <div className="relative mx-auto max-w-4xl">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-foreground" />

                    <div className="space-y-16">
                        {timelineEvents.map((event, index) => (
                            <TimelineItem key={index} event={event} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ event, index }: { event: { year: string; title: string; description: string }; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "relative flex items-center justify-between gap-8 md:gap-16 group",
                isEven ? "flex-row-reverse" : ""
            )}
        >
            {/* Content Side */}
            <div className={cn("hidden md:block w-1/2", isEven ? "text-right" : "text-left")}>
                <span className="text-7xl lg:text-8xl font-serif font-bold text-foreground/5 select-none absolute top-0 -z-10 w-full group-hover:text-primary/10 transition-colors duration-300">
                    {event.year}
                </span>
            </div>

            {/* Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-none bg-primary border-4 border-foreground z-10 group-hover:rotate-45 transition-transform duration-300" />

            {/* Card Side */}
            <div className="w-full md:w-1/2 pl-12 md:pl-0">
                <div className={cn(
                    "bg-[#f5f3eb] p-8 border-4 border-foreground retro-shadow transition-transform duration-300 group-hover:-translate-y-2 group-hover:retro-shadow-lg relative",
                    "before:absolute before:top-8 before:w-6 before:h-1 before:bg-foreground md:before:hidden", // Mobile line to dot
                    "after:hidden md:block after:absolute after:top-1/2 after:-translate-y-1/2 after:w-10 after:h-1 after:bg-foreground", // Desktop connector
                    isEven ? "md:mr-12 md:after:left-full" : "md:ml-12 md:after:right-full"
                )}>
                    {/* Mobile Year */}
                    <span className="md:hidden text-primary font-serif font-bold text-xl mb-3 block">{event.year}</span>
                    
                    <span className="hidden md:block text-primary font-serif font-bold text-2xl mb-2">{event.year}</span>

                    <h3 className="text-2xl font-bold font-serif mb-3 text-foreground">{event.title}</h3>
                    <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed uppercase tracking-wide">
                        {event.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
