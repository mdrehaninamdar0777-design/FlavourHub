"use client";
// ==========================================
// Hero Section - Main Homepage Banner
// ==========================================
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Clock, Shield } from "lucide-react";

const stats = [
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Clock, value: "30min", label: "Delivery" },
  { icon: Shield, value: "100%", label: "Fresh" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1920&q=80')`,
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-amber/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/20 border border-brand-orange/30 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
            <span className="text-brand-orange font-body text-sm font-medium">Premium Restaurant Experience</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-black text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-6"
          >
            Experience{" "}
            <span className="gradient-text">Premium</span>{" "}
            Dining
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed"
          >
            Delicious meals crafted with passion and premium ingredients.
            Every bite tells a story of flavor and excellence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link href="/menu" className="btn-primary flex items-center gap-2 justify-center text-base">
              Order Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/reservation" className="btn-outline flex items-center gap-2 justify-center text-base">
              Book a Table
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-8"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <div className="font-heading font-bold text-white text-lg leading-none">{value}</div>
                  <div className="font-body text-white/50 text-xs mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs font-body">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-brand-orange rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
