import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        console.log(`[Middleware] Path: ${path}, Role: ${token?.role}`)

        // 1. Protect Venue Dashboard
        if (path.startsWith("/dashboard")) {
            if (token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN" && token?.role !== "OPERATOR") {
                return NextResponse.redirect(new URL("/login", req.url))
            }
        }

        // 2. Protect Couple Dashboard
        if (path.startsWith("/my-wedding")) {
            if (token?.role !== "USER" && token?.role !== "CLIENT" && token?.role !== "SUPER_ADMIN") {
                return NextResponse.redirect(new URL("/login", req.url))
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: ["/dashboard/:path*", "/my-wedding/:path*"],
}
