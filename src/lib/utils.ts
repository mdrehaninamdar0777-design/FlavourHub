// ==========================================
// Utility Functions
// ==========================================
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(text: string, length = 100): string {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number
): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

export function generateOrderId(): string {
  return `FH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export const TAX_RATE = 0.05; // 5% GST
export const DELIVERY_FEE = 40;
export const FREE_DELIVERY_ABOVE = 499;

export function calculateOrderSummary(
  subtotal: number,
  discount: number = 0
): {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
} {
  const discountedSubtotal = subtotal - discount;
  const deliveryFee = discountedSubtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const tax = Math.round(discountedSubtotal * TAX_RATE);
  const total = discountedSubtotal + deliveryFee + tax;
  return { subtotal, discount, deliveryFee, tax, total };
}
