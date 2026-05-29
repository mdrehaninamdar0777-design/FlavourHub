"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We will get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const contactInfo = [
    { icon: MapPin, title: "Address", info: "123 Flavor Street, Mumbai, Maharashtra 400001" },
    { icon: Phone, title: "Phone", info: "+91 98765 43210 | +91 98765 43211" },
    { icon: Mail, title: "Email", info: "hello@flavorhub.com | support@flavorhub.com" },
    { icon: Clock, title: "Hours", info: "Mon-Sun: 11 AM to 11 PM | Fri-Sat: 11 AM to 12 AM" },
  ];

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">
            Get In Touch
          </span>
          <h1 className="section-heading mt-2">Contact Us</h1>
          <p className="text-brand-muted font-body mt-3 max-w-xl mx-auto">
            Have a question or feedback? We would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, title, info }) => (
              <div key={title} className="glass-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-brand-text text-sm mb-1">
                    {title}
                  </h3>
                  <p className="text-brand-muted text-sm font-body">{info}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 glass-card p-6 sm:p-8 space-y-5 h-fit"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-brand-text text-sm font-heading font-medium mb-2">
                  Your Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="input-dark w-full"
                />
              </div>
              <div>
                <label className="block text-brand-text text-sm font-heading font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="input-dark w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-brand-text text-sm font-heading font-medium mb-2">
                Subject
              </label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="How can we help?"
                required
                className="input-dark w-full"
              />
            </div>
            <div>
              <label className="block text-brand-text text-sm font-heading font-medium mb-2">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write your message here..."
                rows={5}
                required
                className="input-dark w-full resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}