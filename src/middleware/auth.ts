// ==========================================
// Authentication Middleware
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string;
    email: string;
    role: "customer" | "admin";
    _id: string;
  };
}

export async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split("Bearer ")[1];
  const decoded = await verifyFirebaseToken(token);
  if (!decoded) return null;

  await connectDB();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user) return null;

  return {
    uid: decoded.uid,
    email: decoded.email || "",
    role: (user as { role: string }).role as "customer" | "admin",
    _id: ((user as { _id: unknown })._id as { toString(): string }).toString(),
  };
}

export async function requireAuth(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
      user: null,
    };
  }
  return { error: null, user };
}

export async function requireAdmin(request: NextRequest) {
  const { error, user } = await requireAuth(request);
  if (error) return { error, user: null };
  if (user?.role !== "admin") {
    return {
      error: NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      ),
      user: null,
    };
  }
  return { error: null, user };
}
