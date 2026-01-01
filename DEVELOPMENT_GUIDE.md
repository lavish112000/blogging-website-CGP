# Tech-Knowlogia Development Guide

A comprehensive guide to understanding, developing, and maintaining the Tech-Knowlogia blogging platform.

**Last updated:** 2025-12-31

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
5. [Project Structure](#project-structure)
6. [Key Features](#key-features)
7. [Workflow & Development Process](#workflow--development-process)
8. [API Documentation](#api-documentation)
9. [Database & Data Management](#database--data-management)
10. [Theme & Styling](#theme--styling)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Tech-Knowlogia** is a modern, full-featured blogging platform built with Next.js 16 (App Router). It delivers premium knowledge for professionals across technology, lifestyle, design, and business domains.

### Key Highlights

- **Framework**: Next.js 16 with App Router
- **Default Theme**: Dark Mode
- **Features**: Newsletter subscriptions, RSS feeds, SEO optimization, responsive design
- **Content Format**: MDX (Markdown + JSX)
- **Deployment**: Netlify-ready (`@netlify/plugin-nextjs`)

---

## Tech Stack

### Frontend

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: Radix UI + Lucide Icons
- **Theme Management**: next-themes
- **Typography**: Inter font (Google Fonts)

### Backend & API

- **API Routes**: Next.js Route Handlers (`app/api/...`)
- **Content Processing**: gray-matter (for MDX frontmatter)
- **Markdown Rendering**: markdown-it

### DevTools

- **Package Manager**: npm
- **Build Tool**: Next.js built-in
- **Analytics**: Google Analytics & Google AdSense
- **Version Control**: Git

---

## Prerequisites

Before setting up the project, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Check installed version
   ```

2. **npm** (v9 or higher)
   ```bash
   npm --version
   ```

3. **Git** (for version control)
   ```bash
   git --version
   ```

4. **Code Editor** (VS Code recommended)

5. **Environment Variables** (see [Setup Instructions](#setup-instructions))

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/lavish112000/blogging-website-CGP.git
cd blogging-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional (only if you enable MongoDB-backed features)
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster_host>/<db_name>?retryWrites=true&w=majority

# Optional integrations (placeholders unless you wire them up)
ONESIGNAL_API_KEY=
ONESIGNAL_APP_ID=
RESEND_API_KEY=
```

Notes:
- `.env.local` is ignored by git via `.gitignore` (`.env*`). Keep secrets out of commits.
- Netlify Identity login (CMS + Admin Dashboard) works reliably on Netlify domains. For local identity testing, use `netlify dev` (Netlify CLI).

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
blogging-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles (Tailwind + custom)
│   ├── api/
│   │   ├── subscribe/route.ts   # Newsletter subscription API
│   ├── feed.xml/route.ts        # RSS feed generator
│   ├── about/page.tsx           # About page
│   ├── contact/page.tsx         # Contact page
│   ├── newsletter/page.tsx      # Newsletter page (Server Component)
│   ├── privacy/page.tsx         # Privacy policy
│   ├── terms/page.tsx           # Terms of service
│   ├── [category]/
│   │   ├── page.tsx             # Category listing page
│   │   └── [slug]/page.tsx      # Individual article page
│
├── components/                   # Reusable React components
│   ├── layout/
│   │   ├── Header.tsx           # Navigation header
│   │   └── Footer.tsx           # Footer with links
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedPosts.tsx
│   │   ├── NewsletterSection.tsx
│   ├── newsletter/
│   │   └── NewsletterForm.tsx   # Form for email subscriptions (Client Component)
│   └── theme-provider.tsx       # Theme provider wrapper
│
├── lib/                          # Utility functions & configurations
│   ├── mdx.ts                   # MDX processing functions
│   ├── types.ts                 # TypeScript interfaces
│   ├── categories.ts            # Category configuration
│   ├── utils.ts                 # Helper functions
│
├── content/                      # Blog articles (MDX format)
│   ├── blog/
│   ├── lifestyle/
│   ├── design/
│   ├── technology/
│   └── business/
│
├── public/                       # Static assets
│   ├── og-image.jpg
│   └── favicon.ico
│
├── package.json                  # Dependencies & scripts
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
└── README.md                     # Project overview
```

---

## Key Features

### 1. **Newsletter Subscription**

- **Location**: `app/api/subscribe/route.ts` (Backend) & `components/newsletter/NewsletterForm.tsx` (Frontend)
- **How it works**: Users enter email → Validation → Storage → Confirmation
- **Component Pattern**: Server Component (`app/newsletter/page.tsx`) + Client Component (`NewsletterForm.tsx`)

### 2. **RSS Feed Generation**

- **Location**: `app/feed.xml/route.ts`
- **Purpose**: Auto-generates RSS 2.0 feed from all published articles
- **Access**: `https://tech-knowlogia.com/feed.xml`

### 3. **Dark Mode Default**

- **Configuration**: `app/layout.tsx` - ThemeProvider with `defaultTheme="dark"`
- **Technology**: next-themes for persistent theme storage
- **Behavior**: Defaults to dark mode on first visit; respects user preference on reload

### 4. **SEO Optimization**

- **Metadata**: Configured in each `page.tsx` using Next.js Metadata API
- **Open Graph**: Includes OG tags for social media sharing
- **Structured Data**: Ready for schema.org integration
- **Robots**: Configured for indexing and crawling

### 5. **Responsive Design**

- **Breakpoints**: Tailwind CSS (sm, md, lg, xl, 2xl)
- **Mobile-First**: Components designed mobile-first
- **Touch Friendly**: Navigation optimized for touch devices

### 6. **MDX Content Processing**

- **Format**: Markdown with embedded JSX
- **Processing**: gray-matter extracts frontmatter; markdown-it renders HTML
- **Frontmatter Fields**:
   ```yaml
   title: Article Title
   description: Brief description
   date: 2025-01-15
   author: Author Name (or team)
   category: blog | lifestyle | design | technology | business
   tags: [tag1, tag2, tag3]
   featured: true | false
   priority: 1 # 1-10, higher = more important
   breaking: false # mark true for breaking news / time-sensitive content
   summary: >-
      2–3 factual lines summarizing the article for AI Overviews and Google Discover.
   image: /images/article-image.jpg
   ```

---

## Editorial Controls & Trending Logic

The homepage "Trending Now" section and Discover optimization use a mix of **algorithmic signals** and **editorial controls**.

### Frontmatter Fields (Editorial)

- `featured: true | false`
   - Surfaces content more prominently on the site.
   - Adds a small score boost in trending calculations.

- `priority: 1-10`
   - Editorial importance score (default is 5 if omitted).
   - Higher numbers = more weight in the trending algorithm.
   - Use 8–10 for flagship / pillar content, 5–7 for strong articles, 1–4 for supporting pieces.

- `breaking: true | false`
   - Use for **time-sensitive** or **breaking news** style posts.
   - Adds an extra boost in trending ranking for the first ~30 days after publication.

- `summary`
   - 2–3 factual sentences at the very top of the article body.
   - Optimized for AI Overviews / SGE and rich snippets.

### Trending Algorithm (High-Level)

Implementation: [`lib/trending.ts`](lib/trending.ts)

- Only considers posts from the **last 30 days**.
- Score per post combines:
   - **Recency** (newer posts score higher within 30-day window).
   - **Priority** (1–10) as editorial weight.
   - **Featured** flag (small boost).
   - **Breaking** flag (stronger boost for timely content).
- Top-scoring posts are displayed in the **Trending Now** grid on the homepage via [`components/home/TrendingPosts.tsx`](components/home/TrendingPosts.tsx).

### Editor Workflow (via CMS)

Using Decap CMS at `/admin`:

1. Open the relevant collection (Blog, Technology, Design, Lifestyle, Business).
2. When creating or editing a post, set:
    - **Featured** → toggle for important, evergreen, or hero content.
    - **Priority** → 1–10, based on editorial importance.
    - **Breaking** → `true` only for time-sensitive news / launches.
    - **Summary** → paste a concise 2–3 line factual overview.
3. Save and publish. The system automatically:
    - Recalculates trending scores.
    - Exposes the article and category pages with updated metadata, OG images, and structured data.

---

## Workflow & Development Process

### Content Publishing Workflow

1. **Create Content**
   - Add MDX file to `content/[category]/[slug].mdx`
   - Include required frontmatter (title, description, date, etc.)

2. **Add Assets**
   - Place images in `public/images/`
   - Reference in frontmatter: `image: /images/article-name.jpg`

3. **Test Locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000/[category]/[slug]
   ```

4. **Commit Changes**
   ```bash
   git add content/[category]/[slug].mdx
   git commit -m "content: add article title"
   ```

5. **Deploy**
   ```bash
   git push origin main
   # Automatically deploys via Vercel
   ```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make Changes**
   - Edit files in `app/`, `components/`, or `lib/`
   - Test with `npm run dev`

3. **Build & Test**
   ```bash
   npm run build
   npm run lint  # If configured
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "type: description"
   ```

5. **Submit Pull Request**
   - Push to GitHub
   - Create PR with clear description
   - Request review

6. **Merge & Deploy**
   - Approve & merge to main
   - Vercel auto-deploys

### Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance, refactoring
- `docs:` - Documentation updates
- `content:` - Blog article additions

Example:
```bash
git commit -m "feat: add search functionality to blog posts"
```

---

## API Documentation

### Newsletter Subscription API

**Endpoint**: `POST /api/subscribe`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Subscribed successfully!"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Status Codes**:
- `200`: Subscription successful
- `400`: Invalid email or missing fields
- `500`: Server error

### RSS Feed API

**Endpoint**: `GET /feed.xml`

**Response**: XML (RSS 2.0 format)

**Cache Control**: 1 hour (with stale-while-revalidate)

---

## Database & Data Management

### Content Storage

- **Format**: MDX files in `content/` directory
- **No Database Required**: All content is file-based
- **Static Generation**: Content is processed at build time

### Newsletter Subscriptions

- **Current**: Stored in-memory (development)
- **Production**: Requires integration with:
  - Email service (Mailchimp, SendGrid, ConvertKit)
  - Database (MongoDB, PostgreSQL, Firebase)
  - Queue system (Bull, AWS SQS)

### Data Structure

**Post Object**:
```typescript
{
  slug: string
  title: string
  description: string
  content: string (HTML)
  date: string (ISO 8601)
  category: Category
  tags: string[]
  author: string
  readTime: number (minutes)
  featured: boolean
  image?: string
  seo?: object
}
```

---

## Theme & Styling

### Design System

**Color Palette** (Tailwind CSS):
- Primary: Blue gradients
- Background: Light/Dark variants
- Text: Gray scales for contrast

### Customization

1. **Edit Colors**: `tailwind.config.ts`
   ```typescript
   colors: {
     primary: '#...',
     secondary: '#...'
   }
   ```

2. **Edit Fonts**: `app/layout.tsx`
   ```typescript
   import { FontName } from 'next/font/google'
   ```

3. **Edit Spacing**: `tailwind.config.ts`
   ```typescript
   spacing: { ... }
   ```

### Dark Mode Implementation

- **Provider**: `next-themes` in `components/theme-provider.tsx`
- **Default**: Dark mode (`defaultTheme="dark"`)
- **Storage**: LocalStorage (persists user preference)
- **CSS Class**: `dark:` utilities apply dark mode styles

---

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Auto-detects Next.js configuration

2. **Set Environment Variables**
   - Add `.env.local` variables in Vercel dashboard
   - Redeploy to apply changes

3. **Auto-Deploy**
   - Every push to `main` triggers deployment
   - Preview deployments for PRs

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

### Performance Tips

- **Image Optimization**: Next.js auto-optimizes images
- **Code Splitting**: Automatic per-route splitting
- **Static Generation**: MDX content pre-rendered at build time
- **Caching**: RSS feed cached for 1 hour

---

## Troubleshooting

### Common Issues

#### 1. Build Fails with "use client" Error

**Problem**: `useState` used in Server Component

**Solution**:
```typescript
// Move state-dependent code to Client Component
'use client'

import { useState } from 'react'

export function MyComponent() {
  const [state, setState] = useState(null)
  // ...
}
```

Import this component in Server Component:
```typescript
import { MyComponent } from '@/components/MyComponent'

export default function Page() {
  return <MyComponent />
}
```

#### 2. MDX Content Not Loading

**Problem**: Article not appearing on category page

**Solution**:
- Verify file location: `content/[category]/[slug].mdx`
- Check frontmatter syntax (YAML format)
- Ensure category matches folder name

#### 3. Theme Not Persisting

**Problem**: Dark mode resets on page reload

**Solution**:
- Clear browser cache/cookies
- Check that `next-themes` is properly wrapped
- Verify `suppressHydrationWarning` in `<html>` tag

#### 4. Performance Issues

**Problem**: Slow page load

**Solution**:
- Run `npm run build` to check for errors
- Use Chrome DevTools to identify bottlenecks
- Check image sizes (should be optimized)
- Monitor API response times

---

## Quick Reference

### Useful Commands

```bash
# Development
npm run dev          # Start dev server on :3000

# Production
npm run build        # Build optimized bundle
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint (if configured)
npm run format      # Format code (if configured)

# Database (if added)
npm run db:migrate  # Run migrations
npm run db:seed     # Seed data
```

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics | `G-BFS1TSH6FK` |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense | `ca-pub-...` |
| `NEXT_PUBLIC_SITE_URL` | Site URL | `https://tech-knowlogia.com` |

### File Type Summary

| File Type | Purpose | Location |
|-----------|---------|----------|
| `.tsx` | React components | `app/`, `components/` |
| `.ts` | TypeScript utilities | `lib/` |
| `.mdx` | Blog content | `content/` |
| `.css` | Styles | `app/` |
| `.json` | Config files | Root directory |

---

## Getting Help

- **Documentation**: Check README.md
- **Issues**: GitHub Issues tab
- **Discussions**: GitHub Discussions
- **Code Comments**: Inline comments in complex functions

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDX Documentation](https://mdxjs.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)

---

**Last Updated**: December 14, 2025

**Version**: 1.0.0
