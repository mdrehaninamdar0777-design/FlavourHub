"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, CalendarDays, Users, Tag, UtensilsCrossed, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/reservations", icon: CalendarDays, label: "Reservations" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/coupons", icon: Tag, label: "Coupons" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <aside className="w-64 bg-brand-card border-r border-brand-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-brand-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-orange to-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-heading font-bold text-brand-text">FlavorHub</span>
            <p className="text-brand-muted text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body font-medium text-sm transition-all duration-200 ${pathname === href || pathname.startsWith(href + "/") ? "bg-brand-orange text-white shadow-lg shadow-orange-500/30" : "text-brand-muted hover:text-brand-text hover:bg-brand-border/50"}`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-brand-border">
        <button onClick={() => { logout(); router.push("/"); }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors w-full font-body font-medium text-sm">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}