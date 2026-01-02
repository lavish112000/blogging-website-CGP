# Email Subscriber System - Setup Guide

**Last Updated:** January 2, 2026

---

## Overview

Your Tech-Knowlogia blog now has a **production-grade email subscriber system** with:

- ✅ **Double opt-in** (confirmation email required)
- ✅ **Resend integration** for transactional emails
- ✅ **MongoDB storage** for subscriber data
- ✅ **Admin dashboard** for managing subscribers
- ✅ **CSV export** for subscriber lists
- ✅ **Unsubscribe/manage links** in every email
- ✅ **Secure tokens** for confirm/manage actions

---

## Architecture

```
User Flow:
1. User enters email on /newsletter page
2. System sends confirmation email (via Resend)
3. User clicks confirm link in email
4. Status changes from "pending" → "active"
5. User receives newsletters (when you send them)
6. User can unsubscribe via manage link in any email

Admin Flow:
1. Admin logs into /admin-dashboard
2. Clicks "Subscribers" in sidebar
3. Views stats (total, active, pending, unsubscribed)
4. Filters by status
5. Exports CSV of all subscribers
6. Deletes subscribers if needed
```

---

## Step-by-Step Setup

### Step 1: Set Up Resend Account

**1.1 Create Resend Account**
- Go to [resend.com](https://resend.com)
- Sign up for free (100 emails/day free tier)

**1.2 Verify Your Domain (Production)**
- In Resend dashboard: **Domains** → **Add Domain**
- Enter your domain: `tech-knowlogia.com`
- Add the DNS records Resend provides (SPF, DKIM, DMARC)
- Wait for verification (~5-30 minutes)

**1.3 Get API Key**
- In Resend dashboard: **API Keys** → **Create API Key**
- Name: `Tech-Knowlogia Subscribers`
- Permissions: **Sending access**
- Copy the API key (starts with `re_...`)

---

### Step 2: Configure Environment Variables

**2.1 Local Development (.env.local)**

```bash
# Resend
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@tech-knowlogia.com

# Subscriber token secret (generate a random 32-byte string)
SUBSCRIBER_TOKEN_SECRET=your_random_secret_here
```

To generate `SUBSCRIBER_TOKEN_SECRET`:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**2.2 Netlify Production (Environment Variables)**
- Go to Netlify Dashboard → **Site settings** → **Environment variables**
- Add the same 3 variables as above

**Important:** For local testing with Resend, you can use:
- `RESEND_FROM_EMAIL=onboarding@resend.dev` (Resend's test email)
- For production, use your verified domain email

---

### Step 3: Test the System Locally

**3.1 Start Dev Server**
```powershell
npm run dev
```

**3.2 Subscribe**
- Go to `http://localhost:3001/newsletter`
- Enter your email
- Click "Subscribe"
- Check your email for confirmation link

**3.3 Confirm**
- Click the confirmation link in the email
- You should see "✅ Subscription confirmed!"

**3.4 Check Admin Dashboard**
- Go to `http://localhost:3001/admin-dashboard`
- Log in with Netlify Identity
- Click "Subscribers" in sidebar
- You should see your email with status "active"

**3.5 Test Unsubscribe**
- Click "Manage subscription" link in any email
- Click "Unsubscribe"
- Status should change to "unsubscribed"

---

### Step 4: Deploy to Production

**4.1 Commit All Changes**
```powershell
git add .
git commit -m "feat: add production email subscriber system"
git push origin main
```

**4.2 Wait for Netlify Deploy**
- Netlify will auto-deploy from GitHub
- Check deploy logs for any errors

**4.3 Verify Environment Variables**
- Ensure all 3 env vars are set in Netlify

**4.4 Test on Production**
- Go to your live site: `https://tech-knowlogia.com/newsletter`
- Subscribe with a real email
- Confirm the subscription
- Check admin dashboard

---

## Admin Dashboard Usage

### Viewing Subscribers

1. Log into `/admin-dashboard`
2. Click **Subscribers** in sidebar
3. View summary stats:
   - **Total:** All subscribers
   - **Active:** Confirmed and subscribed
   - **Pending:** Waiting for confirmation
   - **Unsubscribed:** Opted out

### Filtering Subscribers

- Click filter buttons: **All**, **Active**, **Pending**, **Unsubscribed**
- Table updates to show only selected status

### Exporting Subscribers

1. Click **Export CSV** button
2. CSV file downloads with all subscriber data
3. Columns: Email, Status, Subscribed At, Confirmed At, Unsubscribed At

### Deleting Subscribers

1. Find subscriber in table
2. Click **Delete** button
3. Confirm deletion
4. Subscriber is permanently removed from database

---

## API Endpoints

### Public Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/subscribe` | POST | Subscribe email (sends confirmation) |
| `/api/subscribers/confirm?token=...` | GET | Confirm subscription |
| `/api/subscribers/manage?token=...` | GET | View subscription status |
| `/api/subscribers/manage?token=...&action=unsubscribe` | POST | Unsubscribe |

### Admin-Only Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/subscribers` | GET | List all subscribers |
| `/api/admin/subscribers?status=active` | GET | Filter by status |
| `/api/admin/subscribers?format=csv` | GET | Export CSV |
| `/api/admin/subscribers?id=...` | DELETE | Delete subscriber |

---

## Database Schema

**Subscriber Model** (`models/Subscriber.ts`)

```typescript
{
  email: string              // Lowercase, trimmed, unique
  status: 'pending' | 'active' | 'unsubscribed'
  confirmedAt?: Date         // When user confirmed
  unsubscribedAt?: Date      // When user unsubscribed
  confirmTokenHash: string   // Hashed confirmation token
  confirmTokenExpiresAt: Date // Token expiry (48 hours)
  lastConfirmationSentAt: Date // Rate limiting
  source: string             // 'form', 'api', etc.
  createdAt: Date            // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

---

## Email Templates

All emails are sent via Resend and include:

### Confirmation Email
- Subject: "Confirm your subscription"
- Contains: Confirm link + Manage link
- Token expires in 48 hours

### Unsubscribe Confirmation
- Subject: "You are unsubscribed"
- Contains: Resubscribe link

---

## Security Features

1. **Double Opt-In:** Users must confirm email before receiving newsletters
2. **Token Hashing:** Confirmation tokens are SHA-256 hashed in database
3. **HMAC Signatures:** Manage tokens use HMAC for tamper-proof URLs
4. **Rate Limiting:** Prevents spam confirmation email requests (60s cooldown)
5. **Token Expiry:** Confirmation links expire after 48 hours
6. **Admin Auth:** All admin endpoints require Netlify Identity admin role
7. **No Sensitive Data:** Emails are the only personal data stored

---

## Troubleshooting

### "RESEND_API_KEY is not configured"
- Check that `RESEND_API_KEY` is set in `.env.local` (local) or Netlify env vars (production)
- Restart dev server after adding env vars

### "RESEND_FROM_EMAIL is not configured"
- Set `RESEND_FROM_EMAIL` in env vars
- For testing: use `onboarding@resend.dev`
- For production: use your verified domain email

### "SUBSCRIBER_TOKEN_SECRET is not configured"
- Generate a random secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- Add to `.env.local` and Netlify env vars

### Emails not sending
- Check Resend dashboard for failed sends
- Verify `RESEND_API_KEY` is correct
- Ensure `RESEND_FROM_EMAIL` is verified in Resend
- Check Netlify function logs for errors

### "Invalid or expired token"
- Confirmation links expire after 48 hours
- User should request a new confirmation by subscribing again

### Admin dashboard shows "Unauthorized"
- Ensure you're logged in with Netlify Identity
- Ensure your Netlify Identity user has "admin" role
- Check browser console for token errors

---

## Next Steps

### 1. Send Your First Newsletter

You can send newsletters manually or integrate with a service like Resend's broadcast feature.

**Manual Send (via Resend API):**
```typescript
// In your newsletter send route
const activeSubscribers = await Subscriber.find({ status: 'active' })
const emails = activeSubscribers.map(s => s.email)

// Send via Resend
await fetch('https://api.resend.com/emails/batch', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: process.env.RESEND_FROM_EMAIL,
    to: emails,
    subject: 'Your Newsletter Subject',
    html: '<h1>Newsletter Content</h1>'
  })
})
```

### 2. Add Newsletter Signup to Blog Posts

Add the `<NewsletterForm />` component to article layouts:

```tsx
// In app/articles/[slug]/page.tsx
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'

// After article content:
<div className="mt-16 p-8 bg-muted rounded-lg">
  <h3 className="text-2xl font-bold mb-4">Subscribe for More</h3>
  <p className="text-muted-foreground mb-6">
    Get the latest articles delivered to your inbox.
  </p>
  <NewsletterForm />
</div>
```

### 3. Automate Newsletter Sends

Create a scheduled Netlify function to send weekly digests:

```typescript
// netlify/functions/weekly-newsletter.ts
export const handler = async () => {
  // Fetch latest articles
  // Fetch active subscribers
  // Send newsletter via Resend
  // Return success
}
```

Then set up Netlify scheduled functions in `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-cron"

  [plugins.config]
    [plugins.config.schedules]
      [plugins.config.schedules.weekly-newsletter]
        expression = "0 9 * * 1"  # Every Monday at 9 AM
```

---

## Files Added/Modified

### New Files
- `models/Subscriber.ts` - MongoDB schema
- `lib/siteUrl.ts` - Request URL helper
- `lib/subscriberTokens.ts` - Secure token generation
- `lib/resend.ts` - Resend API wrapper
- `lib/subscriberEmails.ts` - Email templates
- `app/api/subscribers/confirm/route.ts` - Confirmation endpoint
- `app/api/subscribers/manage/route.ts` - Manage/unsubscribe endpoint
- `app/api/admin/subscribers/route.ts` - Admin list/export/delete
- `app/admin-dashboard/subscribers/page.tsx` - Admin UI

### Modified Files
- `app/api/subscribe/route.ts` - Replaced stub with real implementation
- `app/admin-dashboard/layout.tsx` - Added Subscribers nav link
- `components/newsletter/NewsletterForm.tsx` - Updated success message
- `.env.example` - Added Resend env vars

---

## Summary

✅ **System is production-ready**
✅ **Double opt-in prevents spam complaints**
✅ **Resend handles email delivery**
✅ **MongoDB stores subscriber data**
✅ **Admin dashboard for management**
✅ **CSV export for external tools**
✅ **Secure token-based confirm/unsubscribe**

Your email subscriber system is now fully functional and ready for production use!
