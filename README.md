<p align="center">
  <img src="public/brand-icon.png" alt="Wealify Labs" width="80" />
</p>

<h1 align="center">Wealify Labs — Course Platform</h1>

<p align="center">
  <strong>A premium, full-stack digital course selling platform built with Next.js 16, Supabase, and modern payment integrations.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel" alt="Vercel" />
</p>

---

## Overview

**Wealify Labs Course Platform** is a production-grade, single-course digital product platform designed for creators, educators, and entrepreneurs to sell premium online courses. It features a polished dark-mode UI, a complete learning management system (LMS), dual payment gateways (PayPal + Cryptocurrency), a full admin dashboard with analytics, and certificate generation — all powered by a modern serverless architecture.

The platform currently hosts **"The Modern Side Hustle Blueprint"** — a comprehensive digital wealth course with 7 modules and 47 in-depth chapters.

---

## Features

### 🎓 Student Experience
- **Animated Landing Page** — Premium hero section with Framer Motion animations, infinite testimonial marquee, benefit cards, and clear CTAs
- **Course Player** — Immersive, sidebar-based learning interface with progress tracking, lesson navigation, and chapter-by-chapter content delivery
- **Progress Tracking** — Automatic lesson completion tracking and enrollment-based access control
- **User Profiles** — Authenticated profile pages showing enrollment status, account details, and course access
- **Certificate of Completion** — Auto-generated certificates upon completing all modules
- **Social Proof Popups** — Dynamic purchase notification popups with global user data (200+ mock users across 25+ countries)

### 💳 Payments & Checkout
- **PayPal Integration** — Full PayPal checkout flow with order creation, capture, and enrollment activation via `@paypal/react-paypal-js`
- **Cryptocurrency Payments** — NOWPayments integration supporting BTC, ETH, USDC, LTC, and more with invoice-based checkout
- **Admin-Toggleable Gateways** — Payment methods can be enabled/disabled from the admin settings panel in real-time
- **Webhook Verification** — Server-side webhook handlers for both PayPal and NOWPayments to verify payments and auto-enroll users
- **Secure Checkout Flow** — SSL-encrypted, step-by-step checkout with order summary, social proof, and payment method selection

### 🛡️ Admin Dashboard
- **Revenue Analytics** — Total revenue, month-over-month growth, and interactive revenue chart powered by Recharts
- **User Management** — View all registered users, roles, and account details
- **Order Management** — Track all payments, statuses, and transaction history
- **Course Manager** — Full CRUD for course content management
- **Certificate Management** — View and manage issued certificates
- **Contact Messages** — Inbox for user-submitted contact form messages
- **Reviews Management** — Moderate and manage course reviews
- **Platform Settings** — Toggle payment gateways, manage site-wide configurations, and update platform preferences
- **Responsive Admin Layout** — Dedicated sidebar navigation with mobile-friendly header

### 🌐 Public Pages
- **Homepage** — Conversion-optimized landing page with hero, benefits, testimonials, and pricing sections
- **Pricing Page** — Detailed value proposition with dynamic pricing card showing real course data
- **About Page** — Brand story and mission
- **Contact Page** — Contact form with server action submission to Supabase
- **Privacy Policy & Terms of Service** — Legal compliance pages
- **Maintenance Mode** — Dedicated maintenance page for scheduled downtime

### 🔐 Authentication & Security
- **Supabase Auth** — Email/password authentication with OAuth callback support
- **Row Level Security (RLS)** — Comprehensive Supabase RLS policies for profiles, enrollments, payments, certificates, reviews, and contact messages
- **Middleware Protection** — Next.js middleware for session management and route protection
- **Role-Based Access Control** — Admin vs. student role separation with server-side verification
- **Server Actions** — Secure server-side mutations for all critical operations (admin actions, settings, auth)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React Server Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Authentication** | [Supabase Auth](https://supabase.com/docs/guides/auth) (SSR mode via `@supabase/ssr`) |
| **Payments** | [PayPal REST API](https://developer.paypal.com/) + [NOWPayments](https://nowpayments.io/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) (toast notifications) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│  Next.js App Router • React 19 • Tailwind • Framer Motion  │
├──────────┬──────────┬───────────────┬───────────────────────┤
│  (public)│  (auth)  │    (user)     │       (admin)         │
│  Landing │  Login   │  Dashboard    │   Admin Dashboard     │
│  Pricing │ Register │  Learn/Player │   Users / Orders      │
│  About   │ Callback │  My Courses   │   Certificates        │
│  Contact │          │  Checkout     │   Settings / Reviews  │
│  Privacy │          │  Profile      │   Messages            │
├──────────┴──────────┴───────────────┴───────────────────────┤
│                     MIDDLEWARE LAYER                         │
│          Session refresh • Route protection                 │
├─────────────────────────────────────────────────────────────┤
│                     SERVER LAYER                            │
│  Server Components • Server Actions • API Routes           │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ /api/payments│  │ /app/actions │  │ /api/webhooks     │  │
│  │ PayPal APIs  │  │ admin.ts     │  │ PayPal webhook    │  │
│  │ Crypto APIs  │  │ settings.ts  │  │ NOWPayments webhook│ │
│  └─────────────┘  │ auth.ts      │  └───────────────────┘  │
│                    │ contact.ts   │                          │
│                    └──────────────┘                          │
├─────────────────────────────────────────────────────────────┤
│                     DATA LAYER                              │
│  Supabase PostgreSQL • Row Level Security • Storage         │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ profiles │ │enrollments│ │ payments │ │platform_     │  │
│  │ courses  │ │ modules   │ │ reviews  │ │  settings    │  │
│  │ lessons  │ │ progress  │ │ certs    │ │ contacts     │  │
│  └──────────┘ └───────────┘ └──────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Route Groups

| Group | Purpose | Auth Required |
|-------|---------|:---:|
| `(public)` | Marketing pages — Home, Pricing, About, Contact, Legal | ❌ |
| `(auth)` | Login & Registration flows | ❌ |
| `(user)` | Student dashboard, learning player, profile, checkout | ✅ |
| `(admin)` | Admin dashboard, user/order/content management, settings | ✅ (Admin role) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** (or yarn / pnpm)
- A [Supabase](https://supabase.com/) project
- A [PayPal Developer](https://developer.paypal.com/) account (for payments)
- A [NOWPayments](https://nowpayments.io/) account (optional, for crypto)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/z-lovejeet/wealify-labs.git
cd wealify-labs/course-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials (see section below)

# 4. Run database migrations
# Apply each migration file in supabase/migrations/ to your Supabase project

# 5. (Optional) Seed content
npx ts-node scripts/seed-modules.ts
npx ts-node scripts/seed-lessons.ts

# 6. Start the development server
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the `course-platform` directory with the following variables:

```env
# ─── Supabase ───
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── PayPal ───
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com   # Use live URL for production

# ─── NOWPayments (Crypto) ───
NOWPAYMENTS_API_KEY=your-nowpayments-api-key
NOWPAYMENTS_IPN_SECRET=your-ipn-secret

# ─── App ───
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** Never commit `.env.local` to version control. The `.gitignore` is configured to exclude all `.env*` files.

---

## Project Structure

```
course-platform/
├── public/                      # Static assets (favicons, brand icons, review images)
├── scripts/                     # Database seeding & migration scripts
│   ├── create-progress-table.ts
│   ├── seed-lessons.ts
│   ├── seed-modules.ts
│   └── upload-pdfs.ts
├── src/
│   ├── actions/                 # Server-side actions (contact, storage)
│   ├── app/
│   │   ├── (admin)/             # Admin panel (dashboard, users, orders, settings, etc.)
│   │   ├── (auth)/              # Authentication pages (login, register)
│   │   ├── (public)/            # Public marketing pages (home, pricing, about, contact)
│   │   ├── (user)/              # Authenticated user pages (learn, checkout, profile)
│   │   ├── actions/             # Server actions (admin, auth, settings)
│   │   ├── api/                 # API routes
│   │   │   ├── payments/        # PayPal & NOWPayments endpoints
│   │   │   └── webhooks/        # Payment verification webhooks
│   │   ├── auth/                # Auth callback & error handlers
│   │   └── maintenance/         # Maintenance mode page
│   ├── components/
│   │   ├── admin/               # Admin-specific components (charts, user mgmt, settings)
│   │   ├── layout/              # Shared layout components (navbar, footer, sidebars)
│   │   └── ui/                  # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── data/                    # Static data (social proof user list)
│   ├── lib/
│   │   ├── supabase/            # Supabase client initialization (server, middleware, browser)
│   │   ├── mock-data.ts         # Course data & fallback content
│   │   ├── paypal.ts            # PayPal API helper utilities
│   │   ├── get-url.ts           # URL resolution utilities
│   │   └── utils.ts             # General utility functions (cn, etc.)
│   └── middleware.ts            # Session management & route protection
├── supabase/
│   └── migrations/              # SQL migration files (RLS policies, indexes, RPCs)
├── next.config.ts               # Next.js configuration (image domains, etc.)
├── tailwind.config.ts           # Tailwind CSS configuration with shadcn/ui theme
├── components.json              # shadcn/ui component configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

---

## Database Schema

The platform uses Supabase (PostgreSQL) with the following core tables:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles linked to Supabase Auth (name, email, avatar, role) |
| `courses` | Course metadata (title, description, price, slug) |
| `modules` | Course modules / sections |
| `lessons` | Individual lessons within modules |
| `enrollments` | User ↔ Course enrollment records (grants access) |
| `progress` | Per-lesson completion tracking for enrolled users |
| `payments` | Payment transaction records (amount, status, provider, user) |
| `certificates` | Issued completion certificates |
| `reviews` | User-submitted course reviews and ratings |
| `contacts` | Contact form submissions |
| `platform_settings` | Key-value store for site-wide configuration (payment toggles, etc.) |

All tables are protected by **Row Level Security (RLS)** policies. Migration files are located in `supabase/migrations/`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server (Next.js) |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

### Seed Scripts

```bash
# Seed course modules into the database
npx ts-node scripts/seed-modules.ts

# Seed lessons for each module
npx ts-node scripts/seed-lessons.ts

# Create progress tracking table
npx ts-node scripts/create-progress-table.ts

# Upload PDF resources to Supabase Storage
npx ts-node scripts/upload-pdfs.ts
```

---

## Deployment

The platform is deployed on **Vercel** with automatic deployments from the `main` branch.

### Deploy to Vercel

1. Push to GitHub
2. Import the repository on [Vercel](https://vercel.com/new)
3. Set the **Root Directory** to `course-platform`
4. Add all environment variables from `.env.local` to the Vercel project settings
5. Deploy

> The platform uses **Vercel Analytics** for production usage monitoring.

### Post-Deployment Checklist

- [ ] Switch PayPal API URL from sandbox to live
- [ ] Verify webhook endpoints are publicly accessible
- [ ] Set correct `NEXT_PUBLIC_APP_URL` for production
- [ ] Run database migrations on your Supabase project
- [ ] Seed initial course content

---

## Key Design Decisions

- **Single-Course Architecture** — Built as a focused, single-product platform rather than a multi-course marketplace. This simplifies the UX and drives higher conversions.
- **Server Components First** — Pages are rendered on the server by default for optimal performance and SEO. Client components are used only where interactivity is required.
- **Dark Mode Default** — The UI defaults to a dark theme (`class="dark"` on `<html>`) with a curated HSL color system via CSS variables for a premium visual identity.
- **Dual Payment Gateways** — Supporting both traditional (PayPal) and crypto (NOWPayments) opens the platform to a global audience without geographic payment restrictions.
- **Admin-Controlled Settings** — Payment gateways and platform behaviors are configurable via the admin panel, requiring no code changes to update.

---

## Contributing

This is a private project by **Wealify Labs**. For internal contributions:

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request for review

---

## Contact

- **Email:** wealifylabs@gmail.com
- **GitHub:** [@z-lovejeet](https://github.com/z-lovejeet)

---

<p align="center">
  Built with ❤️ by <strong>Wealify Labs</strong>
</p>
