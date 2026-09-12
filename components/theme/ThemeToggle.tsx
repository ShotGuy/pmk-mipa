"use client";

import * as React from "react";
import { Moon, Sun, Laptop, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className={cn("w-10 h-10 rounded-full border-2 border-foreground bg-background text-muted-foreground", className)}
                aria-label="Pilih tema tampilan"
            >
                <Sun className="h-[1.15rem] w-[1.15rem]" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "relative w-10 h-10 rounded-full border-2 border-foreground bg-background hover:bg-primary/20 text-foreground transition-all duration-200 retro-shadow-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer",
                        className
                    )}
                    aria-label="Pilih tema tampilan"
                >
                    <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all text-amber-500 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all text-amber-400 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px] border-2 border-foreground bg-popover text-popover-foreground retro-shadow-sm font-serif">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="flex items-center justify-between cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-amber-500" />
                        <span>Terang</span>
                    </span>
                    {theme === "light" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="flex items-center justify-between cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-amber-400" />
                        <span>Gelap</span>
                    </span>
                    {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="flex items-center justify-between cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-muted-foreground" />
                        <span>Sistem</span>
                    </span>
                    {theme === "system" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
