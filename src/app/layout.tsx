import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlavorHub - Experience Premium Dining",
  description: "Delicious meals crafted with passion and premium ingredients. Order online or book a table.",
  keywords: ["restaurant", "food delivery", "premium dining", "FlavorHub"],
  openGraph: {
    title: "FlavorHub - Experience Premium Dining",
    description: "Delicious meals crafted with passion and premium ingredients.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} ${inter.variable} font-body bg-brand-dark text-brand-text antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#111114",
                  color: "#E8E8F0",
                  border: "1px solid #1E1E24",
                  borderRadius: "12px",
                  fontFamily: "var(--font-inter)",
                },
                success: { iconTheme: { primary: "#FF6B35", secondary: "#111114" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#111114" } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
