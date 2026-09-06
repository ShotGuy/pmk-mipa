"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">Sejarah Kami</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                <div className="relative mx-auto max-w-4xl">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />

                    <div className="space-y-12">
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
                "relative flex items-center justify-between gap-8 md:gap-16",
                isEven ? "flex-row-reverse" : ""
            )}
        >
            {/* Content Side */}
            <div className={cn("hidden md:block w-1/2", isEven ? "text-right" : "text-left")}>
                <span className="text-6xl font-serif font-bold text-primary/10 select-none absolute top-0 -z-10 w-full">
                    {event.year}
                </span>
            </div>

            {/* Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background z-10" />

            {/* Card Side */}
            <div className="w-full md:w-1/2 pl-12 md:pl-0">
                <div className={cn(
                    "bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow relative",
                    "before:absolute before:top-6 before:w-4 before:h-0.5 before:bg-border md:before:hidden", // Mobile line to dot
                    "after:hidden md:block after:absolute after:top-1/2 after:-translate-y-1/2 after:w-8 after:h-0.5 after:bg-border", // Desktop connector
                    isEven ? "md:mr-12 md:after:left-full md:after:ml-4" : "md:ml-12 md:after:right-full md:after:mr-4"
                )}>
                    {/* Mobile Year */}
                    <span className="md:hidden text-primary font-bold mb-2 block">{event.year}</span>

                    <h3 className="text-xl font-bold mb-2 text-foreground">{event.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {event.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
