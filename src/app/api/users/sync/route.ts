// ==========================================
// User Sync - Creates/updates user after Firebase auth
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyFirebaseToken } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await verifyFirebaseToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    // Upsert user
    const user = await User.findOneAndUpdate(
      { uid: decoded.uid },
      {
        $setOnInsert: { role: "customer" },
        $set: {
          name: body.name || decoded.name || decoded.email?.split("@")[0] || "User",
          email: decoded.email || body.email,
          image: body.image || decoded.picture,
          phone: body.phone,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json({ success: false, error: "Failed to sync user" }, { status: 500 });
  }
}
