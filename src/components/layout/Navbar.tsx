"use client";
// ==========================================
// Main Navbar Component
// ==========================================
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Settings, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservation", label: "Reserve" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { firebaseUser, userProfile, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-dark/95 backdrop-blur-lg border-b border-brand-border shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-orange to-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-brand-text group-hover:text-brand-orange transition-colors">
              Flavor<span className="gradient-text">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-200 ${
                  pathname === link.href
                    ? "text-brand-orange bg-brand-orange/10"
                    : "text-brand-muted hover:text-brand-text hover:bg-brand-card"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-xl hover:bg-brand-card transition-colors group">
              <ShoppingCart className="w-5 h-5 text-brand-muted group-hover:text-brand-orange transition-colors" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Auth */}
            {firebaseUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-brand-card transition-colors"
                >
                  {userProfile?.image ? (
                    <img src={userProfile.image} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-orange/30" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-orange to-brand-amber rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {userProfile?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass-card shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-brand-border">
                        <p className="text-sm font-semibold text-brand-text truncate">{userProfile?.name}</p>
                        <p className="text-xs text-brand-muted truncate">{userProfile?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-brand-orange/20 text-brand-orange text-xs rounded-md font-semibold">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-muted hover:text-brand-text hover:bg-brand-border/50 transition-colors">
                          <User className="w-4 h-4" /> My Orders
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-muted hover:text-brand-text hover:bg-brand-border/50 transition-colors">
                          <Settings className="w-4 h-4" /> Profile Settings
                        </Link>
                        {isAdmin && (
                          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-orange hover:bg-brand-orange/10 transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); router.push("/"); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary text-sm py-2 px-5">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-brand-card transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark/98 border-t border-brand-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl font-body font-medium text-sm transition-all ${
                    pathname === link.href
                      ? "text-brand-orange bg-brand-orange/10"
                      : "text-brand-muted hover:text-brand-text hover:bg-brand-card"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
