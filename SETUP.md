# AIPulse — Setup Guide / راهنمای راه‌اندازی

This document lists the accounts and keys needed to bring the booking, payment,
authentication, and calendar features online.

این سند حساب‌ها و کلیدهایی را که برای فعال‌سازی رزرو، پرداخت، احراز هویت و تقویم لازم است فهرست می‌کند.

---

## 0. Run locally / اجرای محلی

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

> Node is installed locally at `~/.local/node`. If `node` is not found, open a new
> terminal (the PATH line was added to `~/.zshrc`) or run:
> `export PATH="$HOME/.local/node/bin:$PATH"`

The marketing site (Home, About, Services, Contact) works **without any keys**.
Sign-in, booking, and payment need the services below.

---

## 1. Supabase (database + auth) — دیتابیس و ورود کاربران

1. Create a free project at https://supabase.com → New project.
2. **SQL Editor** → paste the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) → **Run**.
3. **Project Settings → API**, copy into `.env.local`:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (secret!)
4. **Authentication → Providers**: enable **Email**, and **Google** (paste the
   Google client id/secret from step 3 below).
5. To make yourself an **admin**: after you register on the site once, run in SQL Editor:
   `update public.profiles set role = 'admin' where email = 'YOU@example.com';`

## 2. Stripe (payments) — پرداخت

1. Create an account at https://stripe.com (test mode is fine to start).
2. **Developers → API keys**, copy into `.env.local`:
   - Publishable key (`pk_test_…`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key (`sk_test_…`) → `STRIPE_SECRET_KEY`
3. Webhook secret:
   - **Local:** `stripe login` then `stripe listen --forward-to localhost:3000/api/stripe/webhook`
     → copy the `whsec_…` it prints → `STRIPE_WEBHOOK_SECRET`.
   - **Production:** Dashboard → Developers → Webhooks → add endpoint
     `https://aipulse.ca/api/stripe/webhook` (event: `checkout.session.completed`).

## 3. Google Cloud (Calendar + Meet) — تقویم و لینک جلسه

1. https://console.cloud.google.com → create a project.
2. **APIs & Services → Library** → enable **Google Calendar API**.
3. **OAuth consent screen** → External → add yourself as a test user.
4. **Credentials → Create credentials → OAuth client ID → Web application**:
   - Authorized redirect URI: `http://localhost:3000/api/google/callback`
     (and later `https://aipulse.ca/api/google/callback`).
   - Copy Client ID → `GOOGLE_CLIENT_ID`, Client secret → `GOOGLE_CLIENT_SECRET`.
5. After deploy, the consultant connects their Google account once from the
   **admin panel** (`/admin`) — this stores the refresh token used to read
   availability and create Meet links.

## 4. Vercel (deploy) — انتشار

1. Push this repo to GitHub.
2. https://vercel.com → New Project → import the repo.
3. Add every variable from `.env.local` in **Project Settings → Environment Variables**
   (set `NEXT_PUBLIC_SITE_URL=https://aipulse.ca` and the production redirect/webhook URLs).
4. **Domains** → add `aipulse.ca` and follow the DNS instructions.

## 5. Email (optional) — ایمیل (اختیاری)

For the contact form to send email, create a https://resend.com account, verify the
`aipulse.ca` domain, and set `RESEND_API_KEY`. Without it, messages are logged to the
server console.

---

### What's needed from you next / قدم بعدی شما

To wire up sign-in, paid booking, payment, and auto Google Meet links, complete
**steps 1–3** above and paste the keys into `.env.local`. Then the live build of
those features can proceed and be tested end-to-end.

برای فعال‌سازی ورود، رزرو پولی، پرداخت و لینک خودکار Google Meet، مراحل ۱ تا ۳ را
انجام دهید و کلیدها را در `.env.local` قرار دهید. سپس ساخت زنده‌ی این بخش‌ها ادامه می‌یابد.
