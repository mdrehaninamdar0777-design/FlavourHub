"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const { get, post, put, del } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "pizza", price: "", originalPrice: "", stock: "100", isFeatured: false, isBestSeller: false, image: "", ingredients: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await get<{ success: boolean; data: Product[] }>("/api/products?limit=50");
      if (data.success) setProducts(data.data);
    } catch { } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm({ title: "", description: "", category: "pizza", price: "", originalPrice: "", stock: "100", isFeatured: false, isBestSeller: false, image: "", ingredients: "" });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({ title: product.title, description: product.description, category: product.category, price: product.price.toString(), originalPrice: product.originalPrice?.toString() || "", stock: product.stock.toString(), isFeatured: product.isFeatured, isBestSeller: product.isBestSeller, image: product.image, ingredients: product.ingredients?.join(", ") || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined, stock: parseInt(form.stock), ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean) };
      if (editProduct) {
        await put(`/api/products/${editProduct._id}`, payload);
        toast.success("Product updated!");
      } else {
        await post("/api/products", payload);
        toast.success("Product created!");
      }
      setShowModal(false);
      fetchProducts();
    } catch { toast.error("Failed to save product"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await del(`/api/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-brand-text text-2xl">Products</h1>
          <p className="text-brand-muted text-sm mt-1">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-dark pl-11 w-full max-w-sm" />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="glass-card p-4 h-48 skeleton" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <Image src={product.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"} alt={product.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => openEdit(product)} className="w-9 h-9 bg-brand-orange rounded-xl flex items-center justify-center hover:bg-brand-orange/80"><Pencil className="w-4 h-4 text-white" /></button>
                  <button onClick={() => handleDelete(product._id)} className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center hover:bg-red-600"><Trash2 className="w-4 h-4 text-white" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-heading font-semibold text-brand-text text-sm line-clamp-1">{product.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-brand-orange font-heading font-bold text-sm">{formatCurrency(product.price)}</span>
                  <span className="text-brand-muted text-xs capitalize bg-brand-border px-2 py-0.5 rounded-lg">{product.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading font-bold text-brand-text text-xl mb-6">{editProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "title", label: "Title", type: "text", placeholder: "Margherita Pizza" },
                { key: "image", label: "Image URL", type: "url", placeholder: "https://..." },
                { key: "price", label: "Price (₹)", type: "number", placeholder: "299" },
                { key: "originalPrice", label: "Original Price (₹, optional)", type: "number", placeholder: "399" },
                { key: "stock", label: "Stock", type: "number", placeholder: "100" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-brand-muted text-xs font-heading mb-1">{label}</label>
                  <input type={type} value={form[key as keyof typeof form] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required={key !== "originalPrice"} className="input-dark w-full" />
                </div>
              ))}
              <div>
                <label className="block text-brand-muted text-xs font-heading mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-dark w-full">
                  {["pizza","burgers","drinks","desserts","starters","mains"].map((c) => <option key={c} value={c} className="bg-brand-card capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-brand-muted text-xs font-heading mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the dish..." rows={3} required className="input-dark w-full resize-none" />
              </div>
              <div>
                <label className="block text-brand-muted text-xs font-heading mb-1">Ingredients (comma separated)</label>
                <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} placeholder="Cheese, Tomato, Basil" className="input-dark w-full" />
              </div>
              <div className="flex gap-6">
                {[["isFeatured","Featured"], ["isBestSeller","Best Seller"]].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="w-4 h-4 accent-brand-orange" />
                    <span className="text-brand-muted text-sm">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Package className="w-4 h-4" />}
                  {editProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}