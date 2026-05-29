// ==========================================
// Coupon Model
// ==========================================
import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
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

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
