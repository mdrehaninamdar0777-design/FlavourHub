"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Leaf, Star, Truck, ChefHat, Shield } from "lucide-react";

const features = [
  { icon: ChefHat, title: "Master Chefs", desc: "Our experienced chefs craft every meal with culinary expertise and passion." },
  { icon: Leaf, title: "Fresh Ingredients", desc: "We source only the finest, freshest ingredients from trusted local suppliers." },
  { icon: Clock, title: "Fast Delivery", desc: "Hot food delivered to your door in under 45 minutes, guaranteed." },
  { icon: Star, title: "Top Rated", desc: "Consistently rated 4.9/5 by thousands of satisfied customers." },
  { icon: Truck, title: "Free Delivery", desc: "Enjoy free delivery on orders above ₹499. No hidden charges." },
  { icon: Shield, title: "Safe & Hygienic", desc: "Rigorous hygiene standards followed at every step of preparation." },
];

export default function WhyChooseUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section ref={ref} className="py-20 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">Why Us</span>
          <h2 className="section-heading mt-2">Why Choose FlavorHub</h2>
          <p className="text-brand-muted font-body mt-3 max-w-xl mx-auto">
            We&apos;re committed to delivering an unmatched dining experience every single time.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 group hover:border-brand-orange/30 transition-all duration-300 food-card"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange/20 to-brand-amber/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="font-heading font-semibold text-brand-text mb-2">{title}</h3>
              <p className="text-brand-muted font-body text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
