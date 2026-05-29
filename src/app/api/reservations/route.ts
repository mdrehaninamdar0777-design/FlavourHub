// ==========================================
// Reservations API
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import { requireAdmin, getAuthUser } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } = await requireAdmin(request);
      if (error) return error;
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const status = searchParams.get("status");
      const filter: Record<string, unknown> = {};
      if (status) filter.status = status;
      const total = await Reservation.countDocuments(filter);
      const reservations = await Reservation.find(filter)
        .sort({ reservationDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return NextResponse.json({
        success: true, data: reservations,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    // User's own reservations
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const reservations = await Reservation.find({ userId: user._id })
      .sort({ reservationDate: -1 })
      .lean();
    return NextResponse.json({ success: true, data: reservations });
  } catch (error) {
    console.error("Reservations GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { customerName, email, phone, guestCount, reservationDate, reservationTime, specialRequests } = body;

    if (!customerName || !email || !phone || !guestCount || !reservationDate || !reservationTime) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Check for conflicting reservations (max 5 tables per time slot)
    const existingCount = await Reservation.countDocuments({
      reservationDate: new Date(reservationDate),
      reservationTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingCount >= 5) {
      return NextResponse.json({
        success: false,
        error: "This time slot is fully booked. Please choose another time.",
      }, { status: 409 });
    }

    // Optional: link to user account
    const user = await getAuthUser(request);

    const reservation = await Reservation.create({
      userId: user?._id,
      customerName, email, phone, guestCount,
      reservationDate: new Date(reservationDate),
      reservationTime, specialRequests,
    });

    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (error) {
    console.error("Reservation POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create reservation" }, { status: 500 });
  }
}
