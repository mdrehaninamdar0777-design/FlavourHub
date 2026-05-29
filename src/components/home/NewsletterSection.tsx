"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Subscribed! You'll get exclusive deals soon!");
    setEmail("");
    setLoading(false);
  };

  return (
    <section ref={ref} className="py-20 bg-brand-card border-t border-brand-border">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="w-16 h-16 bg-brand-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-brand-orange" />
          </div>
          <h2 className="section-heading mb-3">Get Exclusive Deals</h2>
          <p className="text-brand-muted font-body mb-8">Subscribe and receive exclusive offers, new menu alerts, and 15% off your first order!</p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="input-dark flex-1" required />
            <button type="submit" disabled={loading} className="btn-primary px-5 py-3 flex items-center gap-2 disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              Subscribe
            </button>
          </form>
          <p className="text-brand-muted text-xs mt-3">No spam, unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
