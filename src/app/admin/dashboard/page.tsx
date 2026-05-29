"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, CalendarDays, DollarSign, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useApi } from "@/hooks/useApi";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { DashboardStats } from "@/types";

const STAT_COLORS = ["#FF6B35", "#10b981", "#3b82f6", "#f59e0b"];
const PIE_COLORS = ["#FF6B35", "#FFB347", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"];

export default function AdminDashboardPage() {
  const { get } = useApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await get<{ success: boolean; data: DashboardStats }>("/api/admin/stats");
        if (data.success) setStats(data.data);
      } catch (err) { console.error("Failed to fetch stats:", err); }
      finally { setLoading(false); }
    }
    fetchStats();
  }, [get]);

  const statCards = stats ? [
    { label: "Monthly Revenue", value: formatCurrency(stats.totalRevenue), growth: stats.revenueGrowth, icon: DollarSign },
    { label: "Monthly Orders", value: stats.totalOrders, growth: stats.ordersGrowth, icon: ShoppingBag },
    { label: "Total Users", value: stats.totalUsers, growth: 12, icon: Users },
    { label: "Active Reservations", value: stats.totalReservations, growth: 5, icon: CalendarDays },
  ] : [];

  if (loading) return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="glass-card p-5 h-28 skeleton" />)}</div>
      <div className="glass-card p-5 h-64 skeleton" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="font-heading font-bold text-brand-text text-2xl">Dashboard Overview</h1>
        <p className="text-brand-muted text-sm mt-1">Welcome back! Here is what is happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, growth, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${STAT_COLORS[i]}20` }}>
                <Icon className="w-5 h-5" style={{ color: STAT_COLORS[i] }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-heading font-semibold ${growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                {growth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(growth)}%
              </div>
            </div>
            <p className="font-heading font-black text-brand-text text-2xl">{value}</p>
            <p className="text-brand-muted text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 lg:col-span-2">
          <h2 className="font-heading font-bold text-brand-text mb-6">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats?.revenueByMonth || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
              <XAxis dataKey="month" stroke="#6B6B7A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6B6B7A" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#111114", border: "1px solid #1E1E24", borderRadius: "12px", color: "#E8E8F0" }} formatter={(v: number) => [formatCurrency(v), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders by Status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h2 className="font-heading font-bold text-brand-text mb-6">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={stats?.ordersByStatus || []} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} strokeWidth={0}>
                {(stats?.ordersByStatus || []).map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#111114", border: "1px solid #1E1E24", borderRadius: "12px", color: "#E8E8F0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {(stats?.ordersByStatus || []).map((s, i) => (
              <div key={s.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-brand-muted capitalize">{s.status.replace(/_/g, " ")}</span>
                </div>
                <span className="font-heading font-semibold text-brand-text">{s.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card overflow-hidden">
        <div className="p-6 border-b border-brand-border">
          <h2 className="font-heading font-bold text-brand-text">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-brand-muted text-xs font-heading font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map((order) => (
                <tr key={order._id} className="border-b border-brand-border/50">
                  <td className="px-6 py-4 text-brand-muted text-sm font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-brand-text text-sm">{(order.user as { name?: string } | undefined)?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-brand-muted text-sm">{order.items?.length} items</td>
                  <td className="px-6 py-4 text-brand-orange font-heading font-semibold text-sm">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-lg bg-brand-border text-brand-muted capitalize">{order.orderStatus?.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-6 py-4 text-brand-muted text-xs">{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}