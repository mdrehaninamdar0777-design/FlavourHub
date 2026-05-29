"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", role: "Food Blogger", text: "The Cheese Burst Pizza is absolutely divine! Best I've had in Mumbai. The crust is perfect and the cheese pull is incredible.", rating: 5, avatar: "PS" },
  { name: "Rahul Mehta", role: "Regular Customer", text: "Been ordering from FlavorHub for 6 months. Consistently fast delivery and the food always arrives hot. Their Chocolate Brownie is my weakness!", rating: 5, avatar: "RM" },
  { name: "Ananya Patel", role: "Food Enthusiast", text: "The reservation experience was seamless and the dine-in ambience is top-notch. The staff is incredibly attentive and the food is restaurant-quality.", rating: 5, avatar: "AP" },
  { name: "Vikram Singh", role: "Business Executive", text: "Perfect for corporate lunches. The Double Cheese Burger is phenomenal and the Mojito is refreshing. Quick service even during peak hours.", rating: 5, avatar: "VS" },
];

export default function Testimonials() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-brand-card to-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">Testimonials</span>
          <h2 className="section-heading mt-2">What Our Customers Say</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 flex flex-col gap-4 food-card hover:border-brand-orange/20 transition-all"
            >
              <Quote className="w-8 h-8 text-brand-orange/40" />
              <p className="text-brand-muted font-body text-sm leading-relaxed flex-1">&quot;{t.text}&quot;</p>
              <div className="flex gap-0.5 mb-2">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-brand-orange fill-brand-orange" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-brand-border">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-amber rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-brand-text text-sm">{t.name}</p>
                  <p className="text-brand-muted text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
