"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, XCircle, ChefHat } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Order } from "@/types";
import Link from "next/link";

const STATUS_CONFIG = {
  placed: { icon: Package, color: "text-blue-400", bg: "bg-blue-400/10", label: "Order Placed" },
  confirmed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", label: "Confirmed" },
  preparing: { icon: ChefHat, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Preparing" },
  out_for_delivery: { icon: Truck, color: "text-brand-orange", bg: "bg-brand-orange/10", label: "Out for Delivery" },
  delivered: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Cancelled" },
};

export default function OrdersPage() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const { get } = useApi();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !firebaseUser) router.push("/auth/login");
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await get<{ success: boolean; data: Order[] }>("/api/orders");
        if (data.success) setOrders(data.data);
      } catch (err) { console.error("Failed to fetch orders:", err); }
      finally { setLoading(false); }
    }
    if (firebaseUser) fetchOrders();
  }, [firebaseUser, get]);

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-heading">My Orders</motion.h1>
          <Link href="/menu" className="btn-outline text-sm py-2">Order More</Link>
        </div>
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card p-6"><div className="skeleton h-24" /></div>)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-brand-border mx-auto mb-4" />
            <h3 className="font-heading font-bold text-brand-text text-xl mb-2">No orders yet</h3>
            <p className="text-brand-muted mb-6">Start exploring our delicious menu!</p>
            <Link href="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
              const Icon = status.icon;
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-brand-muted text-xs font-body mb-1">Order ID: <span className="text-brand-text font-mono">{order._id.slice(-8).toUpperCase()}</span></p>
                      <p className="text-brand-muted text-xs">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${status.color}`} />
                      <span className={`text-xs font-heading font-semibold ${status.color}`}>{status.label}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <span key={item.productId.toString()} className="text-xs text-brand-muted bg-brand-border rounded-lg px-2.5 py-1">
                        {item.title} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && <span className="text-xs text-brand-muted bg-brand-border rounded-lg px-2.5 py-1">+{order.items.length - 3} more</span>}
                  </div>
                  <div className="flex items-center justify-between border-t border-brand-border pt-4">
                    <div>
                      <span className="text-brand-orange font-heading font-bold text-lg">{formatCurrency(order.totalPrice)}</span>
                      <span className="text-brand-muted text-xs ml-2">via {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg ${order.paymentStatus === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}