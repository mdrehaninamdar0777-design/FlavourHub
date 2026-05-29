"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { Reservation } from "@/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const STATUS_CONFIG = {
  pending: { color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Pending" },
  confirmed: { color: "text-green-400", bg: "bg-green-400/10", label: "Confirmed" },
  cancelled: { color: "text-red-400", bg: "bg-red-400/10", label: "Cancelled" },
  completed: { color: "text-blue-400", bg: "bg-blue-400/10", label: "Completed" },
};

export default function UserReservationsPage() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const { get } = useApi();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !firebaseUser) router.push("/auth/login");
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const data = await get<{ success: boolean; data: Reservation[] }>("/api/reservations");
        if (data.success) setReservations(data.data);
      } catch (err) { console.error("Failed to fetch reservations:", err); }
      finally { setLoading(false); }
    }
    if (firebaseUser) fetchReservations();
  }, [firebaseUser, get]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-brand-dark pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-heading">My Reservations</motion.h1>
            <Link href="/reservation" className="btn-primary text-sm py-2">New Reservation</Link>
          </div>
          {loading ? (
            <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card p-5 h-28 skeleton" />)}</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-20">
              <CalendarDays className="w-20 h-20 text-brand-border mx-auto mb-4" />
              <h3 className="font-heading font-bold text-brand-text text-xl mb-2">No reservations yet</h3>
              <p className="text-brand-muted mb-6">Book a table for your next dining experience!</p>
              <Link href="/reservation" className="btn-primary">Book a Table</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((res, i) => {
                const status = STATUS_CONFIG[res.status] || STATUS_CONFIG.pending;
                return (
                  <motion.div key={res._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-heading font-bold text-brand-text">{formatDate(res.reservationDate)}</p>
                        <div className="flex items-center gap-4 mt-2 text-brand-muted text-sm">
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-orange" />{res.reservationTime}</span>
                          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-brand-orange" />{res.guestCount} guests</span>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-heading font-semibold ${status.bg} ${status.color}`}>{status.label}</span>
                    </div>
                    {res.specialRequests && (
                      <div className="border-t border-brand-border pt-3">
                        <p className="text-brand-muted text-xs"><span className="text-brand-text font-semibold">Special requests:</span> {res.specialRequests}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}