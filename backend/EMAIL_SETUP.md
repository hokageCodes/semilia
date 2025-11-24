# 📧 Email Setup Guide - Gmail with Nodemailer

This guide will help you set up email functionality using Gmail and Nodemailer.

---

## Prerequisites

- Gmail account
- Google App Password (we'll create this below)

---

## Step 1: Enable 2-Step Verification on Gmail

1. Go to your **Google Account**: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google", click on **2-Step Verification**
4. Follow the prompts to enable 2-Step Verification
5. You may need to verify your phone number

---

## Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to **Security**
2. Under "How you sign in to Google", click on **App passwords**
   - If you don't see this option, make sure 2-Step Verification is enabled
3. At the bottom, click on **Select app** dropdown
   - Choose **Other (Custom name)**
   - Type: `Semilia Backend` or any name you prefer
4. Click **Generate**
5. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
   - ⚠️ Save this somewhere safe, you won't be able to see it again!

---

## Step 3: Update Backend Environment Variables

Create or update your `.env` file in the `backend/` directory:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with your 16-character app password (remove spaces)

---

## Step 4: Test Email Sending

### Option 1: Test via Registration
1. Start your backend: `npm run dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Go to http://localhost:3000/register
4. Register a new account
5. Check your email inbox for the verification code

### Option 2: Test via Node Script

Create a test file `backend/test-email.js`:

```javascript
require('dotenv').config();
const { sendVerificationEmail } = require('./src/services/emailService');

async function testEmail() {
  try {
    console.log('📧 Sending test email...');
    const result = await sendVerificationEmail(
      'recipient@example.com', // Replace with your email
      'Test User',
      '123456'
    );
    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

testEmail();
```

Run: `node backend/test-email.js`

---

## Email Templates Included

### 1. Verification Email
- **When**: User registers
- **Contains**: 6-digit verification code
- **Template**: Clean, branded design with code box

### 2. Order Confirmation Email
- **When**: Order is placed
- **Contains**: Order number, total, view order link
- **Template**: Professional receipt-style design

---

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Cause**: Wrong email or app password

**Solution**:
1. Double-check your email address in `.env`
2. Make sure you're using the **app password**, not your regular Gmail password
3. Remove any spaces from the app password
4. Regenerate a new app password if needed

---

### Error: "Connection timeout"

**Cause**: Network/firewall blocking SMTP

**Solution**:
1. Check your internet connection
2. Try disabling VPN temporarily
3. Check if your firewall is blocking port 587 or 465

---

### Email is in Spam

**Solution**:
1. Mark it as "Not Spam"
2. Add the sender to your contacts
3. In production, configure SPF, DKIM, and DMARC records

---

### Email not received

**Check**:
1. Spam/Junk folder
2. Backend console logs for errors
3. Email address is correct
4. Gmail hasn't hit sending limits (500/day for free accounts)

---

## Gmail Sending Limits

**Free Gmail accounts:**
- **500 emails per day** (rolling 24-hour period)
- **500 recipients per email**

If you need more:
- Use **Google Workspace** (2,000 emails/day)
- Or switch to dedicated email service (SendGrid, Mailgun, etc.)

---

## Security Best Practices

### ✅ DO:
- Keep your app password secret
- Add `.env` to `.gitignore`
- Use environment variables
- Enable 2-Step Verification
- Rotate app passwords periodically

### ❌ DON'T:
- Commit `.env` file to Git
- Share your app password
- Use your regular Gmail password
- Hardcode credentials in code

---

## Environment Variables Reference

```env
# Required for email to work
EMAIL_USER=your-email@gmail.com          # Your Gmail address
EMAIL_APP_PASSWORD=abcdefghijklmnop      # 16-char app password (no spaces)

# Optional but recommended
FRONTEND_URL=http://localhost:3000       # For email links
NODE_ENV=development                     # Affects email behavior
```

---

## Code Overview

### Email Service Location
- **File**: `backend/src/services/emailService.js`
- **Functions**:
  - `sendEmail()` - Generic email sender
  - `sendVerificationEmail()` - Send verification code
  - `sendOrderConfirmationEmail()` - Send order receipt

### Usage Example

```javascript
const { sendVerificationEmail } = require('./services/emailService');

// Send verification email
await sendVerificationEmail(
  'user@example.com',  // recipient
  'John Doe',          // user's name
  '123456'             // verification code
);
```

---

## Alternative Email Services

If Gmail doesn't work for you, consider:

### 1. **SendGrid**
- Free tier: 100 emails/day
- Great deliverability
- Easy API

### 2. **Mailgun**
- Free tier: 5,000 emails/month
- Powerful features
- Good for developers

### 3. **AWS SES**
- Pay as you go
- Very cheap at scale
- Requires AWS account

### 4. **Postmark**
- $10/month for 10,000 emails
- Excellent for transactional emails
- Great support

---

## Production Considerations

### Before going live:

1. **Set up email service** (SendGrid/Mailgun recommended)
2. **Configure domain email** (no-reply@yourdomain.com)
3. **Set up SPF/DKIM records** for deliverability
4. **Enable email logging/monitoring**
5. **Add email templates storage** (database or files)
6. **Implement email queue** (Bull, BullMQ) for reliability
7. **Add retry logic** for failed sends
8. **Set up bounce/complaint handling**

---

## Testing Checklist

- [ ] Backend `.env` file created with email credentials
- [ ] Nodemailer package installed
- [ ] Gmail 2-Step Verification enabled
- [ ] App password generated and saved
- [ ] Test email sent successfully
- [ ] Verification email received
- [ ] Email design looks good on mobile
- [ ] Spam folder checked
- [ ] Backend logs show success

---

## Support

If you're still having issues:

1. Check backend console for detailed error messages
2. Verify all environment variables are set correctly
3. Try the test email script
4. Check Gmail account security settings
5. Make sure 2-Step Verification is actually enabled

---

**Status**: ✅ Nodemailer with Gmail configured!

**Next**: Test registration flow with real email delivery

