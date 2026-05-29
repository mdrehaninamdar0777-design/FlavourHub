// ==========================================
// Coupon Validation
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { code, orderAmount } = await request.json();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiryDate: { $gte: new Date() },
    }).lean();

    if (!coupon) {
      return NextResponse.json({ success: false, error: "Invalid or expired coupon" }, { status: 404 });
    }

    const couponDoc = coupon as unknown as {
  usedCount: number;
  usageLimit: number;
  minOrderAmount: number;
  discountType: string;
  discount: number;
  maxDiscount?: number;
};

    if (couponDoc.usedCount >= couponDoc.usageLimit) {
      return NextResponse.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (orderAmount < couponDoc.minOrderAmount) {
      return NextResponse.json({
        success: false,
        error: `Minimum order amount is ₹${couponDoc.minOrderAmount}`,
      }, { status: 400 });
    }

    const discountAmount = couponDoc.discountType === "percentage"
      ? Math.min((orderAmount * couponDoc.discount) / 100, couponDoc.maxDiscount || Infinity)
      : couponDoc.discount;

    return NextResponse.json({
      success: true,
      data: { coupon, discountAmount: Math.round(discountAmount) },
    });
  } catch (error) {
    console.error("Coupon validate error:", error);
    return NextResponse.json({ success: false, error: "Failed to validate coupon" }, { status: 500 });
  }
}
