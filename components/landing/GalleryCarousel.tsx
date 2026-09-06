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
            <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
                <div className="flex touch-pan-y -ml-6">
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_85%] sm:flex-[0_0_55%] md:flex-[0_0_45%] min-w-0 pl-6 relative"
                        >
                            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-border group/card">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
                                        <Sparkles className="w-3 h-3" />
                                        {item.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10 space-y-1">
                                    <h4 className="font-serif font-bold text-lg leading-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-300 line-clamp-2">
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
                className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-xl bg-card/90 backdrop-blur-sm border border-border z-20"
                onClick={scrollPrev}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-xl bg-card/90 backdrop-blur-sm border border-border z-20"
                onClick={scrollNext}
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );
}
