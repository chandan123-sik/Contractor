# 🚀 Deployment Guide - Majdoor Sathi

## 📋 Pre-Deployment Checklist

### ✅ Before Pushing to GitHub:
- [x] `.env` files added to `.gitignore`
- [x] `.env.example` files created
- [x] Sensitive data removed from code
- [x] Console logs optimized for production

---

## 🔧 Environment Setup

### **Backend Environment Variables**

Create `.env` file in `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Configuration (Generate strong secrets!)
JWT_SECRET=your_super_strong_secret_min_32_characters_xyz123
JWT_REFRESH_SECRET=your_refresh_secret_also_strong_abc456
JWT_EXPIRE=30d
JWT_REFRESH_EXPIRE=90d

# Super Admin Configuration
SUPER_ADMIN_USERNAME=your_admin_username
SUPER_ADMIN_PASSWORD=your_strong_password
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PHONE=1234567890

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration (Add your frontend URL)
CORS_ORIGIN=https://yourapp.vercel.app
```

### **Frontend Environment Variables**

Create `.env` file in `Frontend/` directory:

```env
VITE_API_URL=https://yourapi.onrender.com/api
```

---

## 🌐 Deployment Steps

### **Step 1: Deploy Backend (Render/Railway/Heroku)**

#### **Option A: Render**
1. Create account on [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** majdoor-sathi-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Branch:** main
5. Add Environment Variables (from `.env.example`)
6. Click "Create Web Service"
7. Copy the URL: `https://yourapp.onrender.com`

#### **Option B: Railway**
1. Create account on [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add Environment Variables
5. Deploy
6. Copy the URL

### **Step 2: Initialize Database**

After backend deployment:

```bash
# SSH into your server or use Railway/Render shell
cd backend
node modules/admin/seeds/admin.seed.js
```

This will create the Super Admin account.

### **Step 3: Deploy Frontend (Vercel)**

1. Create account on [Vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://yourapi.onrender.com/api`
6. Click "Deploy"
7. Copy the URL: `https://yourapp.vercel.app`

### **Step 4: Update Backend CORS**

Go back to your backend deployment (Render/Railway):

1. Update Environment Variable:
   - `CORS_ORIGIN` = `https://yourapp.vercel.app`
2. Redeploy backend

---

## 🔐 Security Checklist

### **Production Security:**
- [ ] Change all default passwords
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS (SSL certificate)
- [ ] Update CORS to only allow your domain
- [ ] Set `NODE_ENV=production`
- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets

### **Generate Strong Secrets:**
```bash
# Generate random secret (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📱 Testing Deployment

### **1. Test Backend:**
```bash
curl https://yourapi.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-20T10:30:00.000Z"
}
```

### **2. Test Frontend:**
- Open `https://yourapp.vercel.app`
- Try login/signup
- Check if API calls work

### **3. Test Admin Panel:**
- Go to `https://yourapp.vercel.app/admin/login`
- Login with Super Admin credentials
- Create test users/labours/contractors

---

## 🐛 Troubleshooting

### **CORS Errors:**
```
Access to fetch at 'https://api...' from origin 'https://app...' has been blocked by CORS
```
**Solution:** Update `CORS_ORIGIN` in backend environment variables

### **API Connection Failed:**
**Solution:** Check `VITE_API_URL` in frontend environment variables

### **Database Connection Error:**
**Solution:** Verify `MONGODB_URI` is correct and MongoDB Atlas allows connections

### **Admin Login Not Working:**
**Solution:** Run seed file to create Super Admin:
```bash
node modules/admin/seeds/admin.seed.js
```

---

## 📊 Monitoring

### **Backend Logs:**
- **Render:** Dashboard → Logs
- **Railway:** Project → Deployments → Logs

### **Frontend Logs:**
- **Vercel:** Project → Deployments → Function Logs

---

## 🔄 Updates & Redeployment

### **Backend Updates:**
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render/Railway will auto-deploy.

### **Frontend Updates:**
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel will auto-deploy.

---

## 📞 Support

For issues, check:
1. Environment variables are set correctly
2. Database connection is working
3. CORS is configured properly
4. Logs for error messages

---

## ✅ Post-Deployment

After successful deployment:
1. Test all features (login, chat, requests)
2. Create test accounts
3. Verify admin panel works
4. Check mobile responsiveness
5. Test real-time chat functionality

---

**🎉 Congratulations! Your app is now live!**
