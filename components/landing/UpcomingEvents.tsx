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
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 max-w-6xl mx-auto">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase border border-primary/20">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>Agenda & Ibadah</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                            Kegiatan <span className="text-primary">Mendatang</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl text-base">
                            Mari bergabung bersama kami dalam persekutuan doa, ibadah raya mingguan, dan acara kebersamaan lainnya.
                        </p>
                    </div>

                    <Link href="/activities">
                        <Button variant="outline" className="rounded-full px-6 hover:border-primary shrink-0">
                            Lihat Jadwal Lengkap
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {/* Events Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {events.map((event, index) => {
                        const isFriday = event.type === "friday";
                        const isTuesday = event.type === "tuesday";

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`relative flex flex-col justify-between rounded-2xl border bg-card p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${
                                    isFriday
                                        ? "border-primary/40 hover:border-primary"
                                        : isTuesday
                                        ? "border-secondary/30 hover:border-secondary"
                                        : "border-border hover:border-primary/50"
                                }`}
                            >
                                <div className="space-y-5">
                                    {/* Badge & Date */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                                isFriday
                                                    ? "bg-primary text-primary-foreground"
                                                    : isTuesday
                                                    ? "bg-secondary text-secondary-foreground"
                                                    : "bg-accent text-accent-foreground border border-primary/20"
                                            }`}
                                        >
                                            {event.badgeText}
                                        </span>

                                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            {event.date}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-serif font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                                        {event.title}
                                    </h3>

                                    {/* Details */}
                                    <div className="space-y-2.5 text-sm text-muted-foreground pt-1">
                                        <div className="flex items-center gap-2.5">
                                            <Clock className="w-4 h-4 text-primary shrink-0" />
                                            <span>{event.time}</span>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>

                                        {event.speaker && (
                                            <div className="flex items-center gap-2.5">
                                                <User className="w-4 h-4 text-primary shrink-0" />
                                                <span className="truncate">{event.speaker}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground/90 line-clamp-3 pt-2 border-t border-border/50">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Action */}
                                <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between">
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Terbuka untuk Semua
                                    </span>
                                    <Link href="/activities" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                        Detail
                                        <ArrowRight className="w-3.5 h-3.5" />
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
