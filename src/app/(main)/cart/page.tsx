"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency, calculateOrderSummary } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const summary = calculateOrderSummary(subtotal);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-brand-border mx-auto mb-6" />
          <h2 className="font-heading font-bold text-brand-text text-2xl mb-3">Your cart is empty</h2>
          <p className="text-brand-muted font-body mb-8">Add some delicious items from our menu!</p>
          <Link href="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-heading mb-8">Your Cart</motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(({ product, quantity }) => (
                <motion.div key={product._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }} className="glass-card p-4 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={product.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80"} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-brand-text text-sm line-clamp-1">{product.title}</h3>
                    <p className="text-brand-orange font-heading font-bold mt-1">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(product._id, quantity - 1)} className="w-8 h-8 glass-card flex items-center justify-center hover:border-brand-orange/40 transition-colors rounded-lg">
                      <Minus className="w-3.5 h-3.5 text-brand-muted" />
                    </button>
                    <span className="w-8 text-center font-heading font-bold text-brand-text">{quantity}</span>
                    <button onClick={() => updateQuantity(product._id, quantity + 1)} className="w-8 h-8 glass-card flex items-center justify-center hover:border-brand-orange/40 transition-colors rounded-lg">
                      <Plus className="w-3.5 h-3.5 text-brand-muted" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-brand-text text-sm">{formatCurrency(product.price * quantity)}</p>
                    <button onClick={() => removeItem(product._id)} className="text-red-400 hover:text-red-300 mt-1 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="font-heading font-bold text-brand-text text-lg mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Subtotal", value: formatCurrency(summary.subtotal) },
                  { label: `Delivery Fee`, value: summary.deliveryFee === 0 ? "FREE" : formatCurrency(summary.deliveryFee) },
                  { label: "GST (5%)", value: formatCurrency(summary.tax) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-brand-muted font-body">{label}</span>
                    <span className={`font-heading font-semibold ${value === "FREE" ? "text-green-400" : "text-brand-text"}`}>{value}</span>
                  </div>
                ))}
                {summary.deliveryFee > 0 && (
                  <p className="text-xs text-brand-muted">Free delivery on orders above ₹499</p>
                )}
              </div>
              <div className="border-t border-brand-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-heading font-bold text-brand-text">Total</span>
                  <span className="font-heading font-bold text-brand-orange text-xl">{formatCurrency(summary.total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 text-base">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/menu" className="block text-center text-brand-muted text-sm mt-4 hover:text-brand-orange transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}