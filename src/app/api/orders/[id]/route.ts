// ==========================================
// Order by ID - GET, PUT (status update)
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAuth, requireAdmin } from "@/middleware/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { error, user } = await requireAuth(request);
    if (error) return error;
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    const orderObj = order as unknown as { userId: { toString(): string } };
    if (user!.role !== "admin" && orderObj.userId.toString() !== user!._id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Order PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
