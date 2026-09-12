"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GallerySlide {
    title: string;
    category: string;
    image: string;
    description: string;
}

const galleryItems: GallerySlide[] = [
    {
        title: "Kamp Regenerasi 2024",
        category: "Regenerasi",
        image: "/images/regenerasi-2024.jpg",
        description: "Kamp Regenerasi Badan Pengurus Bello, 7 - 9 Juni 2024",
    },
    {
        title: "Persekutuan Doa",
        category: "Persekutuan Doa",
        image: "/images/persekutuan-doa-bp.jpg",
        description: "Persekutuan Doa BP Bersama Kak Inda Jacob",
    },
    {
        title: "The End of Me",
        category: "Regenerasi",
        image: "/images/bp-2024.jpg",
        description: "Badan Pengurus 2024/2025",
    },
    {
        title: "Visitasi Badan Pengurus",
        category: "Visitasi",
        image: "/images/visitasi-bp.jpg",
        description: "Visitasi Ke Rumah salah Seorang Badan Pengurus",
    },
    {
        title: "Training Penatalayan",
        category: "Training PL",
        image: "/images/training-pl-2026.jpg",
        description: "Training Penatalayan Februari 2026",
    },
    {
        title: "KTB Recharge",
        category: "KTB Recharge",
        image: "/images/ktb-recharge-2025.JPG",
        description: "KTB Recharge September 2025",
    },
    {
        title: "KTB Recharge",
        category: "KTB Recharge",
        image: "/images/ktb-recharge-2026.jpeg",
        description: "KTB Recharge Februari 2026",
    },
];

export function GalleryCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="relative group max-w-5xl mx-auto">
            <div className="overflow-visible" ref={emblaRef}>
                <div className="flex touch-pan-y -ml-6 pb-6">
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_85%] sm:flex-[0_0_55%] md:flex-[0_0_45%] min-w-0 pl-6 relative"
                        >
                            <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-t-[1000px] overflow-hidden border-4 border-foreground retro-shadow bg-white dark:bg-[#25211f] group/card transition-transform duration-300 hover:-translate-y-2 hover:retro-shadow-lg">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover/card:scale-105 transition-transform duration-500 sepia-[0.2] group-hover/card:sepia-0"
                                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 55vw, 45vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                                {/* Category Badge */}
                                <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                                    <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] font-serif font-bold uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 bg-white/95 dark:bg-[#191715]/95 backdrop-blur-sm border-2 border-foreground text-foreground retro-shadow-sm">
                                        <Sparkles className="w-3 h-3 text-primary" />
                                        {item.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white z-10 space-y-1 sm:space-y-2 text-center">
                                    <h4 className="font-serif font-bold text-lg sm:text-xl leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                        {item.title}
                                    </h4>
                                    <p className="hidden sm:block text-xs text-white/85 font-serif font-bold uppercase tracking-wide drop-shadow">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Navigation Buttons */}
            <Button
                variant="secondary"
                size="icon"
                className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 rounded-none bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground hover:bg-primary dark:hover:text-zinc-900 transition-colors retro-shadow-sm z-20 w-12 h-12"
                onClick={scrollPrev}
                aria-label="Foto Sebelumnya"
            >
                <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
                variant="secondary"
                size="icon"
                className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 rounded-none bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground hover:bg-primary dark:hover:text-zinc-900 transition-colors retro-shadow-sm z-20 w-12 h-12"
                onClick={scrollNext}
                aria-label="Foto Selanjutnya"
            >
                <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Mobile Navigation Controls */}
            <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
                <Button
                    variant="secondary"
                    size="icon"
                    className="w-10 h-10 rounded-none bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground hover:bg-primary dark:hover:text-zinc-900 transition-colors retro-shadow-sm"
                    onClick={scrollPrev}
                    aria-label="Foto Sebelumnya"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-xs font-serif font-bold uppercase tracking-widest text-foreground/70">
                    ← Geser Foto →
                </span>
                <Button
                    variant="secondary"
                    size="icon"
                    className="w-10 h-10 rounded-none bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground hover:bg-primary dark:hover:text-zinc-900 transition-colors retro-shadow-sm"
                    onClick={scrollNext}
                    aria-label="Foto Selanjutnya"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
