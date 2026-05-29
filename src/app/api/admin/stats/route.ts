// ==========================================
// Admin Dashboard Stats
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import Reservation from "@/models/Reservation";
import { requireAdmin } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    await connectDB();

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Parallel data fetch
    const [
      totalRevenueResult,
      lastMonthRevenueResult,
      totalOrders,
      lastMonthOrders,
      totalUsers,
      totalReservations,
      recentOrders,
      ordersByStatus,
      revenueByMonth,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: lastMonth, $lt: thisMonth } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.countDocuments({ createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      User.countDocuments({}),
      Reservation.countDocuments({ status: { $in: ["pending", "confirmed"] } }),
      Order.find({}).populate("userId", "name email").sort({ createdAt: -1 }).limit(5).lean(),
      Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            revenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;
    const revenueGrowth = lastMonthRevenue
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 100;
    const ordersGrowth = lastMonthOrders
      ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 100;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedRevenue = revenueByMonth.map((r) => ({
      month: months[r._id.month - 1],
      revenue: r.revenue,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalReservations,
        revenueGrowth: Math.round(revenueGrowth),
        ordersGrowth: Math.round(ordersGrowth),
        recentOrders,
        ordersByStatus: ordersByStatus.map((o) => ({ status: o._id, count: o.count })),
        revenueByMonth: formattedRevenue,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
