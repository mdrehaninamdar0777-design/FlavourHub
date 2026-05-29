// ==========================================
// Session Cookie API
// Sets/clears an httpOnly cookie storing
// the user's role so middleware can read it
// at the Edge — no Firebase Admin needed there
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// POST /api/auth/session — called after every Firebase login to stamp a session cookie
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ success: false, error: "Token required" }, { status: 400 });
    }

    // Verify the Firebase ID token server-side (real security check)
    const decoded = await verifyFirebaseToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // Fetch the user role from MongoDB
    await connectDB();
    const user = await User.findOne({ uid: decoded.uid }).select("role").lean() as { role?: string } | null;
    const role = user?.role || "customer";

    // Build minimal session payload — only used for route-level decisions
    // All real data access still requires Firebase token in API routes
    const sessionPayload = JSON.stringify({
      uid: decoded.uid,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    });

    const encoded = Buffer.from(sessionPayload).toString("base64");

    const response = NextResponse.json({ success: true, role });

    // httpOnly = JS cannot read this cookie (XSS-safe)
    // secure = only sent over HTTPS in production
    response.cookies.set("fh_session", encoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour — matches Firebase token expiry
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Session POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to create session" }, { status: 500 });
  }
}

// DELETE /api/auth/session — called on logout to clear the cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Session cleared" });
  response.cookies.set("fh_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
