"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
    className?: string
    date?: DateRange
    onDateChange?: (date: DateRange | undefined) => void
    label?: string
    placeholder?: string
}

export function DateRangePicker({
    className,
    date,
    onDateChange,
    label = "Periode Laporan",
    placeholder = "Pilih rentang tanggal",
}: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className={cn("grid gap-1.5", className)}>
            {label && (
                <label className="text-xs font-medium text-muted-foreground">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-1.5">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant="outline"
                            className={cn(
                                "w-full sm:w-[260px] justify-start text-left font-normal h-10 bg-card border shadow-xs hover:bg-accent",
                                !date?.from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate text-xs sm:text-sm">
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "MMM dd, yyyy")} -{" "}
                                            {format(date.to, "MMM dd, yyyy")}
                                        </>
                                    ) : (
                                        format(date.from, "MMM dd, yyyy")
                                    )
                                ) : (
                                    placeholder
                                )}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 shadow-lg border rounded-xl" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from || new Date()}
                            selected={date}
                            onSelect={onDateChange}
                            numberOfMonths={2}
                        />
                        <div className="flex items-center justify-between p-3 border-t bg-muted/20">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground h-8"
                                onClick={() => {
                                    onDateChange?.(undefined)
                                }}
                            >
                                Reset Tanggal
                            </Button>
                            <Button
                                size="sm"
                                className="text-xs h-8"
                                onClick={() => setOpen(false)}
                            >
                                Terapkan
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                {date?.from && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground hover:text-foreground shrink-0"
                        onClick={() => onDateChange?.(undefined)}
                        title="Hapus filter tanggal"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
