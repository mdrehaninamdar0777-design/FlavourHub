"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name);
      router.push("/");
    } catch (err: unknown) {
      const error = err as { code?: string };
      const msg = error.code === "auth/email-already-in-use" ? "Email already registered" : "Registration failed";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch { toast.error("Google sign-in failed"); }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-radial from-brand-orange/5 via-transparent to-transparent" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-brand-text">Flavor<span className="gradient-text">Hub</span></span>
          </Link>
          <h1 className="font-heading font-bold text-brand-text text-2xl">Create an account</h1>
          <p className="text-brand-muted font-body text-sm mt-2">Join FlavorHub today</p>
        </div>
        <button onClick={handleGoogle} className="w-full glass-card hover:border-brand-orange/40 p-3 flex items-center justify-center gap-3 rounded-xl transition-all mb-6">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          <span className="font-body font-medium text-brand-text text-sm">Continue with Google</span>
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-brand-muted text-xs">or register with email</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "John Doe" },
            { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "you@example.com" },
          ].map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label className="block text-brand-text text-sm font-heading font-medium mb-2">{label}</label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input type={type} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required className="input-dark w-full pl-11" />
              </div>
            </div>
          ))}
          <div>
            <label className="block text-brand-text text-sm font-heading font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" required className="input-dark w-full pl-11 pr-11" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-brand-text text-sm font-heading font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat password" required className="input-dark w-full pl-11" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-brand-muted text-sm mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-orange hover:text-brand-amber transition-colors font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}