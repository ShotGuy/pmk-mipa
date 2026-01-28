"use client"

import {
    LayoutDashboard,
    Wallet,
    QrCode,
    FileSpreadsheet,
    ShieldCheck,
    LogOut,
    Menu,
    Users,
    UserCog,
    Network,
    BookOpenCheck,
    Briefcase,
    ScrollText,
    CalendarDays,
    Palette,
    Camera,
    Receipt
} from "lucide-react"
import { logout } from "@/actions/auth-actions"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { Role } from "@prisma/client"

interface AppSidebarProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
        role: Role
    }
}

interface NavItem {
    title: string
    href: string
    icon: React.ElementType
    roles: Role[]
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: ["ADMIN"]
    },
    {
        title: "User Management",
        href: "/admin/user",
        icon: Users,
        roles: ["ADMIN"]
    },
    {
        title: "Data Anggota",
        href: "/admin/anggota",
        icon: UserCog,
        roles: ["ADMIN"]
    },
    {
        title: "Data KTB",
        href: "/admin/ktb",
        icon: Network,
        roles: ["ADMIN"]
    },
    {
        title: "Pengontrolan KTB",
        href: "/admin/pengontrolan",
        icon: BookOpenCheck,
        roles: ["ADMIN"]
    },
    {
        title: "Badan Pengurus",
        href: "/admin/badan-pengurus",
        icon: Briefcase,
        roles: ["ADMIN"]
    },
    {
        title: "HPDT",
        href: "/admin/hpdt",
        icon: ScrollText,
        roles: ["ADMIN"]
    },
    {
        title: "Jenis Kegiatan",
        href: "/admin/jenis-kegiatan",
        icon: Palette,
        roles: ["ADMIN"]
    },
    {
        title: "Kegiatan",
        href: "/admin/kegiatan",
        icon: CalendarDays,
        roles: ["ADMIN"]
    },
    {
        title: "Gallery",
        href: "/admin/gallery",
        icon: Camera,
        roles: ["ADMIN"]
    },
    {
        title: "Kehadiran",
        href: "/admin/kehadiran",
        icon: QrCode,
        roles: ["ADMIN"]
    },
    {
        title: "Kas",
        href: "/admin/kas",
        icon: Wallet,
        roles: ["ADMIN"]
    },
    {
        title: "Transaksi",
        href: "/admin/transaksi",
        icon: Receipt,
        roles: ["ADMIN"]
    },
]

export function AppSidebar({ user }: AppSidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const filteredNav = navItems.filter(item => item.roles.includes(user.role))

    if (!isMounted) {
        return (
            <aside className="hidden md:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
                <NavContent
                    filteredNav={filteredNav}
                    pathname={pathname}
                    user={user}
                    setOpen={setOpen}
                />
            </aside>
        )
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
                <NavContent
                    filteredNav={filteredNav}
                    pathname={pathname}
                    user={user}
                    setOpen={setOpen}
                />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden sticky top-0 z-40 bg-background border-b px-4 h-16 flex items-center justify-between">
                <span className="font-serif font-bold text-lg">Dashboard</span>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
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
        </>
    )
}

function NavContent({
    filteredNav,
    pathname,
    user,
    setOpen
}: {
    filteredNav: NavItem[],
    pathname: string,
    user: AppSidebarProps["user"],
    setOpen: (open: boolean) => void
}) {
    return (
        <div className="flex flex-col h-full py-4">
            <div className="px-6 mb-8">
                <Link href="/" className="flex items-center gap-2 font-serif font-bold text-xl text-primary">
                    <span>PMK MIPA</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {filteredNav.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-secondary/50",
                            pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")
                                ? "bg-secondary text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="px-4 mt-auto">
                <div className="flex items-center gap-3 px-4 py-4 rounded-lg bg-secondary/30 mb-2">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{user.role.toLowerCase()}</p>
                    </div>
                </div>
                <form action={logout}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive" type="submit">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )
}

