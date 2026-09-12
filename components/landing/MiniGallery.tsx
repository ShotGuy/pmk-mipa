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
        <section className="py-16 md:py-32 bg-transparent relative overflow-hidden border-t-2 border-foreground/10">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-6 md:gap-8">
                    <div className="space-y-4 md:space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-[#f5f3eb] dark:bg-[#25211f] dark:text-primary border-2 border-foreground text-xs font-serif font-bold uppercase tracking-widest retro-shadow-sm">
                            <Camera className="w-4 h-4 text-primary" />
                            <span>Momen & Dokumentasi</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                            Keseruan Hidup di <span className="text-primary italic font-light">PMK MIPA</span>
                        </h2>
                        <p className="text-foreground/80 text-base md:text-lg font-serif max-w-xl">
                            Setiap tawa, doa bersama, dan proses bertumbuh terekam dalam perjalanan kasih yang tak terlupakan.
                        </p>
                    </div>

                    <Link href="/activities" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground hover:bg-primary dark:hover:text-zinc-900 text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 rounded-full font-serif font-bold transition-all duration-200 retro-shadow hover:translate-y-1 hover:shadow-none group">
                            Semua Galeri
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Gallery Cards: Horizontal Snap Carousel on Mobile, Grid on Desktop */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 pt-2 px-4 sm:px-6 -mx-4 sm:-mx-6 md:mx-0 md:px-0 md:pb-0 md:pt-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {galleries.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                            className="flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-auto md:w-full snap-center md:snap-align-none shrink-0 md:shrink group relative"
                        >
                            {/* Decorative Sparkle for every alternate item (desktop only) */}
                            {index % 2 === 1 && (
                                <div className="hidden md:block absolute -top-8 -right-4 z-20 text-primary pointer-events-none">
                                    <Sparkles className="w-8 h-8" strokeWidth={1.5} />
                                </div>
                            )}

                            {/* Photo Arch Frame */}
                            <div className="aspect-[3/4] relative overflow-hidden bg-white dark:bg-[#25211f] border-3 sm:border-4 border-foreground rounded-t-full rounded-b-none retro-shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:retro-shadow group-hover:border-primary">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover sepia-[0.3] md:sepia-[0.3] transition-all duration-700 md:group-hover:sepia-0 md:group-hover:scale-110"
                                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                                />

                                {/* Category Badge */}
                                {item.category && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 dark:bg-[#191715]/95 backdrop-blur-sm border-2 border-foreground text-foreground text-[10px] font-serif font-bold uppercase tracking-widest retro-shadow-sm">
                                            <Sparkles className="w-3 h-3 text-primary shrink-0" />
                                            {item.category}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Inner border detail */}
                                <div className="absolute inset-2.5 sm:inset-3 rounded-t-full border-2 border-dashed border-white/50 pointer-events-none" />

                                {/* Dark Gradient Overlay for title readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-85 md:opacity-0 md:group-hover:opacity-95 transition-opacity duration-500" />

                                {/* Title at bottom: always visible on mobile, reveals on hover on desktop */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 text-center z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500">
                                    <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Swipe Hint */}
                <div className="flex md:hidden items-center justify-center gap-2 mt-4 text-xs font-serif font-bold text-foreground/70">
                    <span className="w-6 h-[1.5px] bg-foreground/30" />
                    <span>← Geser untuk melihat foto lainnya →</span>
                    <span className="w-6 h-[1.5px] bg-foreground/30" />
                </div>
            </div>
        </section>
    );
}
