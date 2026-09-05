"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryHighlightItem } from "@/actions/landing";

interface MiniGalleryProps {
    galleries: GalleryHighlightItem[];
}

export function MiniGallery({ galleries }: MiniGalleryProps) {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 max-w-6xl mx-auto">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase border border-primary/20">
                            <Camera className="w-3.5 h-3.5 text-primary" />
                            <span>Momen & Dokumentasi</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                            Keseruan Hidup di <span className="text-primary">PMK MIPA</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl text-base">
                            Setiap tawa, doa bersama, dan proses bertumbuh terekam dalam perjalanan kasih yang tak terlupakan.
                        </p>
                    </div>

                    <Link href="/activities">
                        <Button variant="outline" className="rounded-full px-6 hover:border-primary shrink-0">
                            Jelajahi Semua Galeri
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {/* Gallery Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {galleries.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            {/* Photo with Overlay */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                                {/* Category Tag */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground shadow-sm">
                                        <Sparkles className="w-3 h-3" />
                                        {item.category}
                                    </span>
                                </div>

                                {/* Title & Subtitle at bottom of image */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 space-y-1">
                                    <h3 className="font-serif font-bold text-base leading-tight group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-300 line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
