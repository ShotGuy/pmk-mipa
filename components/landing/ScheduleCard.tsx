import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, CalendarPlus } from "lucide-react";

type ScheduleType = "friday" | "tuesday";

interface ScheduleCardProps {
    type: ScheduleType;
    title: string;
    time: string;
    location: string;
    description: string;
}

export function ScheduleCard({ type, title, time, location, description }: ScheduleCardProps) {
    const isFriday = type === "friday";

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
    )}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    return (
        <div
            className={cn(
                "relative overflow-hidden border-4 border-foreground p-6 sm:p-8 transition-transform hover:-translate-y-2 flex flex-col justify-between retro-shadow hover:retro-shadow-lg",
                isFriday
                    ? "bg-[#f5f3eb] dark:bg-[#25211f]"
                    : "bg-white dark:bg-[#25211f]"
            )}
        >
            <div className="relative z-10 space-y-6">
                <span
                    className={cn(
                        "inline-block px-4 py-1.5 text-xs font-serif font-bold uppercase tracking-[0.2em] border-2 border-foreground retro-shadow-sm",
                        isFriday ? "bg-primary text-foreground" : "bg-zinc-900 text-[#f5f3eb] dark:bg-[#191715] dark:text-primary"
                    )}
                >
                    {isFriday ? "Ibadah Raya Jumat" : "Persekutuan Doa"}
                </span>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground leading-snug">{title}</h3>

                <div className="space-y-4 text-foreground/80 text-sm font-serif font-bold">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 shrink-0 text-primary" />
                        <span className="uppercase tracking-widest">{time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 shrink-0 text-primary" />
                        <span className="uppercase tracking-widest">{location}</span>
                    </div>
                    <div className="flex items-start gap-3 pt-2">
                        <Calendar className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <p className="leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>

            {/* Add to Calendar Button */}
            <div className="relative z-10 pt-6 mt-6 border-t-2 border-dashed border-foreground/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-foreground bg-white dark:bg-[#191715] hover:bg-primary transition-colors text-xs font-serif font-bold uppercase tracking-widest text-foreground retro-shadow-sm cursor-pointer w-full sm:w-auto"
                >
                    <CalendarPlus className="w-4 h-4 shrink-0" />
                    <span>Simpan ke Kalender</span>
                </a>

                <span className="text-xs text-foreground/80 uppercase tracking-[0.2em] font-serif font-bold text-center sm:text-right">
                    Rutin Mingguan
                </span>
            </div>
        </div>
    );
}
