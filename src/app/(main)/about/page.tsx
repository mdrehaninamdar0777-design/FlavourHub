"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChefHat, Award, Users, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Happy Customers" },
  { icon: ChefHat, value: "15+", label: "Expert Chefs" },
  { icon: Award, value: "12+", label: "Awards Won" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
];

export default function AboutPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">About Us</span>
          <h1 className="section-heading mt-2 mb-4">Our Story</h1>
          <p className="text-brand-muted font-body max-w-2xl mx-auto leading-relaxed text-lg">
            FlavorHub was born from a simple passion: to bring exceptional restaurant-quality meals to everyone. Founded in 2019, we have grown from a small kitchen to one of the most beloved dining destinations in the city.
          </p>
        </motion.div>

        {/* Image + Mission */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <div className="relative rounded-3xl overflow-hidden aspect-square orange-glow">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" alt="Our kitchen" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">Our Mission</span>
            <h2 className="section-heading mt-2 mb-6">Crafting Memories, One Meal at a Time</h2>
            <p className="text-brand-muted font-body leading-relaxed mb-4">We believe that great food has the power to bring people together. Every dish we create is infused with passion, care, and the finest locally-sourced ingredients.</p>
            <p className="text-brand-muted font-body leading-relaxed mb-8">Our team of 15 expert chefs bring decades of culinary experience from across the world, ensuring every bite is a journey of flavors.</p>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="glass-card p-4 text-center">
                  <Icon className="w-6 h-6 text-brand-orange mx-auto mb-2" />
                  <p className="font-heading font-bold text-brand-text text-xl">{value}</p>
                  <p className="text-brand-muted text-xs">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}