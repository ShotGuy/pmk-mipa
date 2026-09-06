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
                "relative overflow-hidden rounded-3xl border-2 p-8 transition-all hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between",
                isFriday
                    ? "border-primary/50 bg-primary/5 hover:shadow-primary/10"
                    : "border-secondary/30 bg-secondary/5 hover:shadow-secondary/10"
            )}
        >
            {/* Decorative Circle */}
            <div
                className={cn(
                    "absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10",
                    isFriday ? "bg-primary" : "bg-secondary"
                )}
            />

            <div className="relative z-10 space-y-4">
                <span
                    className={cn(
                        "inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider",
                        isFriday ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    )}
                >
                    {isFriday ? "Ibadah Raya Jumat" : "Persekutuan Doa"}
                </span>

                <h3 className="text-2xl font-serif font-bold text-foreground">{title}</h3>

                <div className="space-y-3 text-muted-foreground text-sm">
                    <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 shrink-0 text-primary" />
                        <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 shrink-0 text-primary" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-start gap-3 pt-1">
                        <Calendar className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <p className="leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>

            {/* Add to Calendar Button */}
            <div className="relative z-10 pt-6 mt-6 border-t border-border/60 flex items-center justify-between">
                <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Simpan ke Kalender</span>
                </a>

                <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Rutin Mingguan
                </span>
            </div>
        </div>
    );
}
