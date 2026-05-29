// ==========================================
// Order Model
// ==========================================
import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    title: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  totalPrice: number;
  couponCode?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "placed" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentMethod: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  deliveryAddress: {
    label: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  specialInstructions?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    couponCode: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "razorpay",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    deliveryAddress: {
      label: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    specialInstructions: { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
