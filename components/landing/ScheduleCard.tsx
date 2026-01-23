import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin } from "lucide-react";

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

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border-2 p-8 transition-transform hover:-translate-y-1 hover:shadow-lg",
                isFriday
                    ? "border-primary bg-primary/5 hover:shadow-primary/20"
                    : "border-secondary bg-secondary/5 hover:shadow-secondary/20"
            )}
        >
            {/* Decorative Circle */}
            <div
                className={cn(
                    "absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10",
                    isFriday ? "bg-primary" : "bg-secondary"
                )}
            />

            <div className="relative z-10">
                <span
                    className={cn(
                        "mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                        isFriday ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    )}
                >
                    {isFriday ? "Ibadah Jumat" : "Doa Selasa"}
                </span>

                <h3 className="mb-4 text-2xl font-serif font-bold">{title}</h3>

                <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 shrink-0 text-foreground" />
                        <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 shrink-0 text-foreground" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 shrink-0 text-foreground mt-1" />
                        <p className="leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
