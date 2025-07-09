# 🚀 GreenBritain.Club - Coolify Deployment Guide

## 📦 What's Included
- **Complete cannabis-themed website** targeting UK cities
- **Blog system** with admin authentication
- **Local image upload** functionality
- **MongoDB integration** for blog posts
- **SEO optimization** for cannabis keywords
- **Telegram integration** (@GBShopXBot)

## 🎯 Coolify Deployment Instructions

### **Step 1: Upload to Coolify**
1. **Extract** the `greenbritain-club-coolify.zip` file
2. **Upload** the extracted folder to Coolify
3. **Select** "Upload" as the source type

### **Step 2: Configure Build Settings**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Port:** `3000`
- **Node.js Version:** `18` or higher

### **Step 3: Environment Variables**
Add these environment variables in Coolify:

```env
# MongoDB Connection (Required)
MONGODB_URI=mongodb://your-mongodb-connection-string

# Admin Authentication (Required)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Site Configuration (Required)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_TELEGRAM_BOT=@GBShopXBot

# Optional: Node Environment
NODE_ENV=production
```

### **Step 4: MongoDB Setup**
You need a MongoDB database. Options:
- **MongoDB Atlas** (cloud - recommended)
- **Self-hosted MongoDB** on your server
- **MongoDB Docker** container

**MongoDB Atlas Setup:**
1. Create account at [mongodb.com](https://mongodb.com)
2. Create new cluster
3. Get connection string
4. Add to `MONGODB_URI` environment variable

### **Step 5: Deploy**
1. Click **"Deploy"** in Coolify
2. Wait for build to complete
3. Your site will be live!

## 🔐 Admin Access

### **Default Login:**
- **URL:** `https://your-domain.com/admin/login`
- **Username:** `admin` (or what you set in ADMIN_USERNAME)
- **Password:** `greenbritain2024` (or what you set in ADMIN_PASSWORD)

### **Admin Features:**
- **Dashboard:** `/admin/dashboard`
- **Blog Editor:** `/blog/editor`
- **Create/Edit Posts:** Full rich text editor
- **Image Upload:** Local file storage
- **Draft/Publish:** Post status management

## 📱 Website Features

### **Public Pages:**
- **Homepage:** `/` - Cannabis-themed landing page
- **Blog:** `/blog` - Published blog posts
- **Telegram:** `/telegram` - Community information
- **City Pages:** `/[city]` - Local SEO pages (London, Manchester, etc.)

### **SEO Optimization:**
- **Target Keywords:** cannabis UK, weed delivery, cannabis delivery
- **City Targeting:** 20 major UK cities
- **Telegram Keywords:** GBShopXBot, Telegram cannabis
- **Meta Tags:** Optimized for each page
- **Sitemap:** `/sitemap.xml`
- **Robots:** `/robots.txt`

## 🖼️ Image Upload System

### **How it Works:**
- Images uploaded to `/public/uploads/`
- Automatic file naming with timestamps
- 5MB file size limit
- Image type validation
- Admin authentication required

### **Uploaded Images:**
- Accessible at: `https://your-domain.com/api/uploads/filename.jpg`
- Served through custom API route (bypasses static file issues)
- Stored locally on server
- **Important:** Requires persistent storage setup (see below)

### **⚠️ CRITICAL: Persistent Storage Setup**
**For Coolify deployments, you MUST configure persistent storage or uploaded images will be lost on restart!**

**In Coolify Dashboard:**
1. Go to your application
2. Click **"Storages"** tab
3. Click **"+ Add Storage"**
4. Configure:
   - **Name:** `uploads-storage`
   - **Source:** `/data/uploads` (on host)
   - **Destination:** `/app/public/uploads` (in container)
   - **Type:** `bind` or `volume`
5. **Redeploy** your application

**Alternative: Use External Storage (Recommended for Production)**
- **Cloudinary** - Image CDN service
- **AWS S3** - Amazon cloud storage
- **Digital Ocean Spaces** - Object storage
- **Uploadcare** - File upload service

### **Testing Upload Storage:**
1. Upload an image via admin dashboard
2. **Restart your Coolify application**
3. Check if image is still accessible
4. If not accessible = storage not persistent ❌
5. If still accessible = storage is persistent ✅

## 🔧 Customization

### **Change Admin Credentials:**
Update environment variables:
```env
ADMIN_USERNAME=your-new-username
ADMIN_PASSWORD=your-new-password
```

### **Add More Cities:**
Edit `src/app/page.tsx` and `src/app/[city]/page.tsx`

### **Customize Design:**
- Colors: Update Tailwind classes
- Content: Edit page components
- Logo: Replace in `public/` directory

## 🚨 Important Notes

### **Security:**
- Change default admin password immediately
- Use strong passwords
- Keep MongoDB connection string secure
- Regular backups recommended

### **Performance:**
- Images are served statically
- MongoDB connection is optimized
- Next.js provides good performance
- Consider CDN for images in production

### **Backup:**
- MongoDB data should be backed up regularly
- Uploaded images are in `/public/uploads/`
- Code is version controlled

## 🆘 Troubleshooting

### **Build Fails:**
- Check Node.js version (18+ required)
- Verify all environment variables are set
- Check MongoDB connection string

### **Admin Login Issues:**
- Verify ADMIN_USERNAME and ADMIN_PASSWORD
- Check browser console for errors
- Clear browser cache

### **Image Upload Issues:**

#### **Upload Fails (500 Error):**
- Check file size (max 5MB)
- Verify file type (images only)
- Check server disk space
- Verify write permissions to `/public/uploads/`

#### **Images Show 404 Error:**
**✅ FIXED: The latest version now uses API routes to serve images, bypassing static file issues!**

**New System (Automatic):**
- Images are now served via: `/api/uploads/filename.jpg`
- This bypasses Next.js static file serving limitations
- Works with any Coolify storage configuration

**If still getting 404 errors:**
1. **Check Coolify Storage:**
   - Go to Coolify Dashboard → Your App → "Storages" tab
   - Add storage if missing:
     ```
     Source: /data/uploads (on host)
     Destination: /app/public/uploads (in container)
     ```

2. **Test the API Route:**
   - Try: `https://your-domain.com/api/uploads/your-filename.jpg`
   - If this works = storage is configured correctly
   - If 404 = storage mapping issue

3. **Verify Environment:**
   - Check if `NODE_ENV=production` is set
   - Verify `NEXT_PUBLIC_SITE_URL` matches your domain

**Alternative Solutions:**
- Use external storage (Cloudinary, S3, etc.)
- Upload images as URLs instead of files
- Check Coolify application logs for errors

### **Database Issues:**
- Verify MongoDB connection string
- Check MongoDB server status
- Ensure database exists

## 📞 Support

For technical support:
- Check Coolify logs for errors
- Verify environment variables
- Test MongoDB connection
- Review browser console errors

---

**GreenBritain.Club** - Premium Cannabis Community
*Ready for deployment on Coolify! 🚀* 