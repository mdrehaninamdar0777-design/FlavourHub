import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const total = await User.countDocuments({});
    const users = await User.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return NextResponse.json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}