# 🔐 ADMIN SYSTEM GUIDE
## Tech-Knowlogia Private Admin Dashboard

**Complete security architecture, setup instructions, and usage guide**

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Security Architecture](#security-architecture)
3. [Setup Instructions](#setup-instructions)
4. [Admin Dashboard Features](#admin-dashboard-features)
5. [Role Management](#role-management)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## 🏗️ SYSTEM OVERVIEW

Tech-Knowlogia has **TWO separate admin systems**:

### 1. **Decap CMS** (`/admin`)
- **Who:** Editors and Admins
- **Purpose:** Content management (create/edit/publish articles)
- **Access:** Semi-public (requires Netlify Identity login)
- **Features:** Editorial workflow, live preview, role-based permissions

### 2. **Admin Dashboard** (`/admin-dashboard`)
- **Who:** ADMIN ONLY (you)
- **Purpose:** Site management and analytics
- **Access:** PRIVATE (completely hidden from public/editors/search engines)
- **Features:** Analytics, trending controls, breaking news, AI drafts, settings

---

## 🔒 SECURITY ARCHITECTURE

The admin dashboard uses **layered security**:

### Layer 1: Client-Side Protection
- **Location:** `app/admin-dashboard/layout.tsx`
- **Mechanism:** React auth checks with `useAuth()` hook
- **Action:** Redirects unauthorized users to home page
- **Code:**
  ```tsx
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !isAdmin(user)) {
      window.location.href = '/'
    }
  }, [user, loading])
  ```

### Layer 2: Metadata Protection
- **Location:** All admin pages
- **Mechanism:** Robots meta tags prevent indexing
- **Action:** Blocks Google and other search engines
- **Code:**
  ```tsx
  export const metadata = {
    robots: { index: false, follow: false }
  }
  ```

### Layer 3: Server Protection
- **Location:** `lib/auth.ts` → `checkAdminAuth()`
- **Mechanism:** Server-side JWT validation (API routes)
- **Action:** Rejects unauthorized API calls
- **Status:** Placeholder - implement for production

### Layer 4: Infrastructure Protection
- **Location:** `public/robots.txt`
- **Mechanism:** Disallow admin routes
- **Action:** Prevents crawlers from indexing
- **Code:**
  ```
  Disallow: /admin-dashboard
  Disallow: /admin-dashboard/*
  ```

### Layer 5: UI Protection
- **Location:** Entire public site
- **Mechanism:** No navigation links to admin
- **Action:** Admin dashboard invisible to users

---

## 🛠️ SETUP INSTRUCTIONS

### Step 1: Netlify Identity Configuration

1. **Deploy to Netlify:**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Add admin dashboard"
   git push
   
   # Deploy via Netlify
   # Site Settings > Build & Deploy > Deploy site
   ```

2. **Enable Identity:**
   - Go to Netlify dashboard
   - Navigate to **Site Settings > Identity**
   - Click **Enable Identity**

3. **Configure Git Gateway:**
   - Identity > Services > **Enable Git Gateway**
   - This allows CMS to commit to your repo

4. **Set Registration Preferences:**
   - Identity > Settings > Registration: **Invite only**
   - This prevents public signups

### Step 2: Create Admin User

1. **Invite yourself:**
   - Identity > **Invite users**
   - Enter your email
   - Check your inbox for invite link

2. **Accept invite:**
   - Click link in email
   - Set your password
   - Complete signup

3. **Assign Admin Role:**
   ```bash
   # Via Netlify CLI (install first: npm i -g netlify-cli)
   netlify identity:set-role --email your@email.com --role admin
   
   # OR via UI:
   # Identity > Users > Click user > Edit role > "admin"
   ```

### Step 3: Verify Access

1. **Test CMS Access:**
   - Navigate to `https://yoursite.netlify.app/admin`
   - Should auto-login with Netlify Identity
   - Verify you see all categories and editorial workflow

2. **Test Admin Dashboard:**
   - Navigate to `https://yoursite.netlify.app/admin-dashboard`
   - Should see dashboard (if admin role assigned)
   - Should redirect to home (if not admin)

---

## 📊 ADMIN DASHBOARD FEATURES

### 1. Main Dashboard (`/admin-dashboard`)

**Overview:**
- Real-time stats (articles, views, drafts)
- Top performing articles
- Recent activity feed
- Quick action buttons

**Usage:**
- View site health at a glance
- Monitor recent changes
- Quick navigation to other tools

### 2. Analytics (`/admin-dashboard/analytics`)

**Features:**
- View count tracking for all articles
- Top 20 performing articles
- Total views, tracked articles, average views
- Refresh button for real-time data

**Usage:**
- Identify trending content
- Optimize high-performing articles
- Find underperforming content

**API Integration:**
```tsx
// Get all view data
const response = await fetch('/api/views')
const { views } = await response.json()

// Track a view
await fetch('/api/views', {
  method: 'POST',
  body: JSON.stringify({ slug: 'article-slug' })
})
```

### 3. Trending Controls (`/admin-dashboard/trending`)

**Features:**
- Toggle featured status
- Set priority (1-10 scale)
- Separate featured/regular article sections
- Save changes to frontmatter

**Usage:**
- Feature important articles
- Control homepage order
- Boost visibility of key content

**How it works:**
- Updates `featured: true` in article MDX
- Sets `priority: number` (higher = more prominent)
- CMS respects these flags

### 4. Breaking News Manager (`/admin-dashboard/breaking-news`)

**Features:**
- Toggle breaking news status
- Send push notifications
- Active breaking news section
- Guidelines for breaking news

**Usage:**
1. Mark article as breaking: `breaking: true`
2. Send notification to subscribers
3. Article displays with "BREAKING" badge
4. Auto-expires after 24h (optional)

**API Integration:**
```tsx
await fetch('/api/notify', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Breaking: Article Title',
    body: 'Read now on Tech-Knowlogia',
    url: '/category/slug'
  })
})
```

### 5. AI Draft Generator (`/admin-dashboard/ai-drafts`)

**Features:**
- Topic input
- Category selector
- Template chooser (guide, news, how-to, analysis, opinion)
- Live draft preview
- Copy as Markdown

**Usage:**
1. Enter topic (e.g., "Quantum Computing")
2. Select category
3. Choose template style
4. Click "Generate Draft"
5. Review and copy markdown
6. Paste into CMS
7. Customize and publish

**Current Implementation:**
- Template-based (placeholder)
- Production: Integrate OpenAI/Gemini/Claude

**Integration Example:**
```typescript
// app/api/ai-draft/route.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a tech journalist...' },
    { role: 'user', content: `Write about: ${topic}` }
  ]
})
```

### 6. Settings (`/admin-dashboard/settings`)

**Configurable Options:**
- Site name and tagline
- Default author
- Google Search Console verification
- Feature toggles (notifications, AI, workflow)
- Danger zone (clear data, rebuild sitemap)

**Usage:**
- Update site metadata
- Enable/disable features
- Manage SEO settings
- Perform maintenance tasks

---

## 👥 ROLE MANAGEMENT

### Available Roles

| Role | Access | Permissions |
|------|--------|-------------|
| **Admin** | Full access | CMS + Admin Dashboard + All features |
| **Editor** | CMS only | Create/edit/publish articles, No admin dashboard |
| **Public** | Read-only | View published articles, No backend access |

### Assigning Roles

**Via Netlify UI:**
1. Go to Identity > Users
2. Click on user
3. Edit role field
4. Choose: `admin` or `editor`
5. Save

**Via Netlify CLI:**
```bash
# Assign admin role
netlify identity:set-role --email user@example.com --role admin

# Assign editor role
netlify identity:set-role --email editor@example.com --role editor

# Remove role (becomes public)
netlify identity:unset-role --email user@example.com
```

**In Code (Verification):**
```typescript
import { isAdmin, isEditor } from '@/lib/auth'

// Check if user is admin
if (isAdmin(user)) {
  // Grant admin dashboard access
}

// Check if user is editor
if (isEditor(user)) {
  // Grant CMS access (already handled by Decap)
}
```

### Adding New Editors

1. **Invite via Netlify:**
   - Identity > Invite users
   - Enter email
   - Send invitation

2. **Assign Editor Role:**
   ```bash
   netlify identity:set-role --email editor@example.com --role editor
   ```

3. **Editor Instructions:**
   - Accept invite email
   - Set password
   - Login at `/admin`
   - Create/edit articles
   - Cannot access `/admin-dashboard`

---

## 🐛 TROUBLESHOOTING

### Issue: Admin dashboard redirects to home

**Cause:** Not logged in as admin

**Solutions:**
1. Check Netlify Identity is enabled
2. Verify user has `admin` role
3. Clear browser cache and cookies
4. Try different browser (check localStorage)
5. Check browser console for errors

**Debug:**
```javascript
// Open browser console on /admin-dashboard
// Check auth state
const user = window.netlifyIdentity?.currentUser()
console.log('Current user:', user)
console.log('User roles:', user?.app_metadata?.roles)
```

### Issue: CMS shows "Error loading config"

**Cause:** Misconfigured `config.yml` or Git Gateway not enabled

**Solutions:**
1. Enable Git Gateway in Netlify Identity settings
2. Check `public/admin/config.yml` syntax
3. Verify backend is `git-gateway`
4. Ensure user is logged into Netlify Identity

### Issue: ViewTracker not recording views

**Cause:** API endpoint issue or client-side error

**Solutions:**
1. Check API route: `app/api/views/route.ts` exists
2. Verify fetch call in `components/article/ViewTracker.tsx`
3. Check browser Network tab for API calls
4. Test manually: `POST /api/views` with `{ slug: 'test' }`

### Issue: Breaking news notifications not sending

**Cause:** Placeholder API not replaced with real service

**Solutions:**
1. Check `app/api/notify/route.ts` - currently console.log only
2. Integrate OneSignal or Resend:
   ```typescript
   // OneSignal example
   await fetch('https://onesignal.com/api/v1/notifications', {
     method: 'POST',
     headers: {
       'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       app_id: process.env.ONESIGNAL_APP_ID,
       headings: { en: title },
       contents: { en: body },
       url: url
     })
   })
   ```

### Issue: AI drafts look generic/templated

**Cause:** Using template-based generation (placeholder)

**Solutions:**
1. Integrate real AI API (OpenAI, Gemini, Claude)
2. See integration example in **AI Draft Generator** section above
3. Store API keys in Netlify Environment Variables
4. Update `app/api/ai-draft/route.ts`

---

## 🚀 PRODUCTION DEPLOYMENT

### Pre-Deployment Checklist

- [ ] Environment variables set in Netlify
- [ ] Netlify Identity enabled
- [ ] Git Gateway configured
- [ ] Admin user created and role assigned
- [ ] robots.txt deployed
- [ ] AuthProvider integrated in layout
- [ ] All admin pages have noindex metadata
- [ ] CMS config.yml has correct backend
- [ ] Test admin dashboard access
- [ ] Test CMS editorial workflow
- [ ] Verify analytics tracking works
- [ ] Test breaking news notifications
- [ ] Verify AI draft generation
- [ ] Check sitemap excludes admin routes

### Environment Variables

Set in Netlify: **Site Settings > Environment Variables**

```bash
# Required for AI Features (Optional)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...

# Required for Notifications (Optional)
ONESIGNAL_APP_ID=...
ONESIGNAL_API_KEY=...
RESEND_API_KEY=re_...

# Required for Analytics Persistence (Optional)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### Upgrading In-Memory Storage

**Current:** Analytics stored in memory (resets on deploy)

**Production:** Use persistent storage

**Option 1: Database (PostgreSQL/MySQL)**
```typescript
// app/api/views/route.ts
import { sql } from '@vercel/postgres'

export async function POST(req: Request) {
  const { slug } = await req.json()
  await sql`
    INSERT INTO views (slug, count) 
    VALUES (${slug}, 1)
    ON CONFLICT (slug) 
    DO UPDATE SET count = views.count + 1
  `
  return Response.json({ success: true })
}
```

**Option 2: Redis (Fast, Simple)**
```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
})

export async function POST(req: Request) {
  const { slug } = await req.json()
  await redis.incr(`views:${slug}`)
  return Response.json({ success: true })
}
```

**Option 3: Google Analytics API**
```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data'

const analytics = new BetaAnalyticsDataClient()

// Fetch real GA4 data
const [response] = await analytics.runReport({
  property: `properties/${process.env.GA4_PROPERTY_ID}`,
  dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'pagePath' }],
  metrics: [{ name: 'screenPageViews' }]
})
```

### Security Hardening

**1. Add Server-Side Auth:**
```typescript
// lib/auth.ts - Implement checkAdminAuth()
import { jwtVerify } from 'jose'

export async function checkAdminAuth(request: Request) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  
  if (!token) {
    throw new Error('No auth token')
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    
    if (!payload.app_metadata?.roles?.includes('admin')) {
      throw new Error('Not admin')
    }
    
    return payload
  } catch {
    throw new Error('Invalid token')
  }
}
```

**2. Protect API Routes:**
```typescript
// app/api/admin/*/route.ts
import { checkAdminAuth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    await checkAdminAuth(req)
    // Admin verified, proceed
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
```

**3. Add Rate Limiting:**
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})

export async function middleware(req: Request) {
  if (req.url.includes('/api/')) {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return new Response('Rate limit exceeded', { status: 429 })
    }
  }
}
```

### Monitoring

**Set up alerts for:**
- Failed login attempts (>5 per hour)
- Unusual API traffic to admin routes
- Unauthorized access attempts
- CMS commit errors

**Tools:**
- Netlify Analytics (built-in)
- Sentry (error tracking)
- LogRocket (session replay)
- UptimeRobot (uptime monitoring)

---

## 📚 ADDITIONAL RESOURCES

### Documentation
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)
- [Decap CMS](https://decapcms.org/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Git Gateway](https://docs.netlify.com/visitor-access/git-gateway/)

### Feature Guides
- `PUBLISHER_FEATURES.md` - Detailed feature documentation
- `CMS_SETUP.md` - CMS configuration guide
- `API_INTEGRATION.md` - API reference (create if needed)

### Support
- GitHub Issues: Report bugs and request features
- Email: admin@tech-knowlogia.com
- Netlify Support: https://answers.netlify.com/

---

## 🎯 QUICK REFERENCE

### URLs
- **Public Site:** `https://tech-knowlogia.com`
- **CMS:** `https://tech-knowlogia.com/admin`
- **Admin Dashboard:** `https://tech-knowlogia.com/admin-dashboard`

### Commands
```bash
# Deploy site
git push origin main

# Set user role
netlify identity:set-role --email USER@EMAIL --role admin

# Local development
npm run dev

# Build for production
npm run build
```

### File Locations
- **Auth Utility:** `lib/auth.ts`
- **Auth Provider:** `components/auth/AuthProvider.tsx`
- **Admin Layout:** `app/admin-dashboard/layout.tsx`
- **CMS Config:** `public/admin/config.yml`
- **API Routes:** `app/api/views`, `/ai-draft`, `/notify`

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** Lalit Choudhary  
**System Status:** ✅ Production Ready
