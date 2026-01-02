# Newsletter Subscription - Troubleshooting Guide

**Issue Fixed:** January 2, 2026

---

## 🔴 Problem: "Internal server error" on Newsletter Subscription

### Root Cause

The `RESEND_FROM_EMAIL` was set to a Gmail address (`lalitchoudhary112000@gmail.com`), but **Resend requires**:
1. A **verified domain** email (e.g., `noreply@tech-knowlogia.com`), OR
2. The **Resend test email**: `onboarding@resend.dev` (for development/testing)

### ✅ Fix Applied

1. **Updated `.env.local`:**
   ```env
   # Before (WRONG):
   RESEND_FROM_EMAIL=lalitchoudhary112000@gmail.com
   
   # After (CORRECT):
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

2. **Added Environment Variable Validation:**
   - Subscribe API now checks for required env vars before processing
   - Returns clear error messages if configuration is missing

3. **Enhanced Error Handling:**
   - Better error messages for Resend API failures
   - Specific error messages for MongoDB issues
   - Detailed console logging for debugging

---

## 🧪 Testing the Fix

### Quick Test (Browser)

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Go to: `http://localhost:3001/newsletter`

3. Enter your email and click Subscribe

4. **Expected Results:**
   - ✅ Success message: "Check your email to confirm your subscription!"
   - ✅ Email sent to your inbox (from `onboarding@resend.dev`)
   - ✅ Confirmation link in email works
   - ✅ Subscriber added to MongoDB with `status: pending`

### Automated Test (Script)

Run the test script:
```bash
node test-newsletter.js
```

This will check:
- ✅ All required environment variables
- ✅ MongoDB connection
- ✅ Subscription endpoint
- ✅ Email sending

---

## 📋 Environment Variables Checklist

Ensure these are set in `.env.local`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://...

# Resend Email Service
RESEND_API_KEY=re_...              # Your Resend API key
RESEND_FROM_EMAIL=onboarding@resend.dev  # For dev/test
SUBSCRIBER_TOKEN_SECRET=...         # Random base64 string

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### For Production (Netlify)

Add the same variables in **Netlify Dashboard → Site settings → Environment variables**

**Important:** For production, verify your domain in Resend and use:
```env
RESEND_FROM_EMAIL=noreply@tech-knowlogia.com
```

---

## 🚨 Common Issues & Solutions

### 1. "Email service not configured"

**Cause:** Missing environment variables

**Fix:**
```bash
# Check if env vars are set
node -e "console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'MISSING')"

# If missing, add to .env.local and restart server
```

### 2. "Failed to send confirmation email"

**Causes:**
- Invalid Resend API key
- `RESEND_FROM_EMAIL` not verified
- Using personal email (Gmail, Yahoo, etc.)

**Fix:**
```env
# For development/testing:
RESEND_FROM_EMAIL=onboarding@resend.dev

# For production:
# 1. Go to https://resend.com/domains
# 2. Add and verify your domain
# 3. Use: noreply@yourdomain.com
```

### 3. "Database error"

**Cause:** MongoDB connection issue

**Fix:**
```bash
# Test MongoDB connection
curl http://localhost:3001/api/test-db

# Check MONGODB_URI in .env.local
# Ensure IP whitelist includes your IP (MongoDB Atlas)
```

### 4. Resend API Error 422 (Validation Failed)

**Cause:** Invalid `from` email address

**Common Errors:**
```json
{
  "error": {
    "message": "Invalid 'from' field",
    "details": "Email must be from verified domain or use onboarding@resend.dev"
  }
}
```

**Fix:**
1. Use `onboarding@resend.dev` for testing
2. For production: verify domain in Resend dashboard
3. Never use Gmail, Yahoo, or other personal email providers

### 5. No Email Received

**Check:**
- ✅ Spam/Junk folder
- ✅ Email address is correct
- ✅ Resend dashboard shows email was sent
- ✅ Using test email (`onboarding@resend.dev`) - may take 1-2 minutes

---

## 🔍 Debugging Steps

### 1. Check Server Logs

```bash
# Look for errors in terminal where dev server is running
npm run dev

# Look for lines starting with:
# - "Subscription error:"
# - "RESEND_API_KEY is not configured"
# - "Resend API failed"
```

### 2. Test Resend API Directly

```bash
# Test Resend API key
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": ["your@email.com"],
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'
```

### 3. Check MongoDB

```bash
# Open MongoDB Atlas dashboard
# Go to: Collections → myblogdb → subscribers
# Verify subscriber was created
```

### 4. Browser DevTools

Open browser console (F12) → Network tab:
- Find POST request to `/api/subscribe`
- Check Response tab for error details
- Check Console for any client-side errors

---

## 📝 Files Modified

1. **[app/api/subscribe/route.ts](app/api/subscribe/route.ts)**
   - Added env var validation
   - Enhanced error handling
   - Better error messages

2. **[.env.local](.env.local)**
   - Fixed `RESEND_FROM_EMAIL` (Gmail → Resend test email)

3. **[test-newsletter.js](test-newsletter.js)** (NEW)
   - Automated testing script
   - Validates environment setup
   - Tests subscription flow

---

## ✅ Verification Checklist

After deploying, verify:

- [ ] Dev server starts without errors
- [ ] Can access `/newsletter` page
- [ ] Subscribing with email shows success message
- [ ] Confirmation email arrives in inbox
- [ ] Clicking confirm link works
- [ ] Subscriber appears in admin dashboard
- [ ] Subscriber status changes from `pending` to `active`

---

## 🚀 Production Deployment

### Before deploying to Netlify:

1. **Verify Domain in Resend:**
   ```
   1. Go to https://resend.com/domains
   2. Click "Add Domain"
   3. Enter: tech-knowlogia.com
   4. Add DNS records (SPF, DKIM)
   5. Wait for verification (~5-30 minutes)
   ```

2. **Update Netlify Environment Variables:**
   ```
   RESEND_FROM_EMAIL=noreply@tech-knowlogia.com
   ```

3. **Test on Production:**
   ```bash
   # After deployment
   curl -X POST https://tech-knowlogia.com/api/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

---

## 📚 Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Domain Verification](https://resend.com/docs/send-with-nextjs#7-verify-your-domain)
- [MongoDB Connection Troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Run the test script:**
   ```bash
   node test-newsletter.js
   ```

2. **Check server logs carefully** - Look for specific error messages

3. **Verify all environment variables** are set correctly

4. **Test Resend API key** directly (see Debugging Steps above)

5. **Check Resend dashboard** for failed sends

---

**Status:** ✅ Fixed and tested

**Last Updated:** January 2, 2026

**Breaking Changes:** None (only env var configuration change)
