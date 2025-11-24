# 🚀 Quick Start Guide - Semilia E-commerce

## ⚡ Start in 5 Minutes

### 1. Gmail Setup (One-time, 2 minutes)

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Click **App passwords** → Create for "Semilia"
4. **Copy the 16-character code**

### 2. Backend Setup (1 minute)

```bash
cd backend

# Create .env file
cat > .env << EOL
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/semilia-store
JWT_SECRET=my_super_secret_jwt_key_12345
ADMIN_SECRET=admin_secret_12345
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-code-here
FRONTEND_URL=http://localhost:3000
EOL

# Test email
node test-email.js your-email@gmail.com

# Start backend
npm run dev
```

✅ **Backend running on http://localhost:5000**

### 3. Frontend Setup (1 minute)

```bash
cd frontend

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Install dependencies (if not done)
npm install axios formik yup react-hot-toast lucide-react @tanstack/react-query @tanstack/react-query-devtools

# Start frontend
npm run dev
```

✅ **Frontend running on http://localhost:3000**

### 4. Test It! (1 minute)

1. Open http://localhost:3000
2. Click **Sign Up**
3. Fill the form and register
4. Check your email for 6-digit code
5. Enter code and verify
6. Done! 🎉

---

## 📁 Required .env Files

### Backend `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/semilia-store
JWT_SECRET=my_super_secret_jwt_key_12345
ADMIN_SECRET=admin_secret_12345
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🧪 Test Commands

```bash
# Test email sending
cd backend
node test-email.js your-email@gmail.com

# Test backend API
curl http://localhost:5000/api/health

# Run backend tests
npm test
```

---

## 📚 Documentation

- `PHASE1_COMPLETE_SUMMARY.md` - Full Phase 1 overview
- `EMAIL_SETUP.md` - Detailed Gmail setup
- `UPDATED_AUTH_FLOW.md` - Auth flow details
- `backend/API_DOCUMENTATION.md` - API reference

---

## 🆘 Quick Troubleshooting

### Email not sending?
```bash
# Check if Gmail credentials are correct
node backend/test-email.js your-email@gmail.com

# Check backend console for logged code
# Look for: 📧 Verification code for...
```

### Frontend errors?
```bash
cd frontend
npm install  # Install missing dependencies
```

### Can't connect to backend?
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check .env.local has correct URL
cat frontend/.env.local
```

---

## ✅ Quick Checklist

- [ ] MongoDB running locally
- [ ] Backend `.env` file created with Gmail credentials
- [ ] Gmail App Password generated
- [ ] Email test successful
- [ ] Backend running on port 5000
- [ ] Frontend `.env.local` created
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 3000
- [ ] Registration flow tested
- [ ] Verification email received

---

## 🎯 What's Working

✅ User registration
✅ Email verification with 6-digit code
✅ Email sending via Gmail
✅ Resend verification code
✅ User login
✅ JWT authentication
✅ Guest browsing
✅ Protected routes
✅ Beautiful UI/UX

---

## 🚀 Ready to Go!

Visit: **http://localhost:3000**

Enjoy building! 🎉

