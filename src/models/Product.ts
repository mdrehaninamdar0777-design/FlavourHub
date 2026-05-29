// ==========================================
// Product Model
// ==========================================
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
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
  isFeatured: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["pizza", "burgers", "drinks", "desserts", "starters", "mains"],
      index: true,
    },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 100, min: 0 },
    ingredients: [{ type: String }],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
