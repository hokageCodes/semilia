require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../app');

const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

let token;
let productId;
let userId;
let adminToken;
let adminUserId;

beforeAll(async () => {
    console.log('🔍 ORDER TEST SETUP');
    console.log('MONGO_URI:', process.env.MONGO_URI);
    
    // Connect to database
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }
    
    console.log('Connected to database:', mongoose.connection.name);
    
    // Clean up existing test data
    await User.deleteMany({ email: { $regex: /^order-test.*@example\.com$/ } });
    await Product.deleteMany({ name: { $regex: /^Order Test.*/ } });
    await Cart.deleteMany({});
    
    // Create test user
    const testUser = new User({
        name: 'Order Test User',
        email: 'order-test-user@example.com',
        password: '$2b$10$1vGChhaFE6rWBldRT0e.oepib2eyj5GqgiNLCtam2ynXfjhXOJQR2',
        role: 'user',
    });
    
    const savedUser = await testUser.save();
    userId = savedUser._id;
    token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    console.log('✅ Test user created:', savedUser._id);
    
    // Create test admin
    const adminUser = new User({
        name: 'Order Test Admin',
        email: 'order-test-admin@example.com',
        password: '$2b$10$1vGChhaFE6rWBldRT0e.oepib2eyj5GqgiNLCtam2ynXfjhXOJQR2',
        role: 'admin',
    });
    
    const savedAdmin = await adminUser.save();
    adminUserId = savedAdmin._id;
    adminToken = jwt.sign({ id: savedAdmin._id }, process.env.JWT_SECRET);
    console.log('✅ Test admin created:', savedAdmin._id);
    
    // Create test product
    const product = new Product({
        name: 'Order Test Shirt',
        description: 'A test shirt for order testing',
        price: 200,
        countInStock: 5,
        brand: 'Test Brand',
        category: { main: 'Men', sub: 'Tops' },
    });
    
    const savedProduct = await product.save();
    productId = savedProduct._id.toString();
    console.log('✅ Test product created:', productId);
    
    // Verify setup
    const userCheck = await User.findById(userId);
    const adminCheck = await User.findById(adminUserId);
    const productCheck = await Product.findById(productId);
    
    console.log('Final verification:');
    console.log('- User exists:', !!userCheck, userCheck?.role);
    console.log('- Admin exists:', !!adminCheck, adminCheck?.role);
    console.log('- Product exists:', !!productCheck);
});

afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: { $regex: /^order-test.*@example\.com$/ } });
    await Product.deleteMany({ name: { $regex: /^Order Test.*/ } });
    await Cart.deleteMany({ user: { $in: [userId, adminUserId] } });
    
    await mongoose.disconnect();
});

describe('🛒 CART API', () => {
    it('should add a product to the cart', async () => {
        console.log('🧪 Testing cart with user:', userId);
        
        // Verify user still exists before the test
        const userExists = await User.findById(userId);
        console.log('User exists before test:', !!userExists);
        
        const res = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 2 });

        console.log('Cart response:', res.statusCode, res.body?.message || 'Success');

        expect(res.statusCode).toBe(200);
        expect(res.body.items[0].product).toBeDefined();
        expect(res.body.items[0].quantity).toBe(2);
    }, 10000); // Increase timeout

    it('should update the quantity if product already exists in cart', async () => {
        // Verify user still exists
        const userExists = await User.findById(userId);
        console.log('User exists for update test:', !!userExists);
        
        const res = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body.items[0].quantity).toBe(3); // 2 + 1
    }, 10000);

    it('should retrieve the user\'s cart', async () => {
        // Verify user still exists
        const userExists = await User.findById(userId);
        console.log('User exists for get test:', !!userExists);
        
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBeGreaterThan(0);
    }, 10000);

    it('should remove a product from the cart', async () => {
        // Verify user still exists
        const userExists = await User.findById(userId);
        console.log('User exists for remove test:', !!userExists);
        
        const res = await request(app)
            .delete(`/api/cart/${productId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.items.length).toBe(0);
    }, 10000);

    it('should return 401 for unauthenticated requests', async () => {
        const res = await request(app).get('/api/cart');
        expect(res.statusCode).toBe(401);
    });
});

// Export tokens for use in other test files
module.exports = { token, adminToken, productId, userId, adminUserId };