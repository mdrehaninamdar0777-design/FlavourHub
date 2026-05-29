// ==========================================
// Orders API - GET all (admin), POST create
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Coupon from "@/models/Coupon";
import { requireAuth, requireAdmin } from "@/middleware/auth";
import { calculateOrderSummary } from "@/lib/utils";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const isAdminRoute = searchParams.get("admin") === "true";

    if (isAdminRoute) {
      const { error } = await requireAdmin(request);
      if (error) return error;
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const status = searchParams.get("status");
      const filter: Record<string, unknown> = {};
      if (status) filter.orderStatus = status;
      const total = await Order.countDocuments(filter);
      const orders = await Order.find(filter)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return NextResponse.json({
        success: true, data: orders,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    // Regular user - get their own orders
    const { error, user } = await requireAuth(request);
    if (error) return error;
    const orders = await Order.find({ userId: user!._id })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireAuth(request);
    if (error) return error;

    await connectDB();
    const body = await request.json();
    const { items, couponCode, deliveryAddress, specialInstructions, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items in order" }, { status: 400 });
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    // Apply coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() },
        $expr: { $lt: ["$usedCount", "$usageLimit"] },
      });
      if (coupon) {
        if (subtotal >= coupon.minOrderAmount) {
          discount = coupon.discountType === "percentage"
            ? Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity)
            : coupon.discount;
          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
        }
      }
    }

    const summary = calculateOrderSummary(subtotal, discount);

    // Create Razorpay order if payment method is razorpay
    let razorpayOrder = null;
    if (paymentMethod === "razorpay") {
      razorpayOrder = await razorpay.orders.create({
        amount: summary.total * 100, // in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
    }

    const order = await Order.create({
      userId: user!._id,
      items,
      subtotal: summary.subtotal,
      discount: summary.discount,
      tax: summary.tax,
      deliveryFee: summary.deliveryFee,
      totalPrice: summary.total,
      couponCode,
      paymentMethod: paymentMethod || "razorpay",
      razorpayOrderId: razorpayOrder?.id,
      deliveryAddress,
      specialInstructions,
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
    });

    return NextResponse.json({
      success: true,
      data: { order, razorpayOrder },
    }, { status: 201 });
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
