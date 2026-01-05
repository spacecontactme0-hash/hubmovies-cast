import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Public routes - allow all (including verify-email page)
  if (
    path.startsWith("/auth") ||
    path === "/" ||
    path.startsWith("/jobs") ||
    path.startsWith("/talents") ||
    path.startsWith("/api/jobs") ||
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (
    path.startsWith("/director") ||
    path.startsWith("/talent/dashboard") ||
    path.startsWith("/api/director") ||
    path.startsWith("/api/talent") ||
    path.startsWith("/api/apply") ||
    path.startsWith("/api/messages")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Email verification enforcement
    const emailVerified = (token as any).emailVerified;
    if (!emailVerified) {
      // Allow access to auth routes and resend verification API
      if (path.startsWith("/api/auth/resend-verification")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/auth/verify-email", req.url));
    }

    // Role-based redirection
    const userRole = (token as any).role;
    if (userRole === "DIRECTOR" && path.startsWith("/talent/dashboard")) {
      return NextResponse.redirect(new URL("/director/dashboard", req.url));
    }

    if (userRole === "TALENT" && path.startsWith("/director")) {
      return NextResponse.redirect(new URL("/talent/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/director/:path*",
    "/talent/dashboard/:path*",
    "/api/director/:path*",
    "/api/talent/:path*",
    "/api/apply/:path*",
  ],
};

