const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendVerificationEmail } = require('../services/emailService');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ 
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim(),
      address: address || {},
      role: 'user' // Always default to user for security
    });

    console.log('✅ User created:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Create token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationToken = verificationCode;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationCode);
      console.log(`✅ Verification email sent to ${user.email}`);
    } catch (emailError) {
      console.error('⚠️ Email sending failed, but registration succeeded:', emailError.message);
      // Log the code for development/backup
      console.log(`📧 Verification code for ${user.email}: ${verificationCode}`);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          emailVerified: user.emailVerified,
        },
        token,
        requiresVerification: true,
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};

// @desc    Register admin user (separate endpoint for security)
// @route   POST /api/auth/register-admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // Simple admin secret check (you should set this in your .env file)
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid admin secret' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ 
      success: false,
      message: 'Email already exists' 
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save admin user (email verified automatically for admins)
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      role: 'admin',
      emailVerified: true // Admins don't need email verification
    });

    console.log('✅ Admin user created:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      }
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during admin registration',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check if account is locked (skip for admin users)
    // if (user.isLocked && user.role !== 'admin') {
    //   return res.status(423).json({
    //     success: false,
    //     message: 'Account temporarily locked due to too many failed login attempts'
    //   });
    // }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts (skip for admin users)
      // if (user.role !== 'admin') {
      //   await user.incLoginAttempts();
      // }
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check if email is verified (skip for admin users - they're created via seeding/admin registration)
    if (!user.emailVerified && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('✅ User logged in:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Create token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          lastLogin: user.lastLogin,
        },
        token,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};

// @desc    Verify email with code
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      emailVerificationToken: code 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    console.log('✅ Email verified:', user.email);

    res.json({
      success: true,
      message: 'Email verified successfully!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        }
      }
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

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

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationToken = verificationCode;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationCode);
      console.log(`✅ Verification email resent to ${user.email}`);
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
      // Log the code for development/backup
      console.log(`📧 New verification code for ${user.email}: ${verificationCode}`);
    }

    res.json({
      success: true,
      message: 'Verification code sent! Please check your email.'
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while resending code',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};