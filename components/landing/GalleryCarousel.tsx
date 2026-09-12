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
        title: "Retreat & Ibadah Padang",
        category: "Kebersamaan",
        image: "/images/hero-bg.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
        title: "Ibadah Raya Mahasiswa",
        category: "Ibadah Mingguan",
        image: "/images/hero-bg.jpg",
        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    },
    {
        title: "Aksi Sosial & Peduli Sesama",
        category: "Bakti Sosial",
        image: "/images/hero-bg.jpg",
        description: "Excepteur sint occaecat cupidatat non proident sunt in culpa.",
    },
    {
        title: "Kelompok Tumbuh Bersama (KTB)",
        category: "Pemuridan",
        image: "/images/hero-bg.jpg",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
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
                            <div className="relative w-full aspect-[4/3] rounded-t-[1000px] overflow-hidden border-4 border-foreground retro-shadow bg-white group/card transition-transform duration-300 hover:-translate-y-2 hover:retro-shadow-lg">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover/card:scale-105 transition-transform duration-500 sepia-[0.2] group-hover/card:sepia-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                                {/* Category Badge */}
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                                    <span className="inline-flex items-center gap-2 text-[10px] font-serif font-bold uppercase tracking-widest px-4 py-1.5 bg-white border-2 border-foreground text-foreground retro-shadow-sm">
                                        <Sparkles className="w-3 h-3 text-primary" />
                                        {item.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 space-y-2 text-center border-t-2 border-dashed border-white/30 bg-black/40 backdrop-blur-sm">
                                    <h4 className="font-serif font-bold text-xl leading-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-white/80 font-serif font-bold uppercase tracking-wide">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 rounded-none bg-white text-foreground border-2 border-foreground hover:bg-primary transition-colors retro-shadow-sm z-20 w-12 h-12"
                onClick={scrollPrev}
            >
                <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 rounded-none bg-white text-foreground border-2 border-foreground hover:bg-primary transition-colors retro-shadow-sm z-20 w-12 h-12"
                onClick={scrollNext}
            >
                <ChevronRight className="w-6 h-6" />
            </Button>
        </div>
    );
}
