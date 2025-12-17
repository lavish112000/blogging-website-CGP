# 🏗️ Tech-Knowlogia Admin Dashboard Setup Guide

## 📁 Architecture Complete

```
public/
└── admin/
    ├── index.html    ✅ CMS UI with Netlify Identity
    └── config.yml    ✅ Full CMS configuration
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Deploy to Netlify

1. **Push changes to GitHub:**

   ```bash
   git add .
   git commit -m "Add Decap CMS admin dashboard with Netlify Identity"
   git push
   ```

2. **Deploy on Netlify:**
   - Go to [Netlify](https://app.netlify.com/)
   - Import your repository: `lavish112000/blogging-website-CGP`
   - Deploy with default Next.js settings

---

### Step 2: Enable Netlify Identity (CRITICAL)

1. **Go to Netlify Dashboard**
   - Select your site: `tech-knowlogia`
   - Navigate to: **Identity** tab

2. **Enable Identity**
   - Click **"Enable Identity"**
   - Settings:
     - Registration: **Invite only** (recommended)
     - External providers: **OFF** (unless you want Google/GitHub login)

3. **Enable Git Gateway**
   - Go to: **Identity → Services**
   - Click **"Enable Git Gateway"**
   - This allows CMS to commit directly to GitHub

---

### Step 3: Invite Yourself as Admin

1. Go to: **Identity → Invite users**
2. Enter your email
3. Check your email for invitation
4. Set your password

---

## 🎯 ACCESS YOUR CMS

**CMS URL:** `https://tech-knowlogia.netlify.app/admin`

1. Visit the URL
2. Click **"Login with Netlify Identity"**
3. Enter your credentials
4. Start creating/editing articles!

---

## 📝 HOW TO USE THE CMS

### Creating a New Article

1. **Login to CMS:** `https://tech-knowlogia.netlify.app/admin`
2. **Select Category:** Technology / Business / Design / Lifestyle / Blog
3. **Click "New [Category]"**
4. **Fill in fields:**
   - **Title:** Article headline
   - **Description:** Meta description (150-160 chars)
   - **Date:** Publication date/time
   - **Author:** Defaults to "Lalit Choudhary"
   - **Featured Image:** Upload or select image
   - **Tags:** Add relevant tags
   - **Featured:** Toggle for trending section
   - **Priority (1-10):** Higher = more prominent
   - **Breaking News:** Toggle for breaking badge
   - **Summary:** 2-3 lines for AI Overviews & social cards
   - **Body:** Main content in Markdown

5. **Save Options:**
   - **Save Draft:** Saves without publishing
   - **Ready:** Moves to editorial review
   - **Publish:** Goes live immediately

---

## ✨ FEATURES CONFIGURED

### Editorial Workflow

- **Draft** → **In Review** → **Published**
- Perfect for team collaboration

### Media Management

- Upload folder: `public/uploads/`
- Accessible at: `/uploads/[filename]`

### SEO Fields

- ✅ Summary for Google AI Overviews
- ✅ Featured/Breaking/Priority flags
- ✅ Custom meta descriptions
- ✅ Tag management

### All Categories Enabled

- Technology
- Business
- Design
- Lifestyle
- Blog

---

## 🔧 CONFIGURATION FILES

### [public/admin/index.html](public/admin/index.html)

- Netlify Identity widget
- Decap CMS loader
- Clean, minimal UI

### [public/admin/config.yml](public/admin/config.yml)

- Backend: `git-gateway` (auto-commits to GitHub)
- Branch: `main`
- Editorial workflow enabled
- All 5 categories configured
- Author default: "Lalit Choudhary"

---

## 🎨 YOUR WORKFLOW

1. **Visit:** `https://tech-knowlogia.netlify.app/admin`
2. **Create article** in any category
3. **Add images** via media library
4. **Set priority/featured** for homepage prominence
5. **Save as Draft** or **Publish immediately**
6. CMS commits to GitHub → Netlify auto-deploys → Article live!

---

## 🛡️ SECURITY NOTES

- **Invite-only registration** prevents spam
- **Git Gateway** uses your GitHub permissions
- **Netlify Identity** manages authentication
- **Editorial workflow** adds review layer

---

## 📊 ADMIN FEATURES

### What You Can Do

- ✅ Create/edit/delete articles
- ✅ Upload images
- ✅ Set featured/trending articles
- ✅ Manage breaking news
- ✅ Control article priority
- ✅ Add SEO summaries
- ✅ Preview before publish

### What Gets Auto-Generated

- ✅ Article slugs (from title)
- ✅ Reading time
- ✅ Category badges
- ✅ Breadcrumbs
- ✅ Related posts
- ✅ Social share buttons

---

## 🎯 NEXT STEPS

1. **Deploy to Netlify** (if not done)
2. **Enable Identity + Git Gateway**
3. **Invite yourself as admin**
4. **Login at:** `https://tech-knowlogia.netlify.app/admin`
5. **Start publishing!**

---

## 🆘 TROUBLESHOOTING

### Can't access /admin

- Ensure files are in `public/admin/` folder
- Redeploy site on Netlify

### Login button not working

- Enable Netlify Identity in dashboard
- Check if you've been invited as user

### Can't save articles

- Enable Git Gateway in Identity settings
- Check GitHub permissions

### Images not uploading

- Verify `public/uploads/` folder exists
- Check file size limits (10MB max)

---

## 📞 SUPPORT

**Netlify Identity Docs:** <https://docs.netlify.com/visitor-access/identity/>  
**Decap CMS Docs:** <https://decapcms.org/docs/>  
**Next.js Deployment:** <https://nextjs.org/docs/deployment>

---

**✅ Setup Complete!** Your admin dashboard is ready to use.
