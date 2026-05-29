"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function FoodCard({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const inCart = isInCart(product._id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="glass-card overflow-hidden group food-card">
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={product.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"}
          alt={product.title} fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/product/${product._id}`} className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
            View Details
          </Link>
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestSeller && <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-lg">Best Seller</span>}
          {discount > 0 && <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">{discount}% OFF</span>}
        </div>
        <button onClick={() => setWishlisted(!wishlisted)} className="absolute top-2 right-2 w-8 h-8 bg-brand-dark/70 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-brand-dark transition-colors">
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "text-red-500 fill-red-500" : "text-white/70"}`} />
        </button>
      </div>
      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-heading font-semibold text-brand-text text-sm leading-tight hover:text-brand-orange transition-colors line-clamp-2 mb-1">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-brand-orange fill-brand-orange" : "text-brand-border"}`} />
            ))}
          </div>
          <span className="text-brand-muted text-xs">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-brand-orange text-lg">{formatCurrency(product.price)}</span>
            {product.originalPrice && <span className="text-brand-muted text-xs line-through ml-1.5">{formatCurrency(product.originalPrice)}</span>}
          </div>
          <button
            onClick={() => addItem(product)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-semibold transition-all duration-200 ${inCart ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-brand-orange text-white hover:bg-brand-orange/90 hover:shadow-lg hover:shadow-orange-500/30"}`}
          >
            {inCart ? <><ShoppingCart className="w-3.5 h-3.5" /> In Cart</> : <><Plus className="w-3.5 h-3.5" /> Add</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
