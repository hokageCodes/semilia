const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

// Email templates
const emailTemplates = {
  verification: (name, code) => ({
    subject: 'Verify Your Email - Semilia',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
          }
          .code-box {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #000;
            font-family: monospace;
          }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
          .note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SEMILIA</div>
            <h2 style="margin: 0; color: #333;">Verify Your Email Address</h2>
          </div>
          
          <p>Hi ${name},</p>
          
          <p>Welcome to Semilia! We're excited to have you on board. To complete your registration, please verify your email address using the code below:</p>
          
          <div class="code-box">
            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">Your Verification Code</p>
            <div class="code">${code}</div>
          </div>
          
          <p>Enter this code on the verification page to activate your account.</p>
          
          <div class="note">
            <strong>⏰ Note:</strong> This code is valid for 15 minutes.
          </div>
          
          <p>If you didn't create an account with Semilia, you can safely ignore this email.</p>
          
          <div class="footer">
            <p><strong>Semilia</strong> - Your Fashion Destination</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name},

Welcome to Semilia! Your verification code is: ${code}

Enter this code on the verification page to activate your account.

This code is valid for 15 minutes.

If you didn't create an account with Semilia, you can safely ignore this email.

---
Semilia - Your Fashion Destination
    `,
  }),

  orderConfirmation: (name, orderNumber, total, paymentMethod) => ({
    subject: `Order Confirmation #${orderNumber} - Semilia`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .order-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
          }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
          .payment-note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✓</div>
            <div class="logo">SEMILIA</div>
            <h2 style="margin: 0; color: #333;">Order Confirmed!</h2>
          </div>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for your order! We're getting your items ready for shipment.</p>
          
          <div class="order-details">
            <div class="detail-row">
              <span>Order Number:</span>
              <span><strong>#${orderNumber}</strong></span>
            </div>
            <div class="detail-row">
              <span>Payment Method:</span>
              <span><strong>${paymentMethod}</strong></span>
            </div>
            <div class="detail-row">
              <span>Total Amount:</span>
              <span><strong>₦${total.toLocaleString()}</strong></span>
            </div>
          </div>
          
          ${paymentMethod === 'Transfer' ? `
          <div class="payment-note">
            <strong> banking Instructions:</strong><br>
            Please complete your bank transfer to finalize your order. We'll process your order once payment is confirmed.
          </div>
          ` : ''}
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderNumber}" class="button">
              View Order Details
            </a>
          </center>
          
          <p>We'll send you another email when your order ships.</p>
          
          <div class="footer">
            <p><strong>Semilia</strong> - Your Fashion Destination</p>
            <p>Need help? Contact us at support@semilia.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name},

Thank you for your order! We're getting your items ready for shipment.

Order Number: #${orderNumber}
Payment Method: ${paymentMethod}
Total Amount: ₦${total.toLocaleString()}

${paymentMethod === 'Transfer' ? 'Please complete your bank transfer to finalize your order. We\'ll process your order once payment is confirmed.\n' : ''}
We'll send you another email when your order ships.

---
Semilia - Your Fashion Destination
Need help? Contact us at support@semilia.com
    `,
  }),

  orderNotificationAdmin: (orderNumber, customerName, customerEmail, total, paymentMethod, orderId) => ({
    subject: `🆕 New Order Received - #${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: #000;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .alert-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .order-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
          }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
          .urgent {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="alert-icon">🆕</div>
            <div class="logo">SEMILIA ADMIN</div>
            <h2 style="margin: 0;">New Order Received</h2>
          </div>
          
          <p><strong>A new order has been placed and requires your attention.</strong></p>
          
          <div class="order-details">
            <div class="detail-row">
              <span>Order Number:</span>
              <span><strong>#${orderNumber}</strong></span>
            </div>
            <div class="detail-row">
              <span>Customer:</span>
              <span><strong>${customerName}</strong></span>
            </div>
            <div class="detail-row">
              <span>Email:</span>
              <span>${customerEmail}</span>
            </div>
            <div class="detail-row">
              <span>Payment Method:</span>
              <span><strong>${paymentMethod}</strong></span>
            </div>
            <div class="detail-row">
              <span>Total Amount:</span>
              <span><strong>₦${total.toLocaleString()}</strong></span>
            </div>
          </div>
          
          <div class="urgent">
            <strong>⚠️ Action Required:</strong><br>
            ${paymentMethod === 'Transfer' ? 'Verify bank transfer and confirm payment when received.' : 'Review order and process accordingly.'}
          </div>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders/${orderId}" class="button">
              View Order in Admin Panel
            </a>
          </center>
          
          <div class="footer">
            <p><strong>Semilia Admin Panel</strong></p>
            <p>This is an automated notification email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
🆕 NEW ORDER RECEIVED

Order Number: #${orderNumber}
Customer: ${customerName}
Email: ${customerEmail}
Payment Method: ${paymentMethod}
Total Amount: ₦${total.toLocaleString()}

${paymentMethod === 'Transfer' ? '⚠️ Action Required: Verify bank transfer and confirm payment when received.' : 'Review order and process accordingly.'}

View Order: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders/${orderId}

---
Semilia Admin Panel
    `,
  }),

  newsletterWelcome: (email) => ({
    subject: 'Welcome to SEMILIA Newsletter! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
          }
          .welcome-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .benefits {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .benefit-item {
            display: flex;
            align-items: start;
            margin-bottom: 15px;
          }
          .benefit-item:last-child {
            margin-bottom: 0;
          }
          .benefit-icon {
            font-size: 24px;
            margin-right: 15px;
            flex-shrink: 0;
          }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="welcome-icon">🎉</div>
            <div class="logo">SEMILIA</div>
            <h2 style="margin: 0; color: #333;">Welcome to Our Newsletter!</h2>
          </div>
          
          <p>Thank you for subscribing to the SEMILIA newsletter!</p>
          
          <p>We're thrilled to have you join our fashion community. Get ready to receive exclusive updates, style inspiration, and special offers delivered straight to your inbox.</p>
          
          <div class="benefits">
            <h3 style="margin-top: 0; color: #000;">What to Expect:</h3>
            <div class="benefit-item">
              <span class="benefit-icon">🆕</span>
              <div>
                <strong>New Arrivals</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Be the first to know about our latest fashion collections</p>
              </div>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">💰</span>
              <div>
                <strong>Exclusive Offers</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Special discounts and promotions just for subscribers</p>
              </div>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">💡</span>
              <div>
                <strong>Style Tips & Trends</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Fashion advice and trend updates from our style experts</p>
              </div>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">🎁</span>
              <div>
                <strong>Early Access</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Get early access to sales and limited edition items</p>
              </div>
            </div>
          </div>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop" class="button">
              Start Shopping
            </a>
          </center>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            You can unsubscribe at any time by clicking the link in any of our emails or by contacting us.
          </p>
          
          <div class="footer">
            <p><strong>Semilia</strong> - Your Fashion Destination</p>
            <p>Follow us on Instagram <a href="https://www.instagram.com/semilia" style="color: #000;">@semilia</a></p>
            <p>Need help? Contact us at support@semilia.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to SEMILIA Newsletter! 🎉

Thank you for subscribing to the SEMILIA newsletter!

We're thrilled to have you join our fashion community. Get ready to receive exclusive updates, style inspiration, and special offers delivered straight to your inbox.

What to Expect:
🆕 New Arrivals - Be the first to know about our latest fashion collections
💰 Exclusive Offers - Special discounts and promotions just for subscribers
💡 Style Tips & Trends - Fashion advice and trend updates from our style experts
🎁 Early Access - Get early access to sales and limited edition items

Start Shopping: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop

You can unsubscribe at any time by clicking the link in any of our emails or by contacting us.

---
Semilia - Your Fashion Destination
Follow us on Instagram @semilia
Need help? Contact us at support@semilia.com
    `,
  }),

  newsletterAdminNotification: (email, source) => ({
    subject: `📧 New Newsletter Subscription - ${email}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: #000;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .alert-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .info-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="alert-icon">📧</div>
            <div class="logo">SEMILIA ADMIN</div>
            <h2 style="margin: 0;">New Newsletter Subscription</h2>
          </div>
          
          <p><strong>A new subscriber has joined the newsletter!</strong></p>
          
          <div class="info-box">
            <div class="info-row">
              <span><strong>Email:</strong></span>
              <span>${email}</span>
            </div>
            <div class="info-row">
              <span><strong>Source:</strong></span>
              <span style="text-transform: capitalize;">${source || 'homepage'}</span>
            </div>
            <div class="info-row">
              <span><strong>Subscribed At:</strong></span>
              <span>${new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/newsletter" class="button">
              View All Subscriptions
            </a>
          </center>
          
          <div class="footer">
            <p><strong>Semilia Admin Panel</strong></p>
            <p>This is an automated notification email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
📧 NEW NEWSLETTER SUBSCRIPTION

A new subscriber has joined the newsletter!

Email: ${email}
Source: ${source || 'homepage'}
Subscribed At: ${new Date().toLocaleString()}

View All Subscriptions: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/newsletter

---
Semilia Admin Panel
This is an automated notification email.
    `,
  }),

  paymentConfirmation: (name, orderNumber, total) => ({
    subject: `Payment Confirmed - Order #${orderNumber} - Semilia`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 10px;
            color: #28a745;
          }
          .order-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
          }
          .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
          .success-box {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✓</div>
            <div class="logo">SEMILIA</div>
            <h2 style="margin: 0; color: #333;">Payment Confirmed!</h2>
          </div>
          
          <p>Hi ${name},</p>
          
          <div class="success-box">
            <strong>✅ Great news!</strong> We've received and confirmed your payment for order #${orderNumber}.
          </div>
          
          <p>Your order is now being processed and will be shipped soon.</p>
          
          <div class="order-details">
            <div class="detail-row">
              <span>Order Number:</span>
              <span><strong>#${orderNumber}</strong></span>
            </div>
            <div class="detail-row">
              <span>Amount Paid:</span>
              <span><strong>₦${total.toLocaleString()}</strong></span>
            </div>
          </div>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderNumber}" class="button">
              Track Your Order
            </a>
          </center>
          
          <p><strong>What's Next?</strong></p>
          <ul style="line-height: 2;">
            <li>We're preparing your items for shipment</li>
            <li>You'll receive an email when your order ships</li>
            <li>You can track your order status anytime</li>
          </ul>
          
          <div class="footer">
            <p><strong>Semilia</strong> - Your Fashion Destination</p>
            <p>Need help? Contact us at support@semilia.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name},

✅ Great news! We've received and confirmed your payment for order #${orderNumber}.

Your order is now being processed and will be shipped soon.

Order Number: #${orderNumber}
Amount Paid: ₦${total.toLocaleString()}

What's Next?
- We're preparing your items for shipment
- You'll receive an email when your order ships
- You can track your order status anytime

Track your order: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderNumber}

---
Semilia - Your Fashion Destination
Need help? Contact us at support@semilia.com
    `,
  }),
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Skip email sending in test environment
    if (process.env.NODE_ENV === 'test') {
      console.log('📧 [TEST MODE] Email skipped:', { to, subject });
      return { success: true, messageId: 'test-message-id' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Semilia Fashion" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send verification email
const sendVerificationEmail = async (email, name, code) => {
  const { subject, html, text } = emailTemplates.verification(name, code);
  return await sendEmail({ to: email, subject, html, text });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, name, orderNumber, total, paymentMethod) => {
  const { subject, html, text } = emailTemplates.orderConfirmation(name, orderNumber, total, paymentMethod);
  return await sendEmail({ to: email, subject, html, text });
};

// Send order notification to admin
const sendOrderNotificationToAdmin = async (orderNumber, customerName, customerEmail, total, paymentMethod, orderId) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) {
    console.warn('⚠️ ADMIN_EMAIL not set, skipping admin notification');
    return { success: false, message: 'Admin email not configured' };
  }
  
  const { subject, html, text } = emailTemplates.orderNotificationAdmin(
    orderNumber,
    customerName,
    customerEmail,
    total,
    paymentMethod,
    orderId
  );
  return await sendEmail({ to: adminEmail, subject, html, text });
};

// Send payment confirmation email
const sendPaymentConfirmationEmail = async (email, name, orderNumber, total) => {
  const { subject, html, text } = emailTemplates.paymentConfirmation(name, orderNumber, total);
  return await sendEmail({ to: email, subject, html, text });
};

// Send newsletter welcome email
const sendNewsletterWelcomeEmail = async (email) => {
  const { subject, html, text } = emailTemplates.newsletterWelcome(email);
  return await sendEmail({ to: email, subject, html, text });
};

// Send newsletter admin notification
const sendNewsletterAdminNotification = async (email, source) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) {
    console.warn('⚠️ ADMIN_EMAIL not set, skipping admin notification');
    return { success: false, message: 'Admin email not configured' };
  }
  
  const { subject, html, text } = emailTemplates.newsletterAdminNotification(email, source);
  return await sendEmail({ to: adminEmail, subject, html, text });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendOrderConfirmationEmail,
  sendOrderNotificationToAdmin,
  sendPaymentConfirmationEmail,
  sendNewsletterWelcomeEmail,
  sendNewsletterAdminNotification,
};

