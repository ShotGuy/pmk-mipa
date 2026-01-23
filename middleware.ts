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
    const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")

    // Allow API auth routes
    if (isApiAuthRoute) {
        return NextResponse.next()
    }

    // Redirect logged in users away from auth pages
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl))
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
    if (isDashboardRoute && isLoggedIn) {
        const role = req.auth?.user.role

        // Strict checks
        if (nextUrl.pathname.startsWith("/dashboard/finance")) {
            if (role !== "BENDAHARA" && role !== "KETUA" && role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", nextUrl))
            }
        }

        if (nextUrl.pathname.startsWith("/dashboard/admin")) {
            if (role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", nextUrl))
            }
        }
    }

    return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
