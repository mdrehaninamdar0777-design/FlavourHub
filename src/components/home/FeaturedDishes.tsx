"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import FoodCard from "@/components/menu/FoodCard";
import { Product } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedDishes() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products?featured=true&limit=4");
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-brand-dark to-brand-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">Featured</span>
            <h2 className="section-heading mt-2">Our Best Dishes</h2>
            <p className="text-brand-muted font-body mt-2">Handpicked favorites loved by our customers</p>
          </div>
          <Link href="/menu" className="hidden md:flex items-center gap-2 text-brand-orange font-body font-medium hover:gap-3 transition-all">
            View All Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-8 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <FoodCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link href="/menu" className="btn-outline">View Full Menu</Link>
        </div>
      </div>
    </section>
  );
}
