const Newsletter = require('../models/Newsletter');
const {
  sendNewsletterWelcomeEmail,
  sendNewsletterAdminNotification,
} = require('../services/emailService');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email, source = 'homepage' } = req.body;

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email: normalizedEmail });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.source = source;
        existingSubscription.subscribedAt = new Date();
        existingSubscription.unsubscribedAt = null;
        existingSubscription.ipAddress = req.ip;
        existingSubscription.userAgent = req.get('user-agent');
        
        await existingSubscription.save();

        // Send welcome email to resubscriber (non-blocking)
        try {
          sendNewsletterWelcomeEmail(normalizedEmail).catch(err => 
            console.error('❌ Failed to send welcome email:', err)
          );
        } catch (emailError) {
          console.error('❌ Email sending error (non-blocking):', emailError);
        }

        // Send admin notification (non-blocking)
        try {
          sendNewsletterAdminNotification(normalizedEmail, source).catch(err => 
            console.error('❌ Failed to send admin notification:', err)
          );
        } catch (emailError) {
          console.error('❌ Admin notification error (non-blocking):', emailError);
        }
        
        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter',
          data: {
            subscription: existingSubscription
          }
        });
      }
    }

    // Create new subscription
    const subscription = await Newsletter.create({
      email: normalizedEmail,
      source,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Send welcome email to subscriber (non-blocking)
    try {
      sendNewsletterWelcomeEmail(normalizedEmail).catch(err => 
        console.error('❌ Failed to send welcome email:', err)
      );
    } catch (emailError) {
      console.error('❌ Email sending error (non-blocking):', emailError);
    }

    // Send admin notification (non-blocking)
    try {
      sendNewsletterAdminNotification(normalizedEmail, source).catch(err => 
        console.error('❌ Failed to send admin notification:', err)
      );
    } catch (emailError) {
      console.error('❌ Admin notification error (non-blocking):', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        subscription: {
          email: subscription.email,
          subscribedAt: subscription.subscribedAt
        }
      }
    });
  } catch (err) {
    console.error('[Newsletter Subscribe Error]', err);
    
    // Handle duplicate key error (MongoDB unique constraint)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack
      })
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const subscription = await Newsletter.findOne({ email: normalizedEmail });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    if (!subscription.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This email is already unsubscribed'
      });
    }

    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (err) {
    console.error('[Newsletter Unsubscribe Error]', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

// @desc    Get all newsletter subscriptions (Admin)
// @route   GET /api/admin/newsletter
// @access  Private/Admin
exports.getAllSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, status } = req.query;

    // Build filter
    const filter = {};
    
    if (search) {
      filter.email = { $regex: search, $options: 'i' };
    }
    
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const [subscriptions, total] = await Promise.all([
      Newsletter.find(filter)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit),
      Newsletter.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (err) {
    console.error('[Get Newsletter Subscriptions Error]', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching newsletter subscriptions'
    });
  }
};

// @desc    Delete newsletter subscription (Admin)
// @route   DELETE /api/admin/newsletter/:id
// @access  Private/Admin
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Newsletter.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    await subscription.deleteOne();

    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (err) {
    console.error('[Delete Newsletter Subscription Error]', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting subscription'
    });
  }
};

