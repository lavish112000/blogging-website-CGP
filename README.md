# Tech-Knowlogia

Tech-Knowlogia is a modern, SEO-first blogging platform built with **Next.js App Router**. It ships with publisher-grade tooling: MDX content workflow, Decap CMS editor, a private admin dashboard, RSS + sitemaps (including **Google News** sitemap), and optional MongoDB storage.

**Last updated:** 2025-12-31

---

## Quick Links (Production)

> Update the domain below if you deploy under a different host.

- Site: [https://tech-knowlogia.com](https://tech-knowlogia.com)
- RSS: [https://tech-knowlogia.com/feed.xml](https://tech-knowlogia.com/feed.xml)
- Sitemap: [https://tech-knowlogia.com/sitemap.xml](https://tech-knowlogia.com/sitemap.xml)
- Google News sitemap: [https://tech-knowlogia.com/news-sitemap.xml](https://tech-knowlogia.com/news-sitemap.xml)
- CMS (Decap): `/admin`
- Private Admin Dashboard (Admin-only): `/admin-dashboard`
- MongoDB smoke test (local/prod): `/api/test-db`

---

## What’s Implemented (Thorough Overview)

### 1) Content Platform

- **MDX-based articles** with frontmatter-driven metadata.
- **Category + article routing** via App Router: `/[category]` and `/[category]/[slug]`.
- **5 categories**: technology, business, design, lifestyle, blog.

### 2) SEO + Social + Structured Data

- Page-level metadata via Next.js Metadata API.
- OpenGraph images (via API route) + canonical URLs.
- JSON-LD structured data:
  - `NewsArticle` / `Article` on article pages
  - `CollectionPage` on category pages

### 3) Google News Readiness

- **Google News sitemap** at `/news-sitemap.xml` (last 30 days of posts).
- Robots rules include `Googlebot-News` and declare sitemaps.
- Assessment & action plan documented in `GOOGLE_NEWS_ASSESSMENT.md`.

### 4) Animated Category Pages

- Category pages ship animated backgrounds using a lightweight WebGL shader (“Silk”) via `@react-three/fiber`.

### 5) Publisher/Admin Tooling

This project contains **two admin surfaces**:

1. **Decap CMS** (`/admin`)
   - Content creation/editing/publishing.
   - Role-based permissions (admin/editor) using Netlify Identity.

2. **Private Admin Dashboard** (`/admin-dashboard`)
   - Analytics overview (view counts)
   - Trending controls
   - Breaking news management + notification trigger
   - AI draft generator (currently template-based)

Security layers are documented in `SECURITY_ARCHITECTURE.md`.

### 6) MongoDB (Optional Data Storage)

- MongoDB connection handler with caching for dev hot reloads.
- Sample model (`User`) + test endpoint.
- Atlas free tier (M0) supported.

See `MONGODB_SETUP.md` for setup and verification steps.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime/UI**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: MDX (gray-matter, markdown-it)
- **Animation**: Framer Motion, GSAP
- **Background shader**: `@react-three/fiber` + Three.js
- **Database** (optional): MongoDB Atlas + Mongoose
- **Deployment**: Netlify (`@netlify/plugin-nextjs`)

---

## Local Development

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root.

This project intentionally keeps secrets out of the repository. Do **not** commit `.env.local`.

If you want MongoDB features enabled:

```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
```

Optional (if you use them):

```bash
# Optional integrations (used by /api/notify, /api/subscribe stubs)
ONESIGNAL_API_KEY=
ONESIGNAL_APP_ID=
RESEND_API_KEY=
```

Notes:
- The production domain is currently hard-coded as `https://tech-knowlogia.com` in several routes (sitemap, RSS, metadata). If you deploy under a different domain, update those constants.
- Netlify Identity auth (Admin/CMS login) works best when running on Netlify. For local auth testing, use `netlify dev` (requires Netlify CLI).

### Run Dev Server

Default Next.js dev port is **3000** (unless you override it).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key URLs (Local)

- Home: [http://localhost:3000](http://localhost:3000)
- RSS: [http://localhost:3000/feed.xml](http://localhost:3000/feed.xml)
- Sitemap: [http://localhost:3000/sitemap.xml](http://localhost:3000/sitemap.xml)
- News sitemap: [http://localhost:3000/news-sitemap.xml](http://localhost:3000/news-sitemap.xml)
- MongoDB test: [http://localhost:3000/api/test-db](http://localhost:3000/api/test-db)

---

## API Surface (Built-In)

All endpoints are implemented as Next.js Route Handlers in `app/api/*`.

| Route | Method | Purpose | Notes |
| --- | --- | --- | --- |
| `/api/test-db` | GET | MongoDB connection test | Requires `MONGODB_URI` |
| `/api/subscribe` | POST | Newsletter subscribe | Stub (logs only); integrate ESP |
| `/api/views` | POST/GET | View tracking + analytics | In-memory (resets on restart) |
| `/api/ai-draft` | POST/GET | Draft generator | Template-based (upgrade to real AI) |
| `/api/notify` | POST/GET | Breaking news notifications | Placeholder integrations |

---

## MongoDB Integration

This repo already includes:

- `lib/mongodb.ts` (connection + caching)
- `models/User.ts` (sample schema)
- `app/api/test-db/route.ts` (smoke test)

### Verify MongoDB Locally

1. Set `MONGODB_URI` in `.env.local`
2. Start dev server: `npm run dev`
3. Visit: [http://localhost:8080/api/test-db](http://localhost:8080/api/test-db)

Expected response:

```json
{
  "success": true,
  "message": "MongoDB connection successful!",
  "userCount": 0,
  "timestamp": "..."
}
```

Deployment notes (Atlas):

- For hosted deployments (Netlify), Atlas Network Access must allow your environment.
- Easiest dev setting: allow `0.0.0.0/0` (use with caution).

---

## Deployment (Netlify)

This repo includes `netlify.toml` and uses `@netlify/plugin-nextjs`.

### Required Netlify Settings

- Build command: `npm run build`
- Publish directory: `.next`

### Environment Variables on Netlify

- Add `NEXT_PUBLIC_SITE_URL` (your production URL)
- Add `MONGODB_URI` (only if using MongoDB)

### CMS + Identity

Decap CMS and the private admin dashboard are designed for **Netlify Identity + Git Gateway**.

Follow the deployment checklist:

- `DEPLOYMENT_CHECKLIST.md`
- `ADMIN_SYSTEM_GUIDE.md`

---

## Google News / Publisher Center

Technical readiness (schema + sitemaps) is implemented.

What remains is mostly **Publisher Center workflow + publishing cadence**:

- Submit `https://tech-knowlogia.com/news-sitemap.xml` in Search Console
- Keep publishing consistently (Google News strongly favors regular fresh content)
- Complete Publisher Center setup when the “Google News” product becomes available for your account

See `GOOGLE_NEWS_ASSESSMENT.md` for the full audit and recommendations.

---

## Project Structure (High-Level)

```text
app/                 Next.js App Router pages + route handlers
app/api/             Backend API endpoints
app/[category]/      Category pages
app/[category]/[slug]/  Article pages
components/          UI + layout + feature components
content/             MDX posts (by category)
lib/                 MDX utilities, categories, auth, MongoDB connector
models/              Mongoose models
public/admin/         Decap CMS config + preview
```

---

## Documentation Index

- `DEVELOPMENT_GUIDE.md` – deep dev guide (architecture, workflows)
- `DEPLOYMENT_CHECKLIST.md` – production rollout checklist
- `ADMIN_SYSTEM_GUIDE.md` – admin dashboard setup + roles
- `SECURITY_ARCHITECTURE.md` – layered security model
- `PUBLISHER_FEATURES.md` – publisher-grade features walkthrough
- `MONGODB_SETUP.md` – MongoDB Atlas setup + verification
- `GOOGLE_NEWS_ASSESSMENT.md` – Google News readiness audit

---

## Notes / Known Limitations (By Design)

- `/api/views` uses **in-memory storage** (non-persistent). For production analytics, swap to MongoDB/Redis/Postgres.
- `/api/subscribe` is a **stub** until an email provider is wired (Resend/SendGrid/Mailchimp/etc.).
- `/api/ai-draft` is **template-based** until a real model provider is integrated.
- `/api/notify` is a **placeholder** until push/email integrations are configured.

---

## Roadmap (Recommended Production Upgrades)

This repo is already production-deployable; the items below are the highest-impact upgrades when you’re ready.

### Priority 1 — Data Persistence

- Persist analytics from `/api/views` (replace in-memory store with MongoDB/Redis/Postgres).
- Store newsletter subscribers from `/api/subscribe` (instead of console logging).

### Priority 2 — Real AI Drafts

- Upgrade `/api/ai-draft` to use a real model provider (e.g., OpenAI / Gemini / Claude) with API keys stored in Netlify environment variables.
- Add guardrails: rate limiting, input validation, and prompt templates per category.

### Priority 3 — Breaking News Delivery

- Wire `/api/notify` to a notification provider (OneSignal / email provider) and connect it to “breaking” content workflows.

### Priority 4 — Security Hardening

- Implement server-side auth for admin-only API routes (see `SECURITY_ARCHITECTURE.md` and `ADMIN_SYSTEM_GUIDE.md`).

---

## Maintainers

- Owner/Maintainer: @lavish112000

---

## Support

- For bugs, requests, or documentation changes: open a GitHub issue in this repository.
- For deployment issues: check `DEPLOYMENT_CHECKLIST.md` first (most fixes are configuration-related).

---

## Contributing

- Keep changes focused and consistent with the existing design system and patterns.
- Prefer small PRs with clear descriptions.
- If adding integrations (email/AI/notifications), document new environment variables in this README.

---

## License

**Proprietary — All Rights Reserved.**

This repository and its contents are proprietary to the owner/maintainer. You may not copy, modify, distribute, or use any portion of this codebase except with explicit written permission.

If you need permission (commercial use, redistribution, or contributions outside the core team), open an issue in this repository to request access/terms.

---

## Scripts

```bash
npm run dev     # starts Next dev server on 127.0.0.1:8080
npm run build   # production build
npm run start   # starts prod server on :8080
npm run lint    # eslint
```
