"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { CalendarDays, Users, Clock } from "lucide-react";

export default function ReservationCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section ref={ref} className="py-20 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-brand-dark" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">Reservations</span>
            <h2 className="section-heading mt-2 mb-4">Reserve Your Table Today</h2>
            <p className="text-brand-muted font-body leading-relaxed mb-8">Experience the finest dining in an elegant atmosphere. Book your table in advance and enjoy a seamless, memorable dining experience.</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: CalendarDays, label: "Easy Booking", sub: "Online reservation" },
                { icon: Users, label: "Up to 20 Guests", sub: "Group dining" },
                { icon: Clock, label: "Instant Confirm", sub: "Quick response" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass-card p-4 text-center">
                  <Icon className="w-6 h-6 text-brand-orange mx-auto mb-2" />
                  <p className="font-heading font-semibold text-brand-text text-xs">{label}</p>
                  <p className="text-brand-muted text-xs mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
            <Link href="/reservation" className="btn-primary inline-flex">Book a Table Now</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden lg:block">
            <div className="aspect-square rounded-3xl overflow-hidden orange-glow">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" alt="Restaurant dining" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
