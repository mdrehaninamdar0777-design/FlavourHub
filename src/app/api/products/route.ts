// ==========================================
// Products API - GET all, POST create
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/middleware/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const sort = searchParams.get("sort") || "createdAt";

    // Build filter
    const filter: Record<string, unknown> = { isAvailable: true };
    if (category && category !== "all") filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (bestSeller === "true") filter.isBestSeller = true;

    // Text search
    let query;
    if (search) {
      query = Product.find({ ...filter, $text: { $search: search } });
    } else {
      query = Product.find(filter);
    }

    // Sorting
    const sortOptions: Record<string, Record<string, number>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
      createdAt: { createdAt: -1 },
    };
    query = query.sort(sortOptions[sort] || { createdAt: -1 });

    const total = await Product.countDocuments(filter);
    const products = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireAdmin(request);
    if (error) return error;

    await connectDB();
    const body = await request.json();

    const { title, description, category, imageBase64, price, originalPrice, stock, ingredients, tags, isFeatured, isBestSeller } = body;

    if (!title || !description || !category || !price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    let image = body.image;
    if (imageBase64) {
      image = await uploadImage(imageBase64, "flavorhub/products");
    }

    const product = await Product.create({
      title, description, category, image, price,
      originalPrice, stock, ingredients, tags, isFeatured, isBestSeller,
    });

    console.log(`Product created by admin ${user?._id}:`, product._id);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Product POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
