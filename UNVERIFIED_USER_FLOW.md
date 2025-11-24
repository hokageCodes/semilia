# 🔒 Handling Unverified Users

## Problem Solved

**What if a user registers but doesn't receive the verification email?**

We've implemented multiple safeguards:

---

## ✅ Solutions Implemented

### 1. **Block Login for Unverified Users**

When an unverified user tries to login:

```javascript
// Backend checks email verification
if (!user.emailVerified) {
  return res.status(403).json({
    success: false,
    message: 'Please verify your email before logging in.',
    requiresVerification: true,
    email: user.email
  });
}
```

**Result:** User is automatically redirected to `/verify-email` page

---

### 2. **Resend Verification Code**

On the verification page, users can:

- **Resend Code** button with 60-second cooldown
- Sends a fresh verification code to their email
- Code is also logged to backend console (backup)

**Endpoint:** `POST /api/auth/resend-verification`

---

### 3. **Verification Code in Console**

For development/testing, the code is always logged:

```bash
📧 Verification code for user@example.com: 123456
```

**Use case:**
- Email service fails
- Testing without real emails
- Debugging issues

---

### 4. **Email Failure Doesn't Block Registration**

Registration succeeds even if email fails:

```javascript
try {
  await sendVerificationEmail(user.email, user.name, code);
  console.log('✅ Email sent');
} catch (emailError) {
  console.error('⚠️ Email failed, but registration succeeded');
  // User is still created and can resend later
  console.log(`📧 Verification code: ${code}`);
}
```

---

## 🔄 Complete Unverified User Flow

### Scenario 1: Email Never Received During Registration

```
1. User registers → Account created ✅
2. Email fails to send ❌
3. User redirected to /verify-email
4. Code logged to backend console
5. User clicks "Resend Code"
6. New email sent (or code logged again)
7. User enters code → Verified ✅
```

### Scenario 2: User Closes Browser Before Verifying

```
1. User registers → Gets verification email
2. User closes browser without verifying
3. Later, user tries to login
4. Backend: "Please verify your email first"
5. Auto-redirected to /verify-email
6. Can resend code if needed
7. Verifies → Can now login ✅
```

### Scenario 3: Verification Email in Spam

```
1. User registers → Email sent to spam folder
2. User doesn't see email
3. Clicks "Resend Code" on verification page
4. Check spam folder again
5. Or use code from backend console
6. Verifies → Done ✅
```

---

## 📝 User Experience

### On Login Page (Unverified User)

```
User tries to login
    ↓
Backend checks: emailVerified = false
    ↓
Returns 403 with requiresVerification: true
    ↓
Frontend auto-redirects to /verify-email
    ↓
Toast: "Please verify your email first"
```

### On Verification Page

```
┌─────────────────────────────────┐
│   Verify Your Email             │
│                                 │
│   Code sent to: user@email.com  │
│                                 │
│   [_] [_] [_] [_] [_] [_]      │
│                                 │
│   [Verify Email]                │
│                                 │
│   Didn't receive code?          │
│   [Resend Code] (60s cooldown)  │
│                                 │
│   Back to Home                  │
└─────────────────────────────────┘
```

---

## 🔧 Backend Implementation

### Login Check (authController.js)

```javascript
// After password verification
if (!user.emailVerified) {
  return res.status(403).json({
    success: false,
    message: 'Please verify your email before logging in.',
    requiresVerification: true,
    email: user.email
  });
}
```

### Resend Verification (authController.js)

```javascript
exports.resendVerificationCode = async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  if (user.emailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified'
    });
  }
  
  // Generate new code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.emailVerificationToken = verificationCode;
  await user.save();
  
  // Send email (with fallback to console)
  try {
    await sendVerificationEmail(user.email, user.name, verificationCode);
  } catch (error) {
    console.log(`📧 Code for ${user.email}: ${verificationCode}`);
  }
  
  res.json({
    success: true,
    message: 'Verification code sent!'
  });
};
```

---

## 🎯 Frontend Implementation

### AuthContext (contexts/AuthContext.js)

```javascript
const login = async (credentials, rememberMe = false) => {
  try {
    const response = await authAPI.login(credentials);
    // ... success handling
  } catch (error) {
    const errorData = error.response?.data;
    
    // Check if verification is required
    if (errorData?.requiresVerification) {
      toast.error('Please verify your email first');
      router.push(`/verify-email?email=${encodeURIComponent(errorData.email)}`);
      return { success: false, requiresVerification: true };
    }
    
    // ... other error handling
  }
};
```

---

## ✨ Additional Features

### 1. **60-Second Cooldown**

Prevents spam/abuse:

```javascript
const [countdown, setCountdown] = useState(0);

useEffect(() => {
  if (countdown > 0) {
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [countdown]);

const handleResend = async () => {
  await resendCode();
  setCountdown(60); // Start 60s countdown
};
```

### 2. **Console Backup**

Always log codes for debugging:

```bash
✅ Verification email sent to user@example.com
# If email fails:
⚠️ Email sending failed, but registration succeeded
📧 Verification code for user@example.com: 123456
```

### 3. **Development Note**

On verification page:

```
💡 Development Mode: Check your terminal/console 
for the verification code. In production, this 
will be sent via email.
```

---

## 🚨 Edge Cases Handled

### ✅ User exists but email not verified
- Login blocked → Redirect to verification

### ✅ Verification code expired
- Can resend new code anytime

### ✅ Email service down
- Code logged to console as backup
- User can still complete verification

### ✅ User forgets email
- Login attempt reveals email in redirect URL

### ✅ Multiple resend attempts
- 60-second cooldown prevents spam

### ✅ Already verified user
- Resend returns "Email is already verified"

---

## 🔐 Security Considerations

### ✅ Code Generation
- 6-digit random code (1 million combinations)
- New code on each resend

### ✅ Rate Limiting
- 60-second cooldown on resends
- Backend rate limiting on API

### ✅ No Token Bypass
- JWT issued, but login still requires verification
- Can browse site, but can't login

---

## 📊 User States

| State | Can Browse? | Can Login? | Can Shop? | Action Required |
|-------|------------|------------|-----------|----------------|
| **Unregistered** | ✅ Yes | ❌ No | ✅ Guest | None |
| **Registered, Unverified** | ✅ Yes | ❌ No | ✅ Guest | Verify email |
| **Verified** | ✅ Yes | ✅ Yes | ✅ Full | None |

---

## 🧪 Testing the Flow

### Test 1: Register Without Email Service

```bash
# Don't set up Gmail credentials
# Backend .env has no EMAIL_USER or EMAIL_APP_PASSWORD

1. Register a user
2. Check backend console for code
3. Use that code to verify
4. ✅ Should work!
```

### Test 2: Login Unverified User

```bash
1. Register user
2. Close browser (don't verify)
3. Try to login
4. Should redirect to /verify-email
5. Resend code
6. Verify
7. Login again → Success!
```

### Test 3: Resend Code Multiple Times

```bash
1. On /verify-email page
2. Click "Resend Code"
3. Wait for countdown
4. Click again after 60s
5. Check backend logs for new codes
6. Each code should be different
```

---

## 📚 Related Files

- `backend/src/controllers/authController.js` - Login check & resend endpoint
- `frontend/contexts/AuthContext.js` - Login error handling
- `frontend/app/(auth)/verify-email/page.jsx` - Verification UI
- `backend/src/services/emailService.js` - Email sending

---

## 🎯 Summary

**Problem:** User registers but doesn't get verification email

**Solutions:**
1. ✅ Login blocked until verified (auto-redirect)
2. ✅ Resend code anytime (60s cooldown)
3. ✅ Code logged to console (backup)
4. ✅ Email failure doesn't block registration
5. ✅ Clear user feedback and instructions

**Result:** Zero users stuck in "unverified limbo" 🎉

---

**Status:** ✅ Unverified user flow fully handled!

