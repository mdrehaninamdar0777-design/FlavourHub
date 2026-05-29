"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, MapPin, Tag, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { formatCurrency, calculateOrderSummary } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

declare global { interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void }; } }

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { userProfile, firebaseUser } = useAuth();
  const { post } = useApi();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [instructions, setInstructions] = useState("");

  const summary = calculateOrderSummary(subtotal, couponDiscount);

  if (!firebaseUser) {
    return (
      <div className="min-h-screen bg-brand-dark pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading font-bold text-brand-text text-2xl mb-4">Please sign in to checkout</h2>
          <Link href="/auth/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading font-bold text-brand-text text-2xl mb-4">Your cart is empty</h2>
          <Link href="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const data = await post<{ success: boolean; data: { discountAmount: number }; error?: string }>("/api/coupons/validate", { code: couponCode, orderAmount: subtotal });
      if (data.success) {
        setCouponDiscount(data.data.discountAmount);
        toast.success(`Coupon applied! Saved ${formatCurrency(data.data.discountAmount)}`);
      } else {
        toast.error(data.error || "Invalid coupon");
      }
    } catch { toast.error("Failed to apply coupon"); }
    finally { setCouponLoading(false); }
  };

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill in your delivery address"); return;
    }
    setPlacing(true);
    try {
      const orderItems = items.map(({ product, quantity }) => ({
        productId: product._id, title: product.title, image: product.image, price: product.price, quantity,
      }));
      const data = await post<{ success: boolean; data: { order: { _id: string }; razorpayOrder: { id: string; amount: number } } }>("/api/orders", {
        items: orderItems, couponCode: couponCode || undefined, deliveryAddress: { ...address, label: "Home" },
        specialInstructions: instructions, paymentMethod,
      });

      if (!data.success) { toast.error("Failed to place order"); setPlacing(false); return; }

      if (paymentMethod === "razorpay" && data.data.razorpayOrder) {
        const loaded = await loadRazorpay();
        if (!loaded) { toast.error("Payment gateway failed to load"); setPlacing(false); return; }

        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.data.razorpayOrder.amount,
          currency: "INR",
          name: "FlavorHub",
          description: "Food Order",
          order_id: data.data.razorpayOrder.id,
          prefill: { name: userProfile?.name, email: userProfile?.email },
          theme: { color: "#FF6B35" },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              await post("/api/orders/verify-payment", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: data.data.order._id,
              });
              clearCart();
              toast.success("Order placed successfully!");
              router.push(`/dashboard/orders`);
            } catch { toast.error("Payment verification failed"); }
          },
        });
        rzp.open();
      } else {
        clearCart();
        toast.success("Order placed! Pay on delivery.");
        router.push(`/dashboard/orders`);
      }
    } catch { toast.error("Failed to place order"); }
    finally { setPlacing(false); }
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-heading mb-8">Checkout</motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="glass-card p-6">
              <h2 className="font-heading font-bold text-brand-text mb-5 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-orange" /> Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-brand-muted text-xs font-heading mb-1.5">Street Address</label>
                  <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="123 Main Street, Apt 4B" className="input-dark w-full" />
                </div>
                {[
                  { key: "city", placeholder: "Mumbai", label: "City" },
                  { key: "state", placeholder: "Maharashtra", label: "State" },
                  { key: "pincode", placeholder: "400001", label: "Pincode" },
                ].map(({ key, placeholder, label }) => (
                  <div key={key}>
                    <label className="block text-brand-muted text-xs font-heading mb-1.5">{label}</label>
                    <input value={address[key as keyof typeof address]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} placeholder={placeholder} className="input-dark w-full" />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-brand-muted text-xs font-heading mb-1.5">Special Instructions (optional)</label>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Leave at door, ring doorbell, etc." rows={2} className="input-dark w-full resize-none" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card p-6">
              <h2 className="font-heading font-bold text-brand-text mb-5 flex items-center gap-2"><CreditCard className="w-5 h-5 text-brand-orange" /> Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {([["razorpay","Online Payment","Pay securely via UPI, Card, Net Banking"],["cod","Cash on Delivery","Pay when your order arrives"]] as const).map(([value, title, desc]) => (
                  <button key={value} onClick={() => setPaymentMethod(value)} className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === value ? "border-brand-orange bg-brand-orange/10" : "border-brand-border hover:border-brand-orange/40"}`}>
                    <p className="font-heading font-semibold text-brand-text text-sm">{title}</p>
                    <p className="text-brand-muted text-xs mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="glass-card p-6">
              <h2 className="font-heading font-bold text-brand-text mb-5 flex items-center gap-2"><Tag className="w-5 h-5 text-brand-orange" /> Apply Coupon</h2>
              <div className="flex gap-3">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="input-dark flex-1" />
                <button onClick={applyCoupon} disabled={couponLoading || !couponCode} className="btn-outline px-5 disabled:opacity-50">
                  {couponLoading ? <span className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : "Apply"}
                </button>
              </div>
              {couponDiscount > 0 && <p className="text-green-400 text-sm mt-2">Coupon applied! You saved {formatCurrency(couponDiscount)}</p>}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="font-heading font-bold text-brand-text text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex justify-between text-sm">
                    <span className="text-brand-muted truncate flex-1 mr-2">{product.title} × {quantity}</span>
                    <span className="text-brand-text font-heading font-semibold flex-shrink-0">{formatCurrency(product.price * quantity)}</span>
                  </div>
                ))}
              </div>
              <ChevronDown className="w-4 h-4 text-brand-muted mx-auto mb-4" />
              <div className="space-y-2 text-sm border-t border-brand-border pt-4 mb-4">
                {[
                  { label: "Subtotal", value: formatCurrency(summary.subtotal) },
                  ...(couponDiscount > 0 ? [{ label: "Discount", value: `-${formatCurrency(summary.discount)}` }] : []),
                  { label: "Delivery", value: summary.deliveryFee === 0 ? "FREE" : formatCurrency(summary.deliveryFee) },
                  { label: "GST (5%)", value: formatCurrency(summary.tax) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-brand-muted">{label}</span>
                    <span className={`font-heading font-semibold ${value === "FREE" || value.startsWith("-") ? "text-green-400" : "text-brand-text"}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-brand-text text-lg">Total</span>
                  <span className="font-heading font-black text-brand-orange text-2xl">{formatCurrency(summary.total)}</span>
                </div>
              </div>
              <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                {placing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {placing ? "Placing Order..." : paymentMethod === "cod" ? "Place Order (COD)" : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}