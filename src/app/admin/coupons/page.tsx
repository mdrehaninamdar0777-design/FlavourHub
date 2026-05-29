"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Tag, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { Coupon } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminCouponsPage() {
  const { get, post } = useApi();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", discount: "", discountType: "percentage", minOrderAmount: "0", maxDiscount: "", usageLimit: "100", expiryDate: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await get<{ success: boolean; data: Coupon[] }>("/api/coupons");
      if (data.success) setCoupons(data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await post("/api/coupons", {
        code: form.code.toUpperCase(),
        discount: parseFloat(form.discount),
        discountType: form.discountType,
        minOrderAmount: parseFloat(form.minOrderAmount),
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
        usageLimit: parseInt(form.usageLimit),
        expiryDate: new Date(form.expiryDate),
      });
      toast.success("Coupon created!");
      setShowModal(false);
      setForm({ code: "", discount: "", discountType: "percentage", minOrderAmount: "0", maxDiscount: "", usageLimit: "100", expiryDate: "" });
      fetchCoupons();
    } catch { toast.error("Failed to create coupon"); }
    finally { setSaving(false); }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-brand-text text-2xl">Coupons</h1>
          <p className="text-brand-muted text-sm mt-1">{coupons.length} active coupons</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Coupon</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card p-5 h-36 skeleton" />)}</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="w-16 h-16 text-brand-border mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-brand-text text-xl mb-2">No coupons yet</h3>
          <p className="text-brand-muted mb-6">Create your first coupon to boost sales</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">Create Coupon</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon, i) => {
            const isExpired = new Date(coupon.expiryDate) < new Date();
            return (
              <motion.div key={coupon._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`glass-card p-5 border-l-4 ${isExpired || !coupon.isActive ? "border-red-500/50 opacity-60" : "border-brand-orange"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-heading font-black text-brand-orange text-xl tracking-widest">{coupon.code}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {isExpired ? <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Expired</span> : coupon.isActive ? <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Active</span> : <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Inactive</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-black text-brand-text text-2xl">{coupon.discount}{coupon.discountType === "percentage" ? "%" : "₹"}</p>
                    <p className="text-brand-muted text-xs">off</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-brand-muted border-t border-brand-border pt-3">
                  <div className="flex justify-between"><span>Min Order:</span><span className="text-brand-text">{formatCurrency(coupon.minOrderAmount)}</span></div>
                  {coupon.maxDiscount && <div className="flex justify-between"><span>Max Discount:</span><span className="text-brand-text">{formatCurrency(coupon.maxDiscount)}</span></div>}
                  <div className="flex justify-between"><span>Usage:</span><span className="text-brand-text">{coupon.usedCount}/{coupon.usageLimit}</span></div>
                  <div className="flex justify-between"><span>Expires:</span><span className={isExpired ? "text-red-400" : "text-brand-text"}>{formatDate(coupon.expiryDate)}</span></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-md">
            <h2 className="font-heading font-bold text-brand-text text-xl mb-6">Create Coupon</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-brand-muted text-xs font-heading mb-1">Coupon Code</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE20" required className="input-dark w-full font-mono tracking-widest" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-muted text-xs font-heading mb-1">Discount Value</label>
                  <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="20" required className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-brand-muted text-xs font-heading mb-1">Discount Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="input-dark w-full">
                    <option value="percentage" className="bg-brand-card">Percentage (%)</option>
                    <option value="fixed" className="bg-brand-card">Fixed (₹)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-muted text-xs font-heading mb-1">Min Order (₹)</label>
                  <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-brand-muted text-xs font-heading mb-1">Max Discount (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="Optional" className="input-dark w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-muted text-xs font-heading mb-1">Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-brand-muted text-xs font-heading mb-1">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} min={today} required className="input-dark w-full" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Tag className="w-4 h-4" />}
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}