# 🍽️ FlavorHub — Premium Restaurant Website

A complete, production-ready full-stack restaurant web application built with Next.js 15, MongoDB, Firebase Authentication, Razorpay payments, and Cloudinary image storage.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes (Node.js) |
| Database | MongoDB Atlas + Mongoose |
| Auth | Firebase Authentication (Email + Google) |
| Storage | Cloudinary |
| Payments | Razorpay |
| Charts | Recharts |
| Deployment | Vercel-ready |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx               # Homepage
│   ├── (main)/                # Public pages with navbar/footer
│   │   ├── menu/              # Menu listing + filters
│   │   ├── product/[id]/      # Product detail
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout + Razorpay
│   │   ├── reservation/       # Table booking
│   │   ├── about/             # About page
│   │   └── contact/           # Contact form
│   ├── auth/
│   │   ├── login/             # Login page
│   │   └── register/          # Register page
│   ├── dashboard/             # User dashboard
│   │   ├── orders/            # Order history
│   │   ├── reservations/      # Reservation history
│   │   └── profile/           # Profile settings
│   ├── admin/                 # Admin panel (role-protected)
│   │   ├── dashboard/         # Stats + charts
│   │   ├── products/          # CRUD products
│   │   ├── orders/            # Order management
│   │   ├── reservations/      # Reservation management
│   │   ├── users/             # User management
│   │   └── coupons/           # Coupon management
│   └── api/                   # REST API routes
│       ├── products/
│       ├── orders/
│       ├── reservations/
│       ├── users/
│       ├── coupons/
│       ├── reviews/
│       └── admin/stats/
├── components/
│   ├── layout/                # Navbar, Footer
│   ├── home/                  # Hero, Featured dishes, Testimonials, etc.
│   ├── menu/                  # FoodCard
│   └── admin/                 # AdminSidebar
├── context/
│   ├── AuthContext.tsx         # Firebase auth + user profile
│   └── CartContext.tsx         # Persistent cart
├── hooks/
│   └── useApi.ts              # Authenticated API hook
├── lib/
│   ├── mongodb.ts             # DB connection
│   ├── firebase.ts            # Firebase client
│   ├── firebase-admin.ts      # Firebase Admin SDK
│   ├── cloudinary.ts          # Image upload
│   ├── utils.ts               # Helpers
│   └── seed.ts                # Database seeder
├── middleware/
│   └── auth.ts                # Auth + admin middleware
├── models/                    # Mongoose models
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   ├── Reservation.ts
│   ├── Coupon.ts
│   └── Review.ts
└── types/
    └── index.ts               # TypeScript types
```

---

## ⚙️ Installation & Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd flavorhub
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in each variable (see sections below).

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project → Enable **Authentication**
3. Enable **Email/Password** and **Google** sign-in providers
4. Go to **Project Settings → General** → copy the config to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

5. For the **Admin SDK** (server-side), go to **Project Settings → Service Accounts → Generate new private key**
6. Copy values into:

```env
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> ⚠️ **Important**: Wrap `FIREBASE_PRIVATE_KEY` in double quotes and keep `\n` as literal `\n`.

---

## 🍃 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster → Create a database user
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Get your connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/flavorhub?retryWrites=true&w=majority
```

---

## ☁️ Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. From your dashboard, copy:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=flavorhub_uploads
```

3. In Cloudinary → Settings → Upload → Add an **unsigned upload preset** named `flavorhub_uploads`

---

## 💳 Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Use **Test Mode** for development
3. Go to Settings → API Keys → Generate a key pair:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

> For test payments use card `4111 1111 1111 1111`, any future expiry, any CVV.

---

## 🌱 Seed the Database

After setting up MongoDB, run the seeder to populate products and coupons:

```bash
npm run seed
```

This creates:
- **12 menu items** (pizzas, burgers, drinks, desserts)
- **3 discount coupons**: `WELCOME15`, `FIRST50`, `SAVE20`

---

## 👑 Create Your First Admin

1. Register a new account via the website
2. In MongoDB Atlas, find your user document in the `users` collection
3. Change `role` from `"customer"` to `"admin"`
4. Refresh the page — you'll see the **Admin Panel** link in the navbar

---

## 🏃 Running the Project

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploying to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) → Import your repo
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy!

> **Note**: In Vercel environment variables, paste the Firebase private key exactly as it is (with literal `\n`).

---

## 🎨 Customizing Your Brand

To replace the default FlavorHub branding:

| What to change | Where |
|---|---|
| Restaurant name/logo | `src/components/layout/Navbar.tsx`, `Footer.tsx`, `layout.tsx` |
| Colors | `tailwind.config.ts` → `brand` colors |
| Menu items | Run `npm run seed` after editing `src/lib/seed.ts` |
| Hero image | `src/components/home/HeroSection.tsx` → `backgroundImage` |
| Contact details | `src/components/layout/Footer.tsx` |
| SEO metadata | `src/app/layout.tsx` → `metadata` |

---

## 📱 Features

### Customer Features
- 🔍 Browse & search menu with filters and sorting
- 🛒 Add to cart with persistent localStorage
- 💳 Checkout with Razorpay (UPI, cards, net banking) or COD
- 🎟️ Apply coupon codes at checkout
- 📅 Reserve a table online
- 👤 User dashboard: order history, reservations, profile

### Admin Features
- 📊 Dashboard with revenue charts and live stats
- 🍕 Full CRUD for menu products with image upload
- 📦 Order management with status updates
- 📅 Reservation management
- 👥 User management
- 🎟️ Coupon creation and management

---

## 🔐 Security

- Firebase ID token verification on every protected API route
- Role-based access control (customer / admin)
- Razorpay webhook signature verification
- Input validation on all API endpoints
- No sensitive keys exposed to the client

---

## 📄 License

MIT — free to use and modify for your own restaurant business.
