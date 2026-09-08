import authConfig from "@/auth.config"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = ["/", "/login", "/register", "/about", "/activities", "/contact"].some(route => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/"))
    const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register"
    // Protected Routes (formerly Dashboard)
    const protectedPaths = ["/admin", "/finance", "/reporting", "/attendance"];
    const isProtectedRoute = protectedPaths.some(path => nextUrl.pathname.startsWith(path));

    // Allow API auth routes
    if (isApiAuthRoute) {
        return NextResponse.next()
    }

    // Redirect logged in users away from auth pages
    if (isAuthRoute) {
        if (isLoggedIn) {
            // Redirect to their respective dashboard based on role?
            // For now, let's redirect to /admin if admin, else /attendance (safe default)
            // But we don't have role here easily without decoding payload?
            // We do have req.auth from `auth` wrapper.
            const role = req.auth?.user.role;
            if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
            return NextResponse.redirect(new URL("/attendance", nextUrl));
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

    // Role based protection
    if (isProtectedRoute && isLoggedIn) {
        const role = req.auth?.user.role

        // 1. Finance Guard (Admin, Ketua, Bendahara)
        if (nextUrl.pathname.startsWith("/finance")) {
            if (!["ADMIN", "KETUA", "BENDAHARA"].includes(role as string)) {
                return NextResponse.redirect(new URL("/", nextUrl))
            }
        }

        // 2. Reporting Guard (Admin, Ketua, Bendahara)
        if (nextUrl.pathname.startsWith("/reporting")) {
            if (!["ADMIN", "KETUA", "BENDAHARA"].includes(role as string)) {
                return NextResponse.redirect(new URL("/", nextUrl))
            }
        }

        // 3. Admin Guard (Only Admin)
        if (nextUrl.pathname.startsWith("/admin")) {
            if (role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", nextUrl))
            }
        }

        // 4. Attendance is open to all BADAN PENGURUS
    }

    return NextResponse.next()
})


// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
