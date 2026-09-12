"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UpcomingEventItem } from "@/actions/landing";

interface UpcomingEventsProps {
    events: UpcomingEventItem[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
    return (
        <section className="py-32 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b-4 border-foreground pb-12">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-foreground text-foreground text-xs font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>Agenda & Ibadah</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                            Kegiatan <span className="text-primary italic font-light">Mendatang</span>
                        </h2>
                        <p className="text-foreground/80 text-lg font-serif max-w-xl">
                            Mari bergabung bersama kami dalam persekutuan doa, ibadah raya mingguan, dan acara kebersamaan lainnya.
                        </p>
                    </div>

                    <Link href="/activities">
                        <Button className="bg-primary text-foreground border-2 border-foreground hover:bg-primary/80 text-lg px-8 py-7 rounded-full font-serif font-bold transition-all duration-200 retro-shadow hover:translate-y-1 hover:shadow-none group">
                            Lihat Jadwal
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Events Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {events.map((event, index) => {
                        const isFriday = event.type === "friday";
                        const isTuesday = event.type === "tuesday";

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                                className="group flex flex-col justify-between bg-white border-4 border-foreground p-8 retro-shadow-lg transition-transform hover:-translate-y-2 hover:retro-shadow relative"
                            >
                                {/* Decorative pin */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full border-2 border-foreground retro-shadow z-10 hidden md:block"></div>

                                <div className="space-y-6">
                                    {/* Badge & Date */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <span
                                            className={`inline-flex items-center justify-center px-4 py-2 border-2 border-foreground text-xs font-serif font-bold uppercase tracking-wider retro-shadow-sm ${
                                                isFriday
                                                    ? "bg-primary text-foreground"
                                                    : isTuesday
                                                    ? "bg-[#f5f3eb] text-foreground"
                                                    : "bg-white text-foreground"
                                            }`}
                                        >
                                            {event.badgeText}
                                        </span>

                                        <span className="text-sm font-bold text-foreground/80 font-serif flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" strokeWidth={2.5} />
                                            {event.date}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-3xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                        {event.title}
                                    </h3>

                                    {/* Details */}
                                    <div className="space-y-4 text-foreground/90 font-serif pt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 border-2 border-foreground bg-[#f5f3eb] flex items-center justify-center shrink-0 retro-shadow-sm">
                                                <Clock className="w-5 h-5 text-foreground" strokeWidth={2} />
                                            </div>
                                            <span className="font-bold">{event.time}</span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 border-2 border-foreground bg-[#f5f3eb] flex items-center justify-center shrink-0 retro-shadow-sm">
                                                <MapPin className="w-5 h-5 text-foreground" strokeWidth={2} />
                                            </div>
                                            <span className="font-bold truncate">{event.location}</span>
                                        </div>

                                        {event.speaker && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 border-2 border-foreground bg-[#f5f3eb] flex items-center justify-center shrink-0 retro-shadow-sm">
                                                    <User className="w-5 h-5 text-foreground" strokeWidth={2} />
                                                </div>
                                                <span className="font-bold truncate">{event.speaker}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-foreground/70 leading-relaxed font-serif line-clamp-3 pt-6 border-t-2 border-foreground/10">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Action */}
                                <div className="pt-8 mt-8 border-t-2 border-foreground/10 flex items-center justify-between">
                                    <span className="text-xs font-bold text-foreground flex items-center gap-2 bg-primary px-3 py-1.5 border-2 border-foreground retro-shadow-sm font-serif">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Terbuka Umum
                                    </span>
                                    <Link href="/activities" className="text-sm font-serif font-bold text-foreground hover:text-primary flex items-center gap-2 group-hover:translate-x-1 transition-all">
                                        Detail
                                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
