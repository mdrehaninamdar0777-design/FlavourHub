// ==========================================
// Next.js Edge Middleware
// Runs on EVERY request BEFORE the page loads
// No Firebase Admin, no MongoDB — Edge-compatible only
// ==========================================
import { NextRequest, NextResponse } from "next/server";

// Routes that require the user to be logged in
const PROTECTED_ROUTES = ["/checkout", "/dashboard"];

// Routes that require admin role specifically
const ADMIN_ROUTES = ["/admin"];

// Routes only for guests (redirect to home if already logged in)
const GUEST_ONLY_ROUTES = ["/auth/login", "/auth/register"];

function parseSession(request: NextRequest): { uid: string; role: string; exp: number } | null {
  try {
    const cookie = request.cookies.get("fh_session")?.value;
    if (!cookie) return null;

    const decoded = Buffer.from(cookie, "base64").toString("utf-8");
    const session = JSON.parse(decoded);

    // Check if session has expired
    if (session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseSession(request);

  // ── 1. ADMIN ROUTES ────────────────────────────────────────────────────────
  // /admin/* requires role === "admin"
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!session) {
      // Not logged in at all → go to login
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "admin") {
      // Logged in but NOT admin → redirect to home with message
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("reason", "admin_required");
      return NextResponse.redirect(homeUrl);
    }

    // Is admin → allow through
    return NextResponse.next();
  }

  // ── 2. PROTECTED ROUTES ────────────────────────────────────────────────────
  // /checkout /dashboard/* require any logged-in user
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ── 3. GUEST-ONLY ROUTES ───────────────────────────────────────────────────
  // /auth/login /auth/register — redirect to home if already logged in
  if (GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ── 4. ALL OTHER ROUTES ────────────────────────────────────────────────────
  return NextResponse.next();
}

export const config = {
  // Run middleware on these paths only (skip static files, api routes, images)
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/auth/:path*",
  ],
};
