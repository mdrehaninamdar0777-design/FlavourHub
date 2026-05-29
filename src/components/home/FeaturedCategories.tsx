"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

const categories = [
  { name: "Pizza", emoji: "🍕", count: "8 items", href: "/menu?category=pizza", color: "from-red-500/20 to-orange-500/20" },
  { name: "Burgers", emoji: "🍔", count: "6 items", href: "/menu?category=burgers", color: "from-yellow-500/20 to-amber-500/20" },
  { name: "Drinks", emoji: "🥤", count: "8 items", href: "/menu?category=drinks", color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Desserts", emoji: "🍰", count: "6 items", href: "/menu?category=desserts", color: "from-pink-500/20 to-rose-500/20" },
];

export default function FeaturedCategories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">Categories</span>
          <h2 className="section-heading mt-2">Browse by Category</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={cat.href}
                className={`glass-card p-8 flex flex-col items-center gap-4 group hover:border-brand-orange/40 transition-all duration-300 food-card`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300`}>
                  {cat.emoji}
                </div>
                <div className="text-center">
                  <h3 className="font-heading font-semibold text-brand-text group-hover:text-brand-orange transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-brand-muted text-sm font-body mt-1">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
