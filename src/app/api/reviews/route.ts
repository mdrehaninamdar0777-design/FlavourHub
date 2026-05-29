import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { requireAuth } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ success: false, error: "productId required" }, { status: 400 });
    const reviews = await Review.find({ productId })
      .populate("userId", "name image")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: reviews });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireAuth(request);
    if (error) return error;
    await connectDB();
    const { productId, rating, comment } = await request.json();
    if (!productId || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    const review = await Review.create({ productId, userId: user!._id, rating, comment });
    // Update product rating
    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length });
    const populated = await Review.findById(review._id).populate("userId", "name image");
    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (err: unknown) {
    const e = err as { code?: number };
    if (e.code === 11000) return NextResponse.json({ success: false, error: "You have already reviewed this product" }, { status: 409 });
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}