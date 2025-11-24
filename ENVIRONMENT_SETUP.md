# Environment Variables Setup Guide

This guide explains how to set up different environment configurations for local development and production deployment.

## 📁 File Structure

You need to create these files manually (they're gitignored for security):

```
backend/
  └── .env                    # Create this file (see template below)

frontend/
  ├── .env.local              # Create this for local development
  └── .env.production         # Create this for production builds
```

**Note:** `.env` files are gitignored and won't be committed. Create them locally based on the templates below.

## 🔧 Backend Environment Setup

### Step 1: Create `.env` file in `backend/`

Create a new file `backend/.env` with the following content:

### Step 2: Configure for Local Development

Create `backend/.env` with this content:

```env
# Local Development Configuration
PORT=5000
NODE_ENV=development

# Local MongoDB
MONGO_URI=mongodb://localhost:27017/semilia

# JWT & Admin
JWT_SECRET=your_local_jwt_secret
ADMIN_SECRET=your_local_admin_secret

# Frontend URL (LOCAL)
FRONTEND_URL=http://localhost:3000

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@semilia.com

# Cloudinary (optional for local, required for production)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Backend URL (for local file uploads - development only)
BACKEND_URL=http://localhost:5000
```

### Step 3: Configure for Production (Vercel)

When deploying to Vercel, set these environment variables in **Vercel Dashboard**:

1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable:

```env
# Production Configuration
NODE_ENV=production
PORT=5000

# MongoDB Atlas (Production)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/semilia?retryWrites=true&w=majority

# JWT & Admin (use strong secrets!)
JWT_SECRET=your_production_jwt_secret_min_32_chars
ADMIN_SECRET=your_production_admin_secret

# Frontend URL (PRODUCTION - IMPORTANT!)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@semilia.com

# Cloudinary (REQUIRED for Vercel)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**⚠️ CRITICAL:** Make sure `FRONTEND_URL` points to your **production frontend URL**, not localhost!

---

## 🎨 Frontend Environment Setup

### Step 1: Create `.env.local` for Development

Create a new file `frontend/.env.local` with this content:

```env
# Local Development - Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Step 2: Create `.env.production` for Production

Create a new file `frontend/.env.production` with this content:

```env
# Production - Backend API
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend.vercel.app
```

### Step 3: Vercel Environment Variables

When deploying frontend to Vercel, add in **Vercel Dashboard**:

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend.vercel.app
```

---

## 🔄 How It Works

### Local Development:

1. **Frontend** reads from `.env.local`
   - `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

2. **Backend** reads from `.env`
   - `FRONTEND_URL=http://localhost:3000`
   - Used in email links, CORS, etc.

### Production Build:

1. **Frontend** reads from `.env.production` (or Vercel env vars)
   - `NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api`

2. **Backend** reads from Vercel environment variables
   - `FRONTEND_URL=https://your-frontend.vercel.app`
   - Used in email links, CORS, etc.

---

## 📝 Quick Reference

### Backend `.env` Variables:

| Variable | Local | Production |
|----------|-------|------------|
| `FRONTEND_URL` | `http://localhost:3000` | `https://your-frontend.vercel.app` |
| `MONGO_URI` | `mongodb://localhost:27017/semilia` | `mongodb+srv://...` (Atlas) |
| `NODE_ENV` | `development` | `production` |
| `CLOUDINARY_*` | Optional | **Required** |

### Frontend Environment Files:

| File | When Used | API URL |
|------|-----------|---------|
| `.env.local` | `npm run dev` | `http://localhost:5000/api` |
| `.env.production` | `npm run build` | `https://your-backend.vercel.app/api` |

---

## 🚀 Deployment Checklist

### Before Deploying Backend:

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string copied
- [ ] Cloudinary account set up
- [ ] All environment variables set in Vercel
- [ ] `FRONTEND_URL` points to production frontend URL
- [ ] `MONGO_URI` uses MongoDB Atlas (not localhost)

### Before Deploying Frontend:

- [ ] `.env.production` file created with production backend URL
- [ ] `NEXT_PUBLIC_API_URL` points to production backend
- [ ] Environment variables set in Vercel (if using Vercel)

---

## 🐛 Common Issues

### Issue: Backend emails have localhost links in production

**Solution:** Check that `FRONTEND_URL` in Vercel environment variables is set to your production frontend URL, not `http://localhost:3000`

### Issue: Frontend can't connect to backend

**Solution:** 
1. Check `NEXT_PUBLIC_API_URL` in `.env.production` or Vercel env vars
2. Ensure backend CORS allows your frontend domain
3. Check backend is deployed and accessible

### Issue: CORS errors in production

**Solution:** Update `FRONTEND_URL` in backend environment variables to match your production frontend domain

---

## 💡 Pro Tips

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use `.env.example` files** - Document required variables
3. **Test locally first** - Use `.env.local` for development
4. **Double-check URLs** - Production URLs should use `https://`
5. **Use Vercel's env vars** - Easier than `.env.production` file

---

## 📚 Next Steps

1. Create your `.env` files from the examples
2. Fill in your actual values
3. Test locally
4. Deploy to Vercel
5. Set environment variables in Vercel dashboard
6. Test production deployment

**Ready to deploy!** 🚀

