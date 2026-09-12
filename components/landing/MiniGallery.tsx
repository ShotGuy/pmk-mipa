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
        <section className="py-32 bg-transparent relative overflow-hidden border-t-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-[#f5f3eb] border-2 border-foreground text-xs font-serif font-bold uppercase tracking-widest retro-shadow-sm">
                            <Camera className="w-4 h-4 text-primary" />
                            <span>Momen & Dokumentasi</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                            Keseruan Hidup di <span className="text-primary italic font-light">PMK MIPA</span>
                        </h2>
                        <p className="text-foreground/80 text-lg font-serif max-w-xl">
                            Setiap tawa, doa bersama, dan proses bertumbuh terekam dalam perjalanan kasih yang tak terlupakan.
                        </p>
                    </div>

                    <Link href="/activities">
                        <Button className="bg-white text-foreground border-2 border-foreground hover:bg-primary text-lg px-8 py-7 rounded-full font-serif font-bold transition-all duration-200 retro-shadow hover:translate-y-1 hover:shadow-none group">
                            Semua Galeri
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Gallery Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8">
                    {galleries.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                            className="group relative"
                        >
                            {/* Decorative Sparkle for every alternate item */}
                            {index % 2 === 1 && (
                                <div className="absolute -top-8 -right-4 z-20 text-primary">
                                    <Sparkles className="w-8 h-8" strokeWidth={1.5} />
                                </div>
                            )}

                            {/* Photo Arch Frame */}
                            <div className="aspect-[3/4] relative overflow-hidden bg-white border-4 border-foreground rounded-t-full rounded-b-none retro-shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:retro-shadow group-hover:border-primary">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover sepia-[0.3] transition-all duration-700 group-hover:sepia-0 group-hover:scale-110"
                                />
                                
                                {/* Inner border detail */}
                                <div className="absolute inset-3 rounded-t-full border-2 border-dashed border-white/50 pointer-events-none" />

                                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500" />

                                {/* Title at bottom of image, appears on hover */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <h3 className="font-serif font-bold text-2xl leading-tight text-white">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
