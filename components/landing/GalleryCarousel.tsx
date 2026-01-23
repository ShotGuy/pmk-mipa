"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const images = [
    "/docs/placeholder-gallery-1.jpg",
    "/docs/placeholder-gallery-2.jpg",
    "/docs/placeholder-gallery-3.jpg",
    "/docs/placeholder-gallery-4.jpg",
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
        <div className="relative group">
            <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                <div className="flex touch-pan-y -ml-4">
                    {images.map((src, index) => (
                        <div key={index} className="flex-[0_0_80%] md:flex-[0_0_40%] min-w-0 pl-4 relative aspect-video">
                            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md">
                                <Image
                                    src={src}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={scrollPrev}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={scrollNext}
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );
}
