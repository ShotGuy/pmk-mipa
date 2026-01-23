# TECH STACK & ARCHITECTURE BRIEF
Project: Integrated Church System & Promotional Landing Page
Target Deployment: Vercel Production
Domain Provider: Domainesia

## 1. CORE FRAMEWORK & ENVIRONMENT
- **Framework:** Next.js 14+ (App Router)
  - *Reason:* Wajib menggunakan App Router untuk memanfaatkan React Server Components (RSC) demi SEO maksimal di Landing Page dan performa tinggi di Dashboard.
- **Language:** TypeScript (Strict Mode)
  - *Rule:* `no-implicit-any` is ON. Kita berurusan dengan Data Keuangan dan 10 Role User. Type safety adalah harga mati.
- **Package Manager:** pnpm (Faster disk space efficient)

## 2. BACKEND & DATA LAYER
- **Database:** PostgreSQL (via Supabase)
  - *Reason:* Relational integrity dibutuhkan untuk relasi kompleks (User <-> Role <-> Absensi <-> Keuangan).
- **ORM:** Prisma
  - *Strategy:* Gunakan Prisma Client untuk type-safe database queries.
  - *Schema Focus:* Perhatikan relasi One-to-Many pada `Ibadah` ke `Absensi`.
- **Obejct Storage** Domainesia Object Storage
- **API Architecture:** Next.js Server Actions
  - *Note:* Jangan buat API Route terpisah kecuali mendesak. Gunakan Server Actions untuk mutasi data (CRUD) langsung dari component demi efisiensi Vercel Function execution time.

## 3. AUTHENTICATION & SECURITY (CRITICAL)
- **Library:** Auth.js (v5) / NextAuth
- **Provider:** Credentials Provider (Email/Password)
- **Role-Based Access Control (RBAC):**
  - Implementasi Logic pada `middleware.ts`.
  - **Roles Enum:** `ADMIN`, `KETUA`, `SEKRETARIS`, `BENDAHARA`, `KOOR_KTB`, `KOOR_ACARA`, `KOOR_DOA`, `ANGGOTA_ACARA`, `ANGGOTA_KTB`, `ANGGOTA_DOA`.
  - *Security Rule:* Middleware harus mem-block akses ke `/dashboard/*` jika session null, dan redirect user jika mengakses route yang tidak sesuai role-nya.

## 4. FRONTEND - LANDING PAGE (PUBLIC)
- **Goal:** SEO Rank #1 & "Wow Factor"
- **Styling:** Tailwind CSS
- **CMS:** Sanity.io
  - *Reason:* Client non-teknis akan update konten berita/blog di sini. Gunakan `next-sanity` untuk fetch data saat build time (ISR) atau request time.
- **Animation:** Framer Motion
  - *Usage:* Scroll reveal, Hero section text stagger, dan micro-interactions agar terlihat premium.
- **SEO:** Next.js Metadata API
  - *Dynamic:* Open Graph image dan Meta Description harus digenerate dinamis dari konten Sanity.

## 5. FRONTEND - DASHBOARD (PRIVATE/SYSTEM)
- **UI Component Library:** Shadcn/UI
  - *Core Components:* Datatable, Dialog, Dropdown, Form, Calendar.
- **State Management:**
  - Server State: TanStack Query (React Query) - Opsional, jika Server Actions dirasa kurang responsif untuk filtering data kompleks.
  - Client State: Zustand (untuk global UI state ringan seperti Sidebar toggle).
- **Data Table:** TanStack Table (React Table v8)
  - *Feature:* Wajib support Sorting, Global Search, dan Pagination untuk data Anggota dan Keuangan.
- **Form Handling:** React Hook Form + Zod
  - *Validation:* Schema Zod harus identik antara Client-side dan Server-side. Validasi input keuangan (negatif/positif) sangat krusial.

## 6. SPECIFIC FEATURE MODULES
- **QR Code System (Sie Acara):**
  - Lib: `next-qrcode`
  - Logic: Generate string unik yang berisi `{eventId}-{timestamp}-{secret}`. Validasi di server untuk memastikan QR code tidak kadaluwarsa (misal: valid 30 menit).
- **Reporting & Export:**
  - Excel: `xlsx` (SheetJS) - Untuk export Keuangan dan HPDT (filtered data).
  - PDF: `@react-pdf/renderer` - Jika user butuh laporan siap cetak (opsional, prioritaskan Excel dulu).
- **Notifications (Sie KTB):**
  - Email Service: Resend (Integrasi terbaik dengan Vercel).
  - Trigger: Manual trigger oleh Koor KTB untuk "Reminder Pengontrolan".

## 7. DEPLOYMENT STRATEGY
- **Platform:** Vercel
- **DNS (Domainesia):**
  - Config: CNAME `cname.vercel-dns.com` (untuk www) atau A Record (untuk root) sesuai instruksi Vercel dashboard.
- **Environment Variables:**
  - Pastikan `.env` terpisah untuk Local, Preview, dan Production.
  - Kunci: `DATABASE_URL`, `NEXTAUTH_SECRET`, `SANITY_API_TOKEN`, `RESEND_API_KEY`.