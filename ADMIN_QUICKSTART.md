# 🎯 ADMIN DASHBOARD QUICK START

## Instant Access Guide for Tech-Knowlogia Admin

---

## 🔑 LOGIN

**URL:** `https://tech-knowlogia.com/admin-dashboard`

**Requirements:**
- Netlify Identity account
- Admin role assigned
- Logged in (via Netlify Identity widget)

**Not Working?**
1. Go to `/admin` first (CMS login)
2. Login with Netlify Identity
3. Then navigate to `/admin-dashboard`

---

## 📊 DASHBOARD OVERVIEW

### Main Dashboard (`/admin-dashboard`)
**Purpose:** Site health overview  
**Quick Actions:**
- View total articles, views, drafts
- See top performing content
- Monitor recent activity
- Quick links to all tools

### Analytics (`/analytics`)
**Purpose:** Track article performance  
**Quick Actions:**
- View all article view counts
- Identify trending content
- Export data (coming soon)
- Refresh for real-time stats

### Trending Controls (`/trending`)
**Purpose:** Manage featured content  
**Quick Actions:**
- Toggle featured status
- Set priority (1-10)
- Reorder homepage articles
- Save changes instantly

### Breaking News (`/breaking-news`)
**Purpose:** Manage urgent content  
**Quick Actions:**
- Mark articles as breaking
- Send push notifications
- Remove breaking status
- View active breaking news

### AI Drafts (`/ai-drafts`)
**Purpose:** Generate article drafts  
**Quick Actions:**
- Enter topic + category
- Choose template style
- Generate draft
- Copy to CMS

### Settings (`/settings`)
**Purpose:** Site configuration  
**Quick Actions:**
- Update site metadata
- Toggle features
- Manage integrations
- Clear analytics data

---

## ⚡ COMMON TASKS

### Task 1: Publish Breaking News
1. Write article in CMS (`/admin`)
2. Set `breaking: true` in frontmatter
3. Go to `/admin-dashboard/breaking-news`
4. Find article, click "Send Notification"
5. Done! Subscribers notified

### Task 2: Feature an Article
1. Go to `/admin-dashboard/trending`
2. Find article in list
3. Click "Feature" toggle
4. Set priority (1-10)
5. Click "Save Changes"

### Task 3: Check Article Performance
1. Go to `/admin-dashboard/analytics`
2. View top 20 articles by views
3. Click "Refresh" for latest data
4. Optimize low-performing content

### Task 4: Generate AI Draft
1. Go to `/admin-dashboard/ai-drafts`
2. Enter topic (e.g., "Web3 Security")
3. Select category and template
4. Click "Generate Draft"
5. Copy markdown
6. Paste in CMS (`/admin`)
7. Customize and publish

### Task 5: Update Site Settings
1. Go to `/admin-dashboard/settings`
2. Modify settings (name, tagline, etc.)
3. Toggle features on/off
4. Click "Save Changes"
5. Verify changes on public site

---

## 🚨 SECURITY REMINDERS

✅ **Admin dashboard is PRIVATE**
- Not visible to public users
- Not visible to editors
- Not indexed by Google
- No public links

✅ **Role Requirements**
- Must have `admin` role
- Editors cannot access
- Auto-redirects unauthorized users

✅ **Best Practices**
- Never share admin credentials
- Use strong password
- Log out on shared devices
- Don't link to dashboard publicly

---

## 🆘 TROUBLESHOOTING

### Can't Access Dashboard?
```
1. Clear browser cache
2. Go to /admin and login
3. Check Netlify Identity is logged in
4. Verify admin role in Netlify dashboard
5. Try incognito window
```

### Analytics Not Updating?
```
1. Click "Refresh" button
2. Check ViewTracker in article pages
3. Test: POST /api/views manually
4. View browser Network tab for errors
```

### Notifications Not Sending?
```
1. Currently placeholder (console.log only)
2. Integrate OneSignal/Resend in production
3. See ADMIN_SYSTEM_GUIDE.md for integration
```

### AI Drafts Too Generic?
```
1. Currently template-based (placeholder)
2. Integrate OpenAI/Gemini for production
3. Add API key in Netlify env vars
4. See ADMIN_SYSTEM_GUIDE.md for code
```

---

## 📱 MOBILE ACCESS

**Optimized for mobile:** ✅ Yes

**Recommended workflow:**
- Desktop: Full admin dashboard
- Mobile: CMS editing (`/admin`)
- Tablet: Both work great

---

## 🔗 IMPORTANT LINKS

- **Public Site:** https://tech-knowlogia.com
- **CMS (Decap):** https://tech-knowlogia.com/admin
- **Admin Dashboard:** https://tech-knowlogia.com/admin-dashboard
- **Full Guide:** `/ADMIN_SYSTEM_GUIDE.md`
- **Features Doc:** `/PUBLISHER_FEATURES.md`

---

## 📞 SUPPORT

**Need Help?**
1. Read: `ADMIN_SYSTEM_GUIDE.md` (comprehensive)
2. Check: Netlify dashboard → Identity → Users
3. Debug: Browser console → Check auth state
4. Email: admin@tech-knowlogia.com (if issues persist)

---

**Quick Reference Version:** 1.0  
**Last Updated:** December 2024  
**Status:** ✅ Operational
