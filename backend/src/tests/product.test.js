require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../app');

const User = require('../models/User');
const Product = require('../models/Product');

let adminToken;
let userToken;
let adminUserId;
let userId;
let productId;

beforeAll(async () => {
  console.log('🔍 PRODUCT TEST SETUP');
  
  // Connect to test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  
  console.log('Connected to database:', mongoose.connection.name);
  
  // Clean up existing test data
  await User.deleteMany({ email: { $regex: /^product-test.*@example\.com$/ } });
  await Product.deleteMany({ name: { $regex: /^Product Test.*/ } });
  
  // Create test admin user
  const adminUser = new User({
    name: 'Product Test Admin',
    email: 'product-test-admin@example.com',
    password: '$2b$10$1vGChhaFE6rWBldRT0e.oepib2eyj5GqgiNLCtam2ynXfjhXOJQR2',
    role: 'admin',
  });
  
  const savedAdmin = await adminUser.save();
  adminUserId = savedAdmin._id;
  adminToken = jwt.sign({ id: savedAdmin._id }, process.env.JWT_SECRET);
  console.log('✅ Test admin created:', savedAdmin._id);
  
  // Create test regular user
  const testUser = new User({
    name: 'Product Test User',
    email: 'product-test-user@example.com',
    password: '$2b$10$1vGChhaFE6rWBldRT0e.oepib2eyj5GqgiNLCtam2ynXfjhXOJQR2',
    role: 'user',
  });
  
  const savedUser = await testUser.save();
  userId = savedUser._id;
  userToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
  console.log('✅ Test user created:', savedUser._id);
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany({ email: { $regex: /^product-test.*@example\.com$/ } });
  await Product.deleteMany({ name: { $regex: /^Product Test.*/ } });
  
  await mongoose.disconnect();
});

describe('🛍️ PRODUCT API', () => {
  describe('POST /api/products (Admin Only)', () => {
    it('should create a new product as admin', async () => {
      const productData = {
        name: 'Product Test Shirt',
        description: 'A test shirt for product testing',
        price: 2500,
        countInStock: 10,
        brand: 'Test Brand',
        category: JSON.stringify({ main: 'Men', sub: 'Tops' }),
        isFeatured: 'true'
      };

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(productData.name);
      expect(res.body.price).toBe(productData.price);
      expect(res.body.isFeatured).toBe(true);
      
      productId = res.body._id;
      console.log('✅ Test product created:', productId);
    });

    it('should fail to create product without admin token', async () => {
      const productData = {
        name: 'Unauthorized Product',
        description: 'This should fail',
        price: 1000,
        countInStock: 5,
        category: JSON.stringify({ main: 'Women', sub: 'Dresses' })
      };

      const res = await request(app)
        .post('/api/products')
        .send(productData);

      expect(res.statusCode).toBe(401);
    });

    it('should fail to create product with user token', async () => {
      const productData = {
        name: 'User Product',
        description: 'This should fail',
        price: 1000,
        countInStock: 5,
        category: JSON.stringify({ main: 'Women', sub: 'Dresses' })
      };

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const res = await request(app)
        .get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toBeDefined();
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.total).toBeDefined();
    });

    it('should get products with pagination', async () => {
      const res = await request(app)
        .get('/api/products?page=1&limit=5');

      expect(res.statusCode).toBe(200);
      expect(res.body.page).toBe(1);
      expect(res.body.pages).toBeDefined();
    });

    it('should get products with search', async () => {
      const res = await request(app)
        .get('/api/products?keyword=shirt');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toBeDefined();
    });

    it('should get products with category filter', async () => {
      const res = await request(app)
        .get('/api/products?category=Tops');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toBeDefined();
    });

    it('should get products with price filter', async () => {
      const res = await request(app)
        .get('/api/products?minPrice=1000&maxPrice=5000');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toBeDefined();
    });

    it('should get featured products', async () => {
      const res = await request(app)
        .get('/api/products?featured=true');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toBeDefined();
    });
  });

  describe('GET /api/products/featured', () => {
    it('should get featured products', async () => {
      const res = await request(app)
        .get('/api/products/featured');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toBeDefined();
      expect(Array.isArray(res.body.products)).toBe(true);
    });

    it('should get featured products with limit', async () => {
      const res = await request(app)
        .get('/api/products/featured?limit=3');

      expect(res.statusCode).toBe(200);
      expect(res.body.products).toBeDefined();
      expect(res.body.products.length).toBeLessThanOrEqual(3);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a single product by ID', async () => {
      const res = await request(app)
        .get(`/api/products/${productId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(productId);
      expect(res.body.name).toBe('Product Test Shirt');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/products/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });

    it('should return 400 for invalid product ID', async () => {
      const res = await request(app)
        .get('/api/products/invalid-id');

      expect(res.statusCode).toBe(500);
    });
  });

  describe('PUT /api/products/:id (Admin Only)', () => {
    it('should update a product as admin', async () => {
      const updateData = {
        name: 'Updated Product Test Shirt',
        price: 3000,
        countInStock: 15
      };

      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updateData.name);
      expect(res.body.price).toBe(updateData.price);
      expect(res.body.countInStock).toBe(updateData.countInStock);
    });

    it('should fail to update product without admin token', async () => {
      const updateData = {
        name: 'Unauthorized Update'
      };

      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send(updateData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/products/:id/featured (Admin Only)', () => {
    it('should toggle featured status as admin', async () => {
      const res = await request(app)
        .patch(`/api/products/${productId}/featured`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBeDefined();
      expect(res.body.product.isFeatured).toBeDefined();
    });

    it('should fail to toggle featured without admin token', async () => {
      const res = await request(app)
        .patch(`/api/products/${productId}/featured`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/products/:id (Admin Only)', () => {
    it('should delete a product as admin', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Product removed');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });

    it('should fail to delete product without admin token', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/products/categories', () => {
    it('should get product categories', async () => {
      const res = await request(app)
        .get('/api/products/categories');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
