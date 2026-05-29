"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, Camera, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ProfilePage() {
  const { firebaseUser, userProfile, loading: authLoading, refreshProfile } = useAuth();
  const { put } = useApi();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !firebaseUser) router.push("/auth/login");
    if (userProfile) setForm({ name: userProfile.name, phone: userProfile.phone || "" });
  }, [firebaseUser, authLoading, userProfile, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await put(`/api/users/${userProfile?._id}`, form);
      await refreshProfile();
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-brand-dark pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-heading mb-8">Profile Settings</motion.h1>
          <div className="glass-card p-8">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-brand-border">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-orange to-brand-amber rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {userProfile?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-orange rounded-full flex items-center justify-center shadow-md">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div>
                <h2 className="font-heading font-bold text-brand-text text-xl">{userProfile?.name}</h2>
                <p className="text-brand-muted text-sm">{userProfile?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-brand-orange/20 text-brand-orange text-xs rounded-lg font-semibold capitalize">{userProfile?.role}</span>
              </div>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-brand-text text-sm font-heading font-medium mb-2 flex items-center gap-1.5"><User className="w-4 h-4 text-brand-orange" /> Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required className="input-dark w-full" />
              </div>
              <div>
                <label className="block text-brand-text text-sm font-heading font-medium mb-2 flex items-center gap-1.5"><Mail className="w-4 h-4 text-brand-orange" /> Email</label>
                <input value={userProfile?.email || ""} disabled className="input-dark w-full opacity-50 cursor-not-allowed" />
                <p className="text-brand-muted text-xs mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-brand-text text-sm font-heading font-medium mb-2 flex items-center gap-1.5"><Phone className="w-4 h-4 text-brand-orange" /> Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="input-dark w-full" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}