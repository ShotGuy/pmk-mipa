"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Globe, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { logout } from "@/actions/auth-actions"
import { NavContent, navItems } from "./AppSidebar"
import { Role } from "@prisma/client"
import { usePathname } from "next/navigation"
import { DateTimeWidget } from "./DateTimeWidget"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

interface AdminHeaderProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
        role: Role
    }
}

export function AdminHeader({ user }: AdminHeaderProps) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const filteredNav = navItems.filter(item => item.roles.includes(user.role))

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-6 shadow-sm justify-between">
            {/* Left Side: Mobile Menu & DateTime Widget */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger */}
                <div className="md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-ml-2">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <NavContent
                                filteredNav={filteredNav}
                                pathname={pathname}
                                user={user}
                                setOpen={setOpen}
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop: Date Time Widget */}
                <DateTimeWidget />

                {/* Mobile Dashboard Title (Visible only on mobile to give context) */}
                <span className="md:hidden font-serif font-bold text-lg">Dashboard</span>
            </div>

            {/* Right Side: Theme Toggle, Back to Landing Page & Sign Out */}
            <div className="flex items-center gap-2">
                <ThemeToggle />

                {/* Desktop: Globe Icon for Landing Page */}
                <Button asChild variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary" title="Back to Landing Page">
                    <Link href="/" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-5 w-5" />
                    </Link>
                </Button>

                {/* Mobile: Globe Icon for Landing Page */}
                <Button asChild variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-primary">
                    <Link href="/" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-5 w-5" />
                    </Link>
                </Button>

                <form action={logout}>
                    <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground hover:text-destructive">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-destructive" type="submit">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </header>
    )
}
