import authConfig from "@/auth.config"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = [
        "/",
        "/login",
        "/register",
        "/about",
        "/activities",
        "/contact",
        "/presensi",
    ].some((route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/"))
    const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register"

    // Allow API auth routes
    if (isApiAuthRoute) {
        return NextResponse.next()
    }

    // Redirect logged in users away from auth pages
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
        }
        return NextResponse.next()
    }

    // Protect private routes
    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl)
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
    }

    // Redirect legacy routes to modern admin area
    if (nextUrl.pathname.startsWith("/finance")) {
        return NextResponse.redirect(new URL("/admin/kas", nextUrl))
    }
    if (nextUrl.pathname.startsWith("/attendance")) {
        return NextResponse.redirect(new URL("/admin/kehadiran", nextUrl))
    }
    if (nextUrl.pathname.startsWith("/reporting")) {
        return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
    }

    // Role-based protection for /admin routes
    if (nextUrl.pathname.startsWith("/admin") && isLoggedIn) {
        const role = req.auth?.user?.role as string

        // 1. User Management (Only ADMIN)
        if (nextUrl.pathname.startsWith("/admin/users")) {
            if (role !== "ADMIN") {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
            }
        }

        // 2. Badan Pengurus (ADMIN, KETUA)
        if (nextUrl.pathname.startsWith("/admin/badan-pengurus")) {
            if (!["ADMIN", "KETUA"].includes(role)) {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
            }
        }

        // 3. Kas & Transaksi (ADMIN, KETUA, BENDAHARA)
        if (
            nextUrl.pathname.startsWith("/admin/kas") ||
            nextUrl.pathname.startsWith("/admin/transaksi")
        ) {
            if (!["ADMIN", "KETUA", "BENDAHARA"].includes(role)) {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
            }
        }

        // 4. KTB & Pengontrolan (ADMIN, KETUA, KOORKTB, ANGGOTAKTB)
        if (
            nextUrl.pathname.startsWith("/admin/ktb") ||
            nextUrl.pathname.startsWith("/admin/pengontrolan")
        ) {
            if (!["ADMIN", "KETUA", "KOORKTB", "ANGGOTAKTB"].includes(role)) {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
            }
            // Khusus ANGGOTAKTB: Tidak diizinkan menambah KTB baru atau mengedit KTB
            if (role === "ANGGOTAKTB") {
                if (nextUrl.pathname === "/admin/ktb/new" || nextUrl.pathname.endsWith("/edit")) {
                    return NextResponse.redirect(new URL("/admin/ktb", nextUrl))
                }
            }
        }

        // 5. Kegiatan, Jenis Kegiatan, Kehadiran, Gallery (ADMIN, KETUA, KOORACARA, ANGGOTAACARA)
        if (
            nextUrl.pathname.startsWith("/admin/kegiatan") ||
            nextUrl.pathname.startsWith("/admin/jenis-kegiatan") ||
            nextUrl.pathname.startsWith("/admin/kehadiran") ||
            nextUrl.pathname.startsWith("/admin/gallery")
        ) {
            if (!["ADMIN", "KETUA", "KOORACARA", "ANGGOTAACARA"].includes(role)) {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
            }
        }

        // 6. HPDT (ADMIN, KETUA, KOORDOA, ANGGOTADOA, KOORKTB, ANGGOTAKTB)
        if (nextUrl.pathname.startsWith("/admin/hpdt")) {
            if (!["ADMIN", "KETUA", "KOORDOA", "ANGGOTADOA", "KOORKTB", "ANGGOTAKTB"].includes(role)) {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
            }
        }

        // 7. Data Anggota (ADMIN, KETUA, BENDAHARA, KOORKTB, ANGGOTAKTB, KOORDOA, ANGGOTADOA)
        if (nextUrl.pathname.startsWith("/admin/anggota")) {
            if (!["ADMIN", "KETUA", "BENDAHARA", "KOORKTB", "ANGGOTAKTB", "KOORDOA", "ANGGOTADOA"].includes(role)) {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
            }
        }
    }

    return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
