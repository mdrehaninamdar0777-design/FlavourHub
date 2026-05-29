// ==========================================
// Coupons API
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { requireAdmin } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error("Coupons GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;
    await connectDB();
    const body = await request.json();
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    console.error("Coupon POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create coupon" }, { status: 500 });
  }
}
