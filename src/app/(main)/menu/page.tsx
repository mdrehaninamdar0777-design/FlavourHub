"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import FoodCard from "@/components/menu/FoodCard";
import { Product } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = [
  { value: "all", label: "All Items", emoji: "🍽️" },
  { value: "pizza", label: "Pizza", emoji: "🍕" },
  { value: "burgers", label: "Burgers", emoji: "🍔" },
  { value: "drinks", label: "Drinks", emoji: "🥤" },
  { value: "desserts", label: "Desserts", emoji: "🍰" },
  { value: "starters", label: "Starters", emoji: "🥗" },
  { value: "mains", label: "Mains", emoji: "🍛" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "12", sort, ...(category !== "all" && { category }), ...(search && { search }) });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) { setProducts(data.data); setTotalPages(data.pagination.pages); }
    } catch (err) { console.error("Failed to fetch products:", err); }
    finally { setLoading(false); }
  }, [page, sort, category, search]);

  useEffect(() => { const t = setTimeout(fetchProducts, search ? 500 : 0); return () => clearTimeout(t); }, [fetchProducts, search]);
  useEffect(() => { setPage(1); }, [category, search, sort]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    router.push(cat === "all" ? "/menu" : `/menu?category=${cat}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest">Our Menu</span>
          <h1 className="section-heading mt-2">Explore Our Dishes</h1>
          <p className="text-brand-muted font-body mt-3 max-w-xl mx-auto">From sizzling pizzas to refreshing drinks — discover flavors crafted for every craving.</p>
        </motion.div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes..." className="input-dark w-full pl-12 pr-10" />
            {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-brand-muted" /></button>}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-brand-muted flex-shrink-0" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-dark min-w-[180px]">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-brand-card">{o.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button key={cat.value} onClick={() => handleCategoryChange(cat.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-medium text-sm whitespace-nowrap transition-all duration-200 ${category === cat.value ? "bg-brand-orange text-white shadow-lg shadow-orange-500/30" : "glass-card text-brand-muted hover:text-brand-text hover:border-brand-orange/30"}`}>
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-4 space-y-3"><div className="skeleton h-4 w-3/4" /><div className="skeleton h-3 w-full" /><div className="skeleton h-8 w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🍽️</p>
            <h3 className="font-heading font-semibold text-brand-text text-xl mb-2">No dishes found</h3>
            <p className="text-brand-muted font-body">Try a different search or category</p>
            <button onClick={() => { setSearch(""); setCategory("all"); }} className="btn-outline mt-6">Clear Filters</button>
          </div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <FoodCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 glass-card text-brand-muted hover:text-brand-text disabled:opacity-40 rounded-xl">Previous</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-heading font-semibold text-sm transition-all ${page === i + 1 ? "bg-brand-orange text-white" : "glass-card text-brand-muted"}`}>{i + 1}</button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 glass-card text-brand-muted hover:text-brand-text disabled:opacity-40 rounded-xl">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return <Suspense fallback={<div className="min-h-screen bg-brand-dark pt-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /></div>}><MenuContent /></Suspense>;
}