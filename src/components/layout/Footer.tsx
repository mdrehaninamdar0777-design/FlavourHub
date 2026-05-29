"use client";
// ==========================================
// Footer Component
// ==========================================
import Link from "next/link";
import { UtensilsCrossed, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "Reserve a Table", href: "/reservation" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  "Categories": [
    { label: "Pizza", href: "/menu?category=pizza" },
    { label: "Burgers", href: "/menu?category=burgers" },
    { label: "Drinks", href: "/menu?category=drinks" },
    { label: "Desserts", href: "/menu?category=desserts" },
  ],
  "Account": [
    { label: "My Account", href: "/dashboard/profile" },
    { label: "Order History", href: "/dashboard/orders" },
    { label: "My Reservations", href: "/dashboard/reservations" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-card border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-brand-text">
                Flavor<span className="gradient-text">Hub</span>
              </span>
            </Link>
            <p className="text-brand-muted font-body text-sm leading-relaxed mb-6 max-w-xs">
              Delicious meals crafted with passion and premium ingredients. Experience the finest dining in town.
            </p>
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-brand-muted text-sm">
                <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>123 Flavor Street, Mumbai, India 400001</span>
              </div>
              <div className="flex items-center gap-3 text-brand-muted text-sm">
                <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-brand-muted text-sm">
                <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>hello@flavorhub.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading font-semibold text-brand-text mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-brand-muted text-sm hover:text-brand-orange transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-muted text-sm font-body">
            © {new Date().getFullYear()} FlavorHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 bg-brand-border rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors">
              <Facebook className="w-4 h-4 text-brand-muted hover:text-white" />
            </a>
            <a href="#" className="w-8 h-8 bg-brand-border rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors">
              <Instagram className="w-4 h-4 text-brand-muted hover:text-white" />
            </a>
            <a href="#" className="w-8 h-8 bg-brand-border rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors">
              <Twitter className="w-4 h-4 text-brand-muted hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
