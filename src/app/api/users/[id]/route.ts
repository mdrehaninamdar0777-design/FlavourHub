import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/middleware/auth";

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;
    await connectDB();
    const { id } = await params;
    const user = await User.findById(id).select("-__v").lean();
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { error, user: authUser } = await requireAuth(request);
    if (error) return error;
    await connectDB();
    const { id } = await params;
    if (authUser!._id !== id && authUser!.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const allowedFields = ["name", "phone", "image"];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) { if (body[field] !== undefined) updates[field] = body[field]; }
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}