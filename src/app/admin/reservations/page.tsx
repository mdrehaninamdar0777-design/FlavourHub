"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Reservation } from "@/types";
import toast from "react-hot-toast";

const STATUS_COLORS = { pending: "bg-yellow-500/10 text-yellow-400", confirmed: "bg-green-500/10 text-green-400", cancelled: "bg-red-500/10 text-red-400", completed: "bg-blue-500/10 text-blue-400" };

export default function AdminReservationsPage() {
  const { get, put } = useApi();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = await get<{ success: boolean; data: Reservation[] }>("/api/reservations?admin=true&limit=50");
        if (data.success) setReservations(data.data);
      } catch {} finally { setLoading(false); }
    }
    fetch();
  }, [get]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const params = new URLSearchParams({ admin: "true" });
      await put(`/api/reservations/${id}?${params}`, { status });
      toast.success("Status updated");
      setReservations((prev) => prev.map((r) => r._id === id ? { ...r, status: status as Reservation["status"] } : r));
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-brand-text text-2xl">Reservations</h1>
        <p className="text-brand-muted text-sm mt-1">{reservations.length} total reservations</p>
      </div>
      {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="glass-card p-5 h-20 skeleton" />)}</div> : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {["Customer","Email","Phone","Guests","Date","Time","Status","Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-brand-muted text-xs font-heading font-semibold uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, i) => (
                <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-brand-border/50">
                  <td className="px-4 py-3 text-brand-text text-sm font-medium">{r.customerName}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{r.email}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{r.phone}</td>
                  <td className="px-4 py-3 text-brand-text text-sm text-center">{r.guestCount}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{formatDate(r.reservationDate)}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{r.reservationTime}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-lg capitalize ${STATUS_COLORS[r.status] || ""}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="bg-brand-border text-brand-text text-xs rounded-lg px-2 py-1.5 border border-brand-border focus:outline-none focus:border-brand-orange">
                      {["pending","confirmed","cancelled","completed"].map((s) => <option key={s} value={s} className="bg-brand-card capitalize">{s}</option>)}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {reservations.length === 0 && (
            <div className="text-center py-16">
              <CalendarDays className="w-12 h-12 text-brand-border mx-auto mb-3" />
              <p className="text-brand-muted">No reservations found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}