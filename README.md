# Pender — AI Writing for Real Estate Agents

> Your AI writing partner for listing descriptions, buyer emails, negotiation copy, and open house invites.

## Deploy in 5 Minutes

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial Pender build"
git remote add origin https://github.com/YOUR_USERNAME/pender.git
git push -u origin main
```

### 2. Connect to Vercel
- Go to vercel.com/dashboard
- Click "Add New Project"
- Import your `pender` GitHub repository
- Click Deploy

### 3. Add Your API Key (Critical)
In Vercel dashboard → Your Project → Settings → Environment Variables:
- Name: `ANTHROPIC_API_KEY`
- Value: your key from console.anthropic.com
- Environment: Production + Preview + Development
- Click Save, then Redeploy

### 4. Add Stripe Payment Link
Once you create your $39/month product in Stripe:
- Copy your payment link URL
- In `index.html`, find `YOUR_STRIPE_PAYMENT_LINK`
- Replace with your actual Stripe link
- Push to GitHub (Vercel auto-deploys)

### 5. Add Your Domain
- In Vercel → Project → Settings → Domains
- Add `pender.pro`
- Vercel connects it automatically (you bought it through Vercel)

---

## How It Works

- `index.html` — Frontend UI (4 tools, free limit, paywall)
- `api/generate.js` — Serverless function that calls Anthropic API securely
- Your API key lives in Vercel environment variables, never in frontend code

## Free Tier Logic
Users get 3 free generations stored in localStorage.
After 3 uses, the paywall modal appears pointing to Stripe.

## Pricing
$39/month — change `FREE_LIMIT` in index.html and the price in the paywall section.
