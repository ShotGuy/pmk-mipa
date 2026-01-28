"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function DateTimeWidget() {
    const [date, setDate] = useState<Date | null>(null)

    useEffect(() => {
        setDate(new Date())
        const timer = setInterval(() => setDate(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (!date) {
        return null // Prevent hydration mismatch
    }

    // Greeting Logic
    const hour = date.getHours()
    let greeting = ""
    let Icon = Sun

    if (hour >= 5 && hour < 11) {
        greeting = "Selamat Pagi"
        Icon = Sun
    } else if (hour >= 11 && hour < 15) {
        greeting = "Selamat Siang"
        Icon = Sun
    } else if (hour >= 15 && hour < 18) {
        greeting = "Selamat Sore"
        Icon = Sun
    } else {
        greeting = "Selamat Malam"
        Icon = Moon
    }

    // Date Format: Kamis, 29 Januari 2026
    const dateString = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date)

    // Time Format: 03.59.58 (using dot separator as requested/common in ID)
    const timeString = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(date).replace(/:/g, ".")

    // Timezone Name (e.g., WIB, WITA, WIT)
    // Intl.DateTimeFormat with timeZoneName: 'short' usually gives GMT+7 or similar fallback in some browsers
    // But 'id-ID' locale might give WIB/WITA. Let's try to extract or provide a generic fallback.
    const timezoneString = new Intl.DateTimeFormat("id-ID", {
        timeZoneName: "short"
    }).formatToParts(date).find(part => part.type === "timeZoneName")?.value || ""

    return (
        <div className="hidden md:flex items-center gap-4 bg-accent/40 backdrop-blur-md px-5 py-2 rounded-full border border-primary/20 text-sm font-medium shadow-sm transition-all hover:bg-accent/60 hover:border-primary/40 hover:shadow-md cursor-default text-foreground/80">
            {/* Greeting */}
            <div className="flex items-center gap-2 border-r border-primary/20 pr-4">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-foreground">{greeting}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 border-r border-primary/20 pr-4">
                <Calendar className="h-4 w-4 text-primary/70" />
                <span className="text-foreground">{dateString}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="tabular-nums font-semibold tracking-wide">
                    {timeString} <span className="text-xs text-muted-foreground ml-0.5">{timezoneString}</span>
                </span>
            </div>
        </div>
    )
}
