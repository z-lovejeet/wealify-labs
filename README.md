<p align="center">
  <img src="public/brand-icon.png" alt="Wealify Labs" width="80" />
</p>

<h1 align="center">Wealify Labs — AI-Powered Digital Wealth Platform</h1>

<p align="center">
  <strong>A premium, full-stack digital course and AI venture studio platform built with Next.js 16, Supabase, Groq 120B Reasoning Engine, and NOWPayments cryptocurrency checkout.</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#ai-venture-studio">AI Venture Studio</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#performance-optimizations">Performance</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#vercel-deployment-guide">Vercel Deployment</a> •
  <a href="#contact">Contact</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Groq-120B%20Reasoning-F05A28?logo=groq" alt="Groq" />
  <img src="https://img.shields.io/badge/NOWPayments-Crypto%20Gateway-2F76F6" alt="NOWPayments" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel" alt="Vercel" />
</p>

---

## Overview

**Wealify Labs** (founded in **December 2025** by **Lovejeet Singh**) is a production-grade digital education and automated venture acceleration platform. Designed for creators, software builders, and digital entrepreneurs, the platform couples comprehensive curriculum delivery with an embedded **AI Venture Studio** to help students construct sustainable digital income streams.

The platform hosts **"The Modern Side Hustle Blueprint"** — an intensive masterclass featuring 7 modules and 47 chapters covering mindset, market validation, offer engineering, organic distribution, automated funnels, and monetization systems.

- **Flagship Pricing:** **$14.99 USD** (70% limited launch discount from the regular catalog price of $49.99).
- **Access Model:** One-time purchase, lifetime unrestricted access, zero recurring subscriptions.

---

## 🤖 AI Venture Studio

Wealify Labs features an embedded AI acceleration suite running on a high-throughput reasoning architecture (`openai/gpt-oss-120b` via Groq, with an abstraction layer designed for multi-model inference and Claude 3.5 Sonnet / 3.7 integration):

| AI Tool | Functionality | Access |
| :--- | :--- | :--- |
| **24/7 AI Masterclass Mentor** | Context-aware curriculum assistant trained on course frameworks to answer questions, explain concepts, and provide lesson recaps in seconds. | Included ($0) |
| **Venture Viability Auditor** | Evaluates business concepts, calculates unit economics (CAC, LTV, payback periods), and stress-tests audience acquisition loops before deploying capital. | Included ($0) |
| **Direct-Response Offer & Copy Architect** | Generates high-converting landing page headlines, video sales letter (VSL) hooks, email sequences, and value propositions. | Included ($0) |

The AI endpoint is live at `POST /api/ai/mentor` and accessible through interactive playground cards in the student dashboard, landing page showcase, and course viewer.

---

## Features

### 🎓 Modern Student Experience
- **Interactive Landing Page** — Sleek dark-obsidian aesthetic with animated feature ribbons, live AI Venture Studio playground, infinite testimonials, and responsive navigation.
- **Cinema Course Player (`/learn/[courseId]`)** — Immersive full-screen learning environment with a distraction-free top bar, one-click return to dashboard, chapter navigation tabs, lesson completion toggles, and integrated PDF workspace reader.
- **Student Dashboard (`/dashboard`)** — Real-time progress percentage, lesson counters, active certificate previews, and quick-launch AI tool modals.
- **Curriculum Hub (`/my-courses`)** — Clean overview of enrolled masterclasses and integrated AI Venture Studio launcher.
- **Verifiable Certificates** — Automatically issues an official completion certificate once all 47 chapters are marked completed.

### 💳 Distraction-Free Luxury Checkout (`/checkout`)
- **Standalone Layout** — Completely decoupled from the sidebar layout, delivering an Apple/Stripe-grade distraction-free payment flow.
- **Cryptocurrency Gateway (NOWPayments)** — Primary active payment gateway supporting **300+ cryptocurrencies** (BTC, ETH, USDT, SOL, USDC, LTC, BNB, etc.) with automated instant blockchain confirmation and enrollment activation.
- **PayPal / Card Gateway** — Integrated with `@paypal/react-paypal-js`, currently rendered in a graceful **"Temporarily Disabled / Scheduled Maintenance"** state for compliance.
- **Security & Integrity** — 256-bit SSL encryption badge, verified student email binding, and clear $14.99 launch pricing breakdown.

### 🛡️ Admin Management Portal (`/admin`)
- **Revenue Analytics** — Financial overview and monthly growth metrics powered by Recharts.
- **Student Management** — User list, profile roles (Admin vs. Student), and account verification.
- **Order & Transaction Tracking** — Auditable payment records across crypto and fiat gateways.
- **Course & Content Manager** — Dynamic management of modules, chapters, and downloadable resources.
- **Gateway Toggles** — Instant real-time enabling/disabling of payment gateways via `platform_settings`.
- **Contact Message Inbox** — Review inquiries submitted via the public contact form.

### 🌐 Public & Brand Pages
- **Homepage (`/`)** — High-converting landing page with hero, live AI runner, curriculum breakdown, metrics ribbon, and social proof.
- **Pricing Page (`/pricing`)** — Transparent value stack highlighting the $14.99 discount, AI Studio inclusion, and comprehensive FAQ.
- **About Us (`/about`)** — Story, Dec 2025 founding milestones, founder profile, and hybrid AI learning vision.
- **Contact Page (`/contact`)** — Direct contact form submitting directly to Supabase with instant toast feedback.
- **Legal Compliance (`/terms`, `/privacy`)** — Enterprise-ready terms of service and privacy policies.

---

## ⚡ Performance Optimizations

To deliver instantaneous page transitions and eliminate perceived lag, the routing layer was re-architected:

1. **Fast-Path Middleware Routing** (`src/lib/supabase/middleware.ts`):
   - Previously, every navigation and link prefetch executed `await supabase.auth.getUser()`, blocking page transitions for 200–500ms on remote Supabase HTTPS roundtrips.
   - Purely public routes (`/`, `/about`, `/pricing`, `/contact`, `/terms`, `/privacy`) now bypass remote auth calls entirely and return in **<1ms**.
   - Added auth-cookie presence verification (`hasAuthCookie`) to instantly short-circuit unauthenticated redirects without database delays.
2. **Public Layout Optimization** (`src/app/(public)/layout.tsx`):
   - Eliminated redundant `platform_settings` table queries and deferred auth lookups unless session cookies are present.
3. **Transition Latency Benchmarks (Measured)**:
   - `/about`: **21ms** (was ~550ms — **96% faster**)
   - `/contact`: **22ms** (was ~520ms — **95% faster**)
   - `/` (Home): **230ms** (was ~700ms — **67% faster**)
   - `/pricing`: **380ms** (was ~1,200ms — **68% faster**)
   - Protected redirect: **2.5ms**

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React Server Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode, 0 errors) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + RLS + SSR Auth) |
| **AI Reasoning Engine** | [Groq](https://groq.com/) (`openai/gpt-oss-120b` with multi-provider Claude abstraction) |
| **Payment Gateways** | [NOWPayments API](https://nowpayments.io/) (Crypto) + [PayPal REST API](https://developer.paypal.com/) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│  Next.js App Router • React 19 • Tailwind • Framer Motion  │
├──────────┬──────────┬───────────────┬───────────────────────┤
│ (public) │  (auth)  │    (user)     │       (admin)         │
│  Landing │  Login   │  Dashboard    │   Admin Dashboard     │
│  Pricing │ Register │  My Courses   │   Users / Orders      │
│  About   │ Callback │  Settings     │   Certificates        │
│  Contact │          │  Profile      │   Settings / Reviews  │
│  Terms   │          └───────────────┤   Messages            │
│  Privacy │  Standalone Routes:      │                       │
│          │  /checkout (No sidebar)  │                       │
│          │  /learn/[id] (Cinema)    │                       │
├──────────┴──────────────────────────┴───────────────────────┤
│                     MIDDLEWARE LAYER                         │
│  Fast-path public bypass (<1ms) • Session & Role Protection │
├─────────────────────────────────────────────────────────────┤
│                     SERVER LAYER                            │
│  Server Components • Server Actions • API Routes           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ /api/ai      │  │ /app/actions │  │ /api/webhooks     │  │
│  │ Groq 120B    │  │ admin.ts     │  │ NOWPayments IPN   │  │
│  │ Multi-model  │  │ settings.ts  │  │ PayPal IPN        │  │
│  ├──────────────┤  │ auth.ts      │  ├───────────────────┤  │
│  │/api/payments │  │ contact.ts   │  │ Storage / Buckets │  │
│  │ NOWPayments  │  └──────────────┘  │ PDF Worksheets    │  │
│  │ PayPal Orders│                    │ Certificates      │  │
│  └──────────────┘                    └───────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     DATA LAYER (Supabase)                   │
│  PostgreSQL • Row Level Security (RLS) • Auth               │
│  profiles • courses • modules • lessons • progress • orders │
│  payments • certificates • reviews • platform_settings      │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

Configure the following variables in `.env.local` for local development, and in your **Vercel Project Settings > Environment Variables** for production:

```env
# ─── Supabase Configuration ───
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# ─── AI Venture Studio Engine ───
GROQ_API_KEY=gsk_your-groq-api-key

# ─── NOWPayments (Cryptocurrency Gateway) ───
NOWPAYMENTS_API_KEY=your-nowpayments-api-key
NOWPAYMENTS_IPN_SECRET=your-ipn-callback-secret

# ─── PayPal Integration ───
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_API_URL=https://api-m.paypal.com   # Use https://api-m.sandbox.paypal.com for testing

# ─── Platform URL ───
NEXT_PUBLIC_APP_URL=https://wealifylabs.site   # Or http://localhost:3000 for local development
```

---

## Vercel Deployment Guide

The application is deployed on **Vercel** with automatic deployment triggers on git push.

### ⚠️ Pre-Deployment Settings Checklist in Vercel

Before triggering a commit, ensure your Vercel Project has the following settings configured:

#### 1. Project Root Directory
- In **Vercel Dashboard → Your Project → Settings → General → Root Directory**:
  - If your repository root contains the `course-platform` folder: Set Root Directory to **`course-platform`**.
  - If your repository root is already the Next.js app: Leave it as **`./`**.

#### 2. Environment Variables Checklist
Navigate to **Settings → Environment Variables** on Vercel and verify all 9 variables are set for **Production, Preview, and Development**:

| Variable Name | Required | Notes |
| :--- | :---: | :--- |
| `GROQ_API_KEY` | **CRITICAL** | Required for all 3 AI Venture Studio tools (`/api/ai/mentor`). |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Your Supabase project URL (`https://...supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Supabase anonymous public key. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Supabase service role key (for webhook fulfillment). |
| `NOWPAYMENTS_API_KEY` | **Yes** | Live API key from NOWPayments account. |
| `NOWPAYMENTS_IPN_SECRET` | **Yes** | Instant Payment Notification secret for webhook validation. |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Set to your live production domain: `https://wealifylabs.site`. |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Optional | Live PayPal client ID (gateway is currently toggled disabled). |
| `PAYPAL_CLIENT_SECRET` | Optional | Live PayPal client secret. |
| `PAYPAL_API_URL` | Optional | `https://api-m.paypal.com` (Live). |

#### 3. Build & Development Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (or leave default `next build`)
- **Install Command**: `npm install`
- **Node.js Version**: `20.x` or `18.x`

---

## Local Development & Scripts

```bash
# 1. Install dependencies
npm install

# 2. Type-check with TypeScript (0 errors)
npx tsc --noEmit

# 3. Run ESLint (0 errors)
npm run lint

# 4. Start local development server
npm run dev

# 5. Production build test
npm run build
```

---

## Contact & Support

- **Primary Support:** [support@wealifylabs.site](mailto:support@wealifylabs.site)
- **Secondary Contact:** [wealifylabs@gmail.com](mailto:wealifylabs@gmail.com)
- **Founder:** Lovejeet Singh ([lovejeet@wealifylabs.site](mailto:lovejeet@wealifylabs.site))
- **Website:** [wealifylabs.site](https://wealifylabs.site)

---

<p align="center">
  Crafted with precision by <strong>Wealify Labs</strong> &bull; Founded Dec 2025
</p>
