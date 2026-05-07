# Smart Health Tools — أدوات الصحة الذكية

A modern full-stack health utility web application with Age Calculator and BMI Calculator, supporting Arabic and English.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand |
| Backend | Next.js API Routes (serverless) |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend + API), Neon/Supabase (DB) |

## ✨ Features

- 🌍 **Bilingual**: Full Arabic (RTL) and English support
- 🎂 **Age Calculator**: Exact age in years/months/days/hours/seconds + birthday celebration
- ⚖️ **BMI Calculator**: BMI with color indicators, health categories, and tips
- 🔐 **Auth System**: Register/Login with JWT + bcrypt
- 🌙 **Dark/Light Mode**: Smooth theme toggle
- 📱 **Fully Responsive**: Mobile-first design
- 🎨 **Glassmorphism UI**: Modern premium design
- 🔍 **SEO Optimized**: Full metadata, OG tags, sitemap, robots.txt
- 📊 **History Tracking**: Save calculator results per user

## 📁 Project Structure

```
smart-health-tools/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   └── history/route.ts
│   ├── dashboard/
│   │   ├── age-calculator/page.tsx
│   │   └── bmi-calculator/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx
│   └── LoadingSkeleton.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── i18n.ts
├── store/
│   └── authStore.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── robots.txt
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── vercel.json
└── .env.example
```

## 🛠️ Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd smart-health-tools
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values:

```env
DATABASE_URL="postgresql://username:password@host:5432/smart_health_tools"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-chars"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

### Database (Neon - Recommended)

1. Go to [neon.tech](https://neon.tech) and create a free project
2. Copy the connection string
3. Set `DATABASE_URL` in Vercel environment variables

### Frontend + API (Vercel)

1. Push code to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` — Your Neon/Supabase PostgreSQL URL
   - `JWT_SECRET` — A strong random secret (32+ chars)
4. Deploy!

```bash
# Or deploy via CLI
npm i -g vercel
vercel --prod
```

### Post-deployment Database Migration

```bash
DATABASE_URL="your-production-url" npx prisma db push
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/history` | Save calculation |
| GET | `/api/history` | Get user history |

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_SECRET` | Secret for JWT signing | ✅ |
| `NEXT_PUBLIC_API_URL` | Public API URL | Optional |

## 📄 License

MIT License — Free for personal and commercial use.
