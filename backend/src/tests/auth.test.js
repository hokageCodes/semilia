require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../models/User');

describe('🔐 AUTHENTICATION API', () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    // Clean up existing test data
    await User.deleteMany({ email: { $regex: /^auth-test.*@example\.com$/ } });
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: { $regex: /^auth-test.*@example\.com$/ } });
    await mongoose.disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'auth-test-user@example.com',
        password: 'TestPass123',
        phone: '+2348012345678'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data.user.name).toBe(userData.name);
      expect(res.body.data.token).toBeDefined();
    });

    it('should fail to register with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'TestPass123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail to register with weak password', async () => {
      const userData = {
        name: 'Test User',
        email: 'auth-test-weak@example.com',
        password: '123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail to register with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'auth-test-user@example.com', // Same email as first test
        password: 'TestPass123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First verify the user's email
      const user = await User.findOne({ email: 'auth-test-user@example.com' });
      if (user && !user.emailVerified) {
        user.emailVerified = true;
        await user.save();
      }

      const loginData = {
        email: 'auth-test-user@example.com',
        password: 'TestPass123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(loginData.email);
      expect(res.body.data.token).toBeDefined();
    });

    it('should fail to login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPass123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should fail to login with invalid password', async () => {
      const loginData = {
        email: 'auth-test-user@example.com',
        password: 'WrongPassword'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should fail to login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/register-admin', () => {
    it('should register admin with valid secret', async () => {
      const adminData = {
        name: 'Admin User',
        email: 'auth-test-admin@example.com',
        password: 'AdminPass123',
        adminSecret: process.env.ADMIN_SECRET || 'admin123'
      };

      const res = await request(app)
        .post('/api/auth/register-admin')
        .send(adminData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('admin');
    });

    it('should fail to register admin with invalid secret', async () => {
      const adminData = {
        name: 'Admin User',
        email: 'auth-test-admin2@example.com',
        password: 'AdminPass123',
        adminSecret: 'wrong-secret'
      };

      const res = await request(app)
        .post('/api/auth/register-admin')
        .send(adminData);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid admin secret');
    });
  });
});
