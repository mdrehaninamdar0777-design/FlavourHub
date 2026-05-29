"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Plus, Minus, ArrowLeft, Heart, Share2 } from "lucide-react";
import { Product, Review } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import FoodCard from "@/components/menu/FoodCard";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data.product);
          setReviews(data.data.reviews);
          // Fetch similar products
          const catRes = await fetch(`/api/products?category=${data.data.product.category}&limit=4`);
          const catData = await catRes.json();
          if (catData.success) setSimilar(catData.data.filter((p: Product) => p._id !== id).slice(0, 3));
        }
      } catch (err) { console.error("Failed to fetch product:", err); }
      finally { setLoading(false); }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-brand-dark pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-brand-dark pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🍽️</p>
        <h2 className="font-heading text-brand-text text-2xl mb-4">Product not found</h2>
        <button onClick={() => router.push("/menu")} className="btn-primary">Browse Menu</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-brand-muted hover:text-brand-orange transition-colors mb-8 font-body">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden orange-glow">
            <Image src={product.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            {product.isBestSeller && (
              <div className="absolute top-4 left-4 bg-brand-orange text-white text-sm font-bold px-3 py-1 rounded-xl">Best Seller</div>
            )}
          </div>
          {/* Details */}
          <div>
            <span className="text-brand-orange font-body text-sm font-medium uppercase tracking-widest capitalize">{product.category}</span>
            <h1 className="font-heading font-black text-brand-text text-4xl mt-2 mb-4">{product.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-brand-orange fill-brand-orange" : "text-brand-border"}`} />)}
              </div>
              <span className="text-brand-muted font-body">({product.reviewCount} reviews)</span>
            </div>
            <p className="text-brand-muted font-body leading-relaxed mb-6">{product.description}</p>
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="font-heading font-semibold text-brand-text mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span key={ing} className="px-3 py-1.5 glass-card text-brand-muted text-xs rounded-xl">{ing}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mb-8">
              <div>
                <span className="font-heading font-black text-brand-orange text-4xl">{formatCurrency(product.price)}</span>
                {product.originalPrice && <span className="text-brand-muted text-sm line-through ml-2">{formatCurrency(product.originalPrice)}</span>}
              </div>
            </div>
            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 glass-card p-1 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-brand-border rounded-lg transition-colors">
                  <Minus className="w-4 h-4 text-brand-muted" />
                </button>
                <span className="w-10 text-center font-heading font-bold text-brand-text">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-brand-border rounded-lg transition-colors">
                  <Plus className="w-4 h-4 text-brand-muted" />
                </button>
              </div>
              <button onClick={() => { addItem(product, quantity); }} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={() => toast.success("Added to wishlist!")} className="w-12 h-12 glass-card flex items-center justify-center hover:border-red-500/40 transition-colors rounded-xl">
                <Heart className="w-5 h-5 text-brand-muted hover:text-red-400 transition-colors" />
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="w-12 h-12 glass-card flex items-center justify-center hover:border-brand-orange/40 transition-colors rounded-xl">
                <Share2 className="w-5 h-5 text-brand-muted" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="font-heading font-bold text-brand-text text-2xl mb-6">Customer Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-brand-muted font-body">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-brand-orange to-brand-amber rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{(review.user?.name?.[0] || "U").toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-brand-text text-sm">{review.user?.name || "Anonymous"}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-brand-orange fill-brand-orange" : "text-brand-border"}`} />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-brand-muted font-body text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-brand-text text-2xl mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p) => <FoodCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}