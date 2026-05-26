# Luxe Beauty

Full-stack e-commerce platform for a South African hair retailer — **extensions, lace fronts & wigs** with WhatsApp price inquiry.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, Sequelize ORM |
| Database | PostgreSQL |
| Payments | Paystack (primary), EFT, Cash on Delivery |

## Project structure

```
├── backend/          # Express API
├── frontend/         # React storefront + admin
└── README.md
```

## Quick start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secrets

npm install
# Create database: createdb luxebeauty  (or via psql)

npm run seed    # Seeds products, admin user, coupons
npm run dev     # http://localhost:5000
```

**Seed accounts:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@luxebeauty.co.za | Admin@123! |
| Customer | customer@example.com | Customer@123! |

**Sample coupon codes:** `LUXE10` (10% off R200+), `FREESHIP` (R79 off R500+)

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api

npm install
npm run dev     # http://localhost:5173
```

## API overview

| Group | Base path |
|-------|-----------|
| Auth | `/api/auth` |
| Products | `/api/products` |
| Cart validation | `/api/cart/validate` |
| Orders | `/api/orders` |
| Payments | `/api/payments` |
| Admin | `/api/admin` |

Health check: `GET /health`

## South African features

- **Currency:** ZAR (R) with VAT-inclusive pricing
- **Provinces:** Full SA province selector at checkout
- **Shipping zones:** Johannesburg/Pretoria/Cape Town (R79), major cities (R99), remote (R149)
- **Free shipping:** Orders over R999
- **Payments:** Paystack cards, EFT with reference, Cash on Delivery

## Deployment

### Backend (Railway / Heroku)

1. Set `DATABASE_URL`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `PAYSTACK_SECRET_KEY`, `FRONTEND_URL`
2. `Procfile` included — deploy with `web: node index.js`
3. Run seed once: `npm run seed`

### Frontend (Vercel) — step by step

Repository: [github.com/MampotjeMabusela/Luxe-Beauty-Essentials](https://github.com/MampotjeMabusela/Luxe-Beauty-Essentials)

1. Go to [vercel.com](https://vercel.com) and sign in (use **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. **Import** `MampotjeMabusela/Luxe-Beauty-Essentials`.
4. Configure the project:

   | Setting | Value |
   |---------|--------|
   | **Root Directory** | `frontend` (click Edit, select `frontend`) |
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |

5. **Environment Variables** (optional for now — hair catalog works without API):

   | Name | Value |
   |------|--------|
   | `VITE_API_BASE_URL` | Your backend URL + `/api` (e.g. `https://your-api.railway.app/api`) when you deploy the API |

6. Click **Deploy**. Your live URL will look like `https://luxe-beauty-essentials.vercel.app`.
7. **Custom domain** (optional): Project → **Settings** → **Domains** → add `luxebeauty.co.za` and follow DNS instructions.

**Note:** WhatsApp inquiries (+27 81 360 1443) and all 23 hair products work on Vercel without a backend. Connect `VITE_API_BASE_URL` later when you host the API on Railway.

## Paystack setup

1. Create account at [paystack.com](https://paystack.com)
2. Use test keys in development
3. Set webhook URL: `https://your-api.com/api/payments/webhook`
4. Enable ZAR on your Paystack dashboard

## Security notes

- JWT access tokens (15m) + refresh tokens (7d)
- bcrypt password hashing (cost 12)
- Rate limiting on auth and payments
- Helmet + CORS configured
- Never commit `.env` files

## License

Proprietary — Luxe Beauty
