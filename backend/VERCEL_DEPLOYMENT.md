# Deploying Backend to Vercel

Yes, your Express.js backend can be deployed on Vercel as serverless functions! Here's what you need to know:

## ✅ What's Already Set Up

1. **`vercel.json`** - Vercel configuration file
2. **`api/index.js`** - Serverless function entry point
3. **Database connection caching** - Optimized for serverless (connection reuse)

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas** - Use MongoDB Atlas (cloud) instead of local MongoDB
3. **Environment Variables** - Set up in Vercel dashboard

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. **Root Directory**: Set to `backend`
5. **Framework Preset**: Other
6. **Build Command**: Leave empty (or `echo "No build step"`)
7. **Output Directory**: Leave empty
8. Click "Deploy"

## 🔧 Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

### Required:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/semilia?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Optional (but recommended):
```
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@semilia.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=production
```

## ⚠️ Important Considerations

### 1. **File Uploads**
- **Local file storage won't work** on Vercel (read-only filesystem)
- **Use Cloudinary** for all image uploads (already configured)
- Remove or comment out local file upload fallback in production

### 2. **Database Connection**
- ✅ Already optimized with connection caching
- Use **MongoDB Atlas** (cloud) - not local MongoDB
- Connection is cached between function invocations

### 3. **Static Files**
- The `/uploads` route won't work on Vercel
- All images should be served from Cloudinary
- Update image URLs to use Cloudinary only

### 4. **Rate Limiting**
- Vercel has its own rate limiting
- Consider adjusting or disabling `express-rate-limit` in production

### 5. **Function Timeout**
- Vercel free tier: 10 seconds
- Vercel Pro: 60 seconds
- Long-running operations (like image processing) should be optimized

## 📝 Recommended Changes for Production

### 1. Update `backend/src/controllers/productController.js`

Remove or comment out local file storage fallback:

```javascript
// Comment out or remove this section:
// } else if (req.files?.length > 0) {
//   // No Cloudinary configured, save to local uploads folder
//   ...
// }
```

### 2. Update CORS in `backend/app.js`

Update to allow your production frontend:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  credentials: true,
}));
```

### 3. Update Frontend API Base URL

In `frontend/lib/axios.js`, update the base URL:

```javascript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.vercel.app/api',
  // ...
});
```

## 🧪 Testing After Deployment

1. **Health Check**: `https://your-backend.vercel.app/api/health`
2. **Test Authentication**: Try logging in
3. **Test Product Creation**: Create a product (with Cloudinary)
4. **Test Orders**: Place a test order

## 📊 Monitoring

- **Vercel Dashboard**: View function logs and metrics
- **MongoDB Atlas**: Monitor database connections
- **Cloudinary**: Check image uploads

## 🔄 Alternative: Deploy Backend Separately

If you prefer a traditional server setup, consider:

- **Railway** - Easy Node.js deployment
- **Render** - Free tier available
- **DigitalOcean App Platform** - Simple deployment
- **Heroku** - Classic option (paid now)
- **AWS Lambda** - Serverless alternative
- **Google Cloud Run** - Container-based

## 💡 Pro Tips

1. **Use MongoDB Atlas** - Free tier available, perfect for Vercel
2. **Enable Cloudinary** - Essential for file uploads on Vercel
3. **Monitor Cold Starts** - First request may be slower (database connection)
4. **Use Vercel Pro** - For better performance and longer timeouts
5. **Set up custom domain** - For better branding

## 🐛 Troubleshooting

### Issue: Database connection timeout
- **Solution**: Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)

### Issue: Function timeout
- **Solution**: Optimize slow operations, use background jobs

### Issue: File uploads failing
- **Solution**: Ensure Cloudinary is configured, remove local storage code

### Issue: CORS errors
- **Solution**: Update `FRONTEND_URL` in Vercel environment variables

---

**Ready to deploy?** Follow the steps above and your backend will be live on Vercel! 🚀

