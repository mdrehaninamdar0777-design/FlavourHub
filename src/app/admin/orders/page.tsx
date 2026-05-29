"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Order } from "@/types";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["placed","confirmed","preparing","out_for_delivery","delivered","cancelled"];

export default function AdminOrdersPage() {
  const { get, put } = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ admin: "true", limit: "20", ...(filterStatus && { status: filterStatus }) });
      const data = await get<{ success: boolean; data: Order[] }>(`/api/orders?${params}`);
      if (data.success) setOrders(data.data);
    } catch {} finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await put(`/api/orders/${orderId}`, { orderStatus: status });
      toast.success("Order status updated");
      fetchOrders();
    } catch { toast.error("Failed to update status"); }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-brand-text text-2xl">Orders</h1>
          <p className="text-brand-muted text-sm mt-1">Manage all customer orders</p>
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-dark min-w-[160px]">
          <option value="" className="bg-brand-card">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s} className="bg-brand-card capitalize">{s.replace(/_/g," ")}</option>)}
        </select>
      </div>
      {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="glass-card p-5 h-24 skeleton" />)}</div> : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {["Order ID","Customer","Items","Total","Payment","Status","Date","Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-brand-muted text-xs font-heading font-semibold uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-brand-border/50">
                  <td className="px-4 py-4 text-brand-muted text-xs font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-4 text-brand-text text-sm">{(order.user as { name?: string } | undefined)?.name || "N/A"}</td>
                  <td className="px-4 py-4 text-brand-muted text-sm">{order.items?.length}</td>
                  <td className="px-4 py-4 text-brand-orange font-heading font-semibold text-sm">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-lg ${order.paymentStatus === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>{order.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-4 text-brand-muted text-xs capitalize">{order.orderStatus?.replace(/_/g," ")}</td>
                  <td className="px-4 py-4 text-brand-muted text-xs">{formatDateTime(order.createdAt)}</td>
                  <td className="px-4 py-4">
                    <select value={order.orderStatus} onChange={(e) => updateStatus(order._id, e.target.value)} className="bg-brand-border text-brand-text text-xs rounded-lg px-2 py-1.5 border border-brand-border focus:outline-none focus:border-brand-orange">
                      {ORDER_STATUSES.map((s) => <option key={s} value={s} className="bg-brand-card capitalize">{s.replace(/_/g," ")}</option>)}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-brand-border mx-auto mb-3" />
              <p className="text-brand-muted">No orders found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}