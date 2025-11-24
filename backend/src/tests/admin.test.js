require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../app');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

let adminToken;
let userToken;
let adminUserId;
let userId;
let productId;
let orderId;

beforeAll(async () => {
  console.log('🔍 ADMIN TEST SETUP');
  
  // Connect to test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  
  console.log('Connected to database:', mongoose.connection.name);
  
  // Clean up existing test data
  await User.deleteMany({ email: { $regex: /^admin-test.*@example\.com$/ } });
  await Product.deleteMany({ name: { $regex: /^Admin Test.*/ } });
  await Order.deleteMany({});
  
  // Create test admin user
  const adminUser = new User({
    name: 'Admin Test Admin',
    email: 'admin-test-admin@example.com',
    password: '$2b$10$1vGChhaFE6rWBldRT0e.oepib2eyj5GqgiNLCtam2ynXfjhXOJQR2',
    role: 'admin',
  });
  
  const savedAdmin = await adminUser.save();
  adminUserId = savedAdmin._id;
  adminToken = jwt.sign({ id: savedAdmin._id }, process.env.JWT_SECRET);
  console.log('✅ Test admin created:', savedAdmin._id);
  
  // Create test regular user
  const testUser = new User({
    name: 'Admin Test User',
    email: 'admin-test-user@example.com',
    password: '$2b$10$1vGChhaFE6rWBldRT0e.oepib2eyj5GqgiNLCtam2ynXfjhXOJQR2',
    role: 'user',
  });
  
  const savedUser = await testUser.save();
  userId = savedUser._id;
  userToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
  console.log('✅ Test user created:', savedUser._id);
  
  // Create test product
  const product = new Product({
    name: 'Admin Test Product',
    description: 'A test product for admin testing',
    price: 1500,
    countInStock: 20,
    brand: 'Test Brand',
    category: { main: 'Men', sub: 'Tops' },
    isFeatured: true,
    createdBy: adminUserId
  });
  
  const savedProduct = await product.save();
  productId = savedProduct._id;
  console.log('✅ Test product created:', productId);
  
  // Create test order
  const order = new Order({
    user: userId,
    orderItems: [{
      name: 'Admin Test Product',
      qty: 2,
      price: 1500,
      product: productId
    }],
    shippingInfo: {
      fullName: 'Admin Test User',
      address: '123 Test Street',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      postalCode: '100001',
      phone: '+2348012345678'
    },
    paymentMethod: 'Cash on Delivery',
    totalPrice: 3000,
    isPaid: false,
    isDelivered: false
  });
  
  const savedOrder = await order.save();
  orderId = savedOrder._id;
  console.log('✅ Test order created:', orderId);
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany({ email: { $regex: /^admin-test.*@example\.com$/ } });
  await Product.deleteMany({ name: { $regex: /^Admin Test.*/ } });
  await Order.deleteMany({});
  
  await mongoose.disconnect();
});

describe('👑 ADMIN API', () => {
  describe('GET /api/admin/stats', () => {
    it('should get admin stats as admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.overview).toBeDefined();
      expect(res.body.data.overview.totalUsers).toBeDefined();
      expect(res.body.data.overview.totalOrders).toBeDefined();
      expect(res.body.data.overview.totalProducts).toBeDefined();
      expect(res.body.data.overview.totalRevenue).toBeDefined();
      expect(res.body.data.monthlySales).toBeDefined();
      expect(res.body.data.topCustomers).toBeDefined();
      expect(res.body.data.recentOrders).toBeDefined();
      expect(res.body.data.recentUsers).toBeDefined();
      expect(res.body.data.lowStockProducts).toBeDefined();
      expect(res.body.data.alerts).toBeDefined();
    });

    it('should fail to get admin stats without token', async () => {
      const res = await request(app)
        .get('/api/admin/stats');

      expect(res.statusCode).toBe(401);
    });

    it('should fail to get admin stats with user token', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should get all users as admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.users).toBeDefined();
      expect(Array.isArray(res.body.data.users)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should get users with pagination', async () => {
      const res = await request(app)
        .get('/api/admin/users?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.pagination.current).toBe(1);
      expect(res.body.data.users.length).toBeLessThanOrEqual(5);
    });

    it('should get users with search', async () => {
      const res = await request(app)
        .get('/api/admin/users?search=Admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users).toBeDefined();
    });

    it('should get users with role filter', async () => {
      const res = await request(app)
        .get('/api/admin/users?role=admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users).toBeDefined();
    });

    it('should get users with status filter', async () => {
      const res = await request(app)
        .get('/api/admin/users?isActive=true')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users).toBeDefined();
    });

    it('should fail to get users without admin token', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PATCH /api/admin/users/:id/status', () => {
    it('should update user status as admin', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${userId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.isActive).toBe(false);
    });

    it('should update user role as admin', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${userId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'banned' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('banned');
    });

    it('should fail to update non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/admin/users/${fakeId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should fail to update other admin accounts', async () => {
      // Create another admin user
      const anotherAdmin = new User({
        name: 'Another Admin',
        email: 'admin-test-another@example.com',
        password: '$2b$10$1vGChhaFE6rWBldRT0e.oepib2eyj5GqgiNLCtam2ynXfjhXOJQR2',
        role: 'admin',
      });
      
      const savedAnotherAdmin = await anotherAdmin.save();
      
      const res = await request(app)
        .patch(`/api/admin/users/${savedAnotherAdmin._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Cannot modify other admin accounts');
      
      // Clean up
      await User.findByIdAndDelete(savedAnotherAdmin._id);
    });

    it('should fail to update user status without admin token', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${userId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ isActive: true });

      // Should return 401 (unauthorized) or 403 (forbidden) - both are valid
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body.success).toBe(false);
    });
  });
});
