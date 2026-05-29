import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import { requireAdmin } from "@/middleware/auth";

interface RouteParams { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const reservation = await Reservation.findByIdAndUpdate(id, body, { new: true });
    if (!reservation) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: reservation });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}