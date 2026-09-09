"use client"

import {
    LayoutDashboard,
    Wallet,
    QrCode,
    // LogOut,
    // Menu,
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
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useState } from "react"
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

export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: [
            "ADMIN",
            "KETUA",
            "SEKRETARIS",
            "BENDAHARA",
            "KOORKTB",
            "ANGGOTAKTB",
            "KOORACARA",
            "ANGGOTAACARA",
            "KOORDOA",
            "ANGGOTADOA",
        ],
    },
    {
        title: "Manajemen User",
        href: "/admin/users",
        icon: Users,
        roles: ["ADMIN"],
    },
    {
        title: "Badan Pengurus",
        href: "/admin/badan-pengurus",
        icon: Briefcase,
        roles: ["ADMIN", "KETUA"],
    },
    {
        title: "Data Anggota",
        href: "/admin/anggota",
        icon: UserCog,
        roles: [
            "ADMIN",
            "KETUA",
            "SEKRETARIS",
            "BENDAHARA",
            "KOORKTB",
            "ANGGOTAKTB",
            "KOORDOA",
            "ANGGOTADOA",
        ],
    },
    {
        title: "Data KTB",
        href: "/admin/ktb",
        icon: Network,
        roles: ["ADMIN", "KETUA", "KOORKTB", "ANGGOTAKTB"],
    },
    {
        title: "Pengontrolan KTB",
        href: "/admin/pengontrolan",
        icon: BookOpenCheck,
        roles: ["ADMIN", "KETUA", "KOORKTB", "ANGGOTAKTB"],
    },
    {
        title: "HPDT",
        href: "/admin/hpdt",
        icon: ScrollText,
        roles: [
            "ADMIN",
            "KETUA",
            "SEKRETARIS",
            "BENDAHARA",
            "KOORDOA",
            "ANGGOTADOA",
            "KOORKTB",
            "ANGGOTAKTB",
        ],
    },
    {
        title: "Jenis Kegiatan",
        href: "/admin/jenis-kegiatan",
        icon: Palette,
        roles: ["ADMIN", "KETUA", "SEKRETARIS", "KOORACARA", "ANGGOTAACARA"],
    },
    {
        title: "Kegiatan",
        href: "/admin/kegiatan",
        icon: CalendarDays,
        roles: ["ADMIN", "KETUA", "SEKRETARIS", "KOORACARA", "ANGGOTAACARA"],
    },
    {
        title: "Kehadiran",
        href: "/admin/kehadiran",
        icon: QrCode,
        roles: ["ADMIN", "KETUA", "SEKRETARIS", "KOORACARA", "ANGGOTAACARA"],
    },
    {
        title: "Gallery",
        href: "/admin/gallery",
        icon: Camera,
        roles: ["ADMIN", "KETUA", "KOORACARA", "ANGGOTAACARA"],
    },
    {
        title: "Kas",
        href: "/admin/kas",
        icon: Wallet,
        roles: ["ADMIN", "KETUA", "BENDAHARA"],
    },
    {
        title: "Transaksi",
        href: "/admin/transaksi",
        icon: Receipt,
        roles: ["ADMIN", "KETUA", "BENDAHARA"],
    },
]

export function AppSidebar({ user }: AppSidebarProps) {
    const pathname = usePathname()
    // Mobile logic moved to AdminHeader, but we need setOpen for desktop NavContent if it's used there? 
    // Actually desktop sidebar doesn't need setOpen to close anything.
    // However, NavContent expects it. We can pass a no-op or reuse state if needed, but for desktop it stays open.
    const [, setOpen] = useState(false)

    const filteredNav = navItems.filter(item => item.roles.includes(user.role))

    return (
        <aside className="hidden md:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
            <NavContent
                filteredNav={filteredNav}
                pathname={pathname}
                user={user}
                setOpen={setOpen} // No-op on desktop technically
            />
        </aside>
    )
}

export function NavContent({
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
                <Link href="/" className="flex items-center gap-2.5 font-serif font-bold text-xl text-primary">
                    <Image
                        src="/logo.png"
                        alt="Logo PMK MIPA"
                        width={32}
                        height={32}
                        className="object-contain shrink-0"
                    />
                    <span>PMK MIPA</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
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
            </div>
        </div>
    )
}

