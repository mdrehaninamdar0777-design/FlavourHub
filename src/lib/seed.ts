import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

// ── Inline schemas to avoid import issues ──────────────────────────────────

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  image: String,
  price: Number,
  originalPrice: Number,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  stock: { type: Number, default: 100 },
  ingredients: [String],
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const CouponSchema = new mongoose.Schema({
  code: String,
  discount: Number,
  discountType: String,
  minOrderAmount: Number,
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  expiryDate: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

// ── Seed Data ───────────────────────────────────────────────────────────────

const products = [
  // Pizzas
  {
    title: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella, vine tomatoes, and basil on a hand-tossed crust.",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80",
    price: 299, originalPrice: 399, rating: 4.8, reviewCount: 245, stock: 100,
    ingredients: ["Mozzarella", "Tomato Sauce", "Fresh Basil", "Olive Oil", "Flour"],
    isFeatured: true, isBestSeller: true, isAvailable: true,
  },
  {
    title: "Farmhouse Pizza",
    description: "Loaded with fresh garden vegetables, mushrooms, capsicum, and premium cheese blend.",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    price: 349, originalPrice: 449, rating: 4.6, reviewCount: 189, stock: 100,
    ingredients: ["Mixed Vegetables", "Mushrooms", "Capsicum", "Mozzarella", "Tomato Sauce"],
    isFeatured: true, isBestSeller: false, isAvailable: true,
  },
  {
    title: "Cheese Burst Pizza",
    description: "Indulge in our signature cheese-stuffed crust pizza loaded with triple cheese blend.",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80",
    price: 399, originalPrice: 499, rating: 4.9, reviewCount: 312, stock: 100,
    ingredients: ["Triple Cheese", "Tomato Sauce", "Garlic Butter", "Herbs"],
    isFeatured: true, isBestSeller: true, isAvailable: true,
  },
  // Burgers
  {
    title: "Chicken Burger",
    description: "Juicy grilled chicken patty with lettuce, tomato, pickles, and special house sauce.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    price: 199, originalPrice: 249, rating: 4.7, reviewCount: 178, stock: 100,
    ingredients: ["Chicken Patty", "Lettuce", "Tomato", "Pickles", "House Sauce", "Brioche Bun"],
    isFeatured: true, isBestSeller: true, isAvailable: true,
  },
  {
    title: "Veg Burger",
    description: "Crispy veggie patty with fresh vegetables and our secret blend of spices.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
    price: 169, originalPrice: 219, rating: 4.4, reviewCount: 134, stock: 100,
    ingredients: ["Veggie Patty", "Lettuce", "Tomato", "Onion", "Mint Sauce"],
    isFeatured: false, isBestSeller: false, isAvailable: true,
  },
  {
    title: "Double Cheese Burger",
    description: "Two smashed beef patties with double cheese, caramelized onions, and special sauce.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca368f?w=600&q=80",
    price: 279, originalPrice: 349, rating: 4.8, reviewCount: 267, stock: 100,
    ingredients: ["Double Beef Patty", "Cheddar Cheese", "Caramelized Onions", "Special Sauce", "Sesame Bun"],
    isFeatured: true, isBestSeller: true, isAvailable: true,
  },
  // Drinks
  {
    title: "Mojito",
    description: "Refreshing blend of lime juice, fresh mint, sugar, and sparkling water.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1609345265499-2133bbeb6ce5?w=600&q=80",
    price: 129, originalPrice: 159, rating: 4.6, reviewCount: 198, stock: 100,
    ingredients: ["Lime", "Fresh Mint", "Sugar", "Sparkling Water", "Ice"],
    isFeatured: false, isBestSeller: true, isAvailable: true,
  },
  {
    title: "Cold Coffee",
    description: "Rich and creamy iced coffee made with premium arabica beans and fresh milk.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    price: 149, originalPrice: 179, rating: 4.7, reviewCount: 156, stock: 100,
    ingredients: ["Arabica Coffee", "Full Cream Milk", "Sugar", "Ice", "Cream"],
    isFeatured: false, isBestSeller: false, isAvailable: true,
  },
  {
    title: "Fresh Juice",
    description: "Freshly squeezed seasonal fruit juice with no added preservatives or sugar.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80",
    price: 99, originalPrice: 129, rating: 4.5, reviewCount: 89, stock: 100,
    ingredients: ["Seasonal Fruits", "Natural Sweetener", "Ice"],
    isFeatured: false, isBestSeller: false, isAvailable: true,
  },
  // Desserts
  {
    title: "Chocolate Brownie",
    description: "Warm, fudgy chocolate brownie served with vanilla ice cream and chocolate drizzle.",
    category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
    price: 179, originalPrice: 219, rating: 4.9, reviewCount: 298, stock: 100,
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla Extract"],
    isFeatured: true, isBestSeller: true, isAvailable: true,
  },
  {
    title: "Ice Cream Sundae",
    description: "Three scoops of premium ice cream with hot fudge, whipped cream, and cherries.",
    category: "desserts",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
    price: 159, originalPrice: 199, rating: 4.7, reviewCount: 211, stock: 100,
    ingredients: ["Vanilla Ice Cream", "Hot Fudge", "Whipped Cream", "Cherry", "Sprinkles"],
    isFeatured: false, isBestSeller: false, isAvailable: true,
  },
  {
    title: "New York Cheesecake",
    description: "Creamy, dense New York-style cheesecake on a graham cracker crust with berry compote.",
    category: "desserts",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
    price: 199, originalPrice: 249, rating: 4.8, reviewCount: 176, stock: 100,
    ingredients: ["Cream Cheese", "Graham Cracker", "Eggs", "Sugar", "Berry Compote"],
    isFeatured: true, isBestSeller: false, isAvailable: true,
  },
];

const coupons = [
  {
    code: "WELCOME15",
    discount: 15,
    discountType: "percentage",
    minOrderAmount: 199,
    maxDiscount: 150,
    usageLimit: 500,
    usedCount: 0,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    code: "FIRST50",
    discount: 50,
    discountType: "fixed",
    minOrderAmount: 299,
    usageLimit: 200,
    usedCount: 0,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    code: "SAVE20",
    discount: 20,
    discountType: "percentage",
    minOrderAmount: 399,
    maxDiscount: 200,
    usageLimit: 1000,
    usedCount: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
];

// ── Run Seeder ──────────────────────────────────────────────────────────────

async function seed() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not set in .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Clear and reseed products
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(products);
  console.log(`Seeded ${createdProducts.length} products`);

  // Clear and reseed coupons
  await Coupon.deleteMany({});
  const createdCoupons = await Coupon.insertMany(coupons);
  console.log(`Seeded ${createdCoupons.length} coupons`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\nAvailable coupon codes:");
  coupons.forEach((c) =>
    console.log(`  - ${c.code}: ${c.discount}${c.discountType === "percentage" ? "%" : "₹"} off`)
  );

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});