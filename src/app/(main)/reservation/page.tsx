"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, Phone, Mail, User, MessageSquare, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const TIME_SLOTS = ["12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM","09:30 PM","10:00 PM"];

export default function ReservationPage() {
  const { userProfile } = useAuth();
  const [form, setForm] = useState({
    customerName: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: "",
    guestCount: 2,
    reservationDate: "",
    reservationTime: "",
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        toast.success("Reservation confirmed! See you soon!");
      } else {
        toast.error(data.error || "Failed to create reservation");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (success) {
    return (
      <div className="min-h-screen bg-brand-dark pt-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 max-w-md text-center mx-4">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h2 className="font-heading font-bold text-brand-text text-2xl mb-3">Reservation Confirmed!</h2>
          <p className="text-brand-muted font-body mb-6">Your table has been booked for <strong className="text-brand-text">{form.guestCount} guests</strong> on <strong className="text-brand-text">{form.reservationDate}</strong> at <strong className="text-brand-text">{form.reservationTime}</strong>.</p>
          <p className="text-brand-muted text-sm mb-8">A confirmation email will be sent to {form.email}</p>
          <button onClick={() => setSuccess(false)} className="btn-primary">Make Another Reservation</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">Reservations</span>
          <h1 className="section-heading mt-2">Book Your Table</h1>
          <p className="text-brand-muted font-body mt-3">Reserve your spot for an unforgettable dining experience</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-brand-text text-sm font-heading font-medium mb-2"><User className="w-4 h-4 inline mr-1 text-brand-orange" />Full Name</label>
              <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="John Doe" required className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-brand-text text-sm font-heading font-medium mb-2"><Phone className="w-4 h-4 inline mr-1 text-brand-orange" />Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required className="input-dark w-full" />
            </div>
          </div>
          <div>
            <label className="block text-brand-text text-sm font-heading font-medium mb-2"><Mail className="w-4 h-4 inline mr-1 text-brand-orange" />Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required className="input-dark w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-brand-text text-sm font-heading font-medium mb-2"><Users className="w-4 h-4 inline mr-1 text-brand-orange" />Guests</label>
              <select name="guestCount" value={form.guestCount} onChange={handleChange} className="input-dark w-full">
                {[...Array(20)].map((_, i) => <option key={i+1} value={i+1} className="bg-brand-card">{i+1} {i === 0 ? "guest" : "guests"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-brand-text text-sm font-heading font-medium mb-2"><CalendarDays className="w-4 h-4 inline mr-1 text-brand-orange" />Date</label>
              <input name="reservationDate" type="date" value={form.reservationDate} onChange={handleChange} min={today} required className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-brand-text text-sm font-heading font-medium mb-2"><Clock className="w-4 h-4 inline mr-1 text-brand-orange" />Time</label>
              <select name="reservationTime" value={form.reservationTime} onChange={handleChange} required className="input-dark w-full">
                <option value="" className="bg-brand-card">Select time</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t} className="bg-brand-card">{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-brand-text text-sm font-heading font-medium mb-2"><MessageSquare className="w-4 h-4 inline mr-1 text-brand-orange" />Special Requests (optional)</label>
            <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} placeholder="Dietary requirements, special occasion, seating preference..." rows={3} className="input-dark w-full resize-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {loading ? "Confirming..." : "Confirm Reservation"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}