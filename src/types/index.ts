// ==========================================
// FlavorHub - Global TypeScript Types
// ==========================================

export interface User {
  _id: string;
  uid: string; // Firebase UID
  name: string;
  email: string;
  role: "customer" | "admin";
  image?: string;
  phone?: string;
  addresses?: Address[];
  wishlist?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: "pizza" | "burgers" | "drinks" | "desserts" | "starters" | "mains";
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  ingredients?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalPrice: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "placed" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentMethod: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  deliveryAddress: Address;
  specialInstructions?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Reservation {
  _id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  guestCount: number;
  reservationDate: Date;
  reservationTime: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  tableNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  user?: Pick<User, "name" | "image">;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalReservations: number;
  revenueGrowth: number;
  ordersGrowth: number;
  recentOrders: Order[];
  popularProducts: Product[];
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}
