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

beforeAll(async () => {
    console.log('🔍 CART TEST SETUP');
    
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }
    
    console.log('Connected to database:', mongoose.connection.name);
    
    // Clean up existing test data first
    await User.deleteMany({ email: { $regex: /^cart-test.*@example\.com$/ } });
    await Product.deleteMany({ name: { $regex: /^Cart Test.*/ } });
    await Cart.deleteMany({});
    
    // Create test user
    const testUser = new User({
        name: 'Cart Test User',
        email: 'cart-test-user@example.com',
        password: '$2b$10$1vGChhaFE6rWBldRT0e.oepib2eyj5GqgiNLCtam2ynXfjhXOJQR2',
        role: 'user',
    });
    
    const savedUser = await testUser.save();
    userId = savedUser._id;
    token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    console.log('✅ Test user created:', savedUser._id);
    
    // Create test product
    const testProduct = new Product({
        name: 'Cart Test Shirt',
        description: 'A test shirt for cart testing',
        price: 250,
        countInStock: 10,
        brand: 'Test Brand',
        category: { main: 'Men', sub: 'Tops' },
    });
    
    const savedProduct = await testProduct.save();
    productId = savedProduct._id.toString(); // Convert to string for consistency
    console.log('✅ Test product created:', productId);
    
    // Verify setup
    const userExists = await User.findById(userId);
    const productExists = await Product.findById(productId);
    
    console.log('Setup verification:');
    console.log('- User exists:', !!userExists);
    console.log('- Product exists:', !!productExists);
    console.log('- User ID:', userId.toString());
    console.log('- Product ID:', productId);
    console.log('- Token length:', token.length);
});

afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: { $regex: /^cart-test.*@example\.com$/ } });
    await Product.deleteMany({ name: { $regex: /^Cart Test.*/ } });
    await Cart.deleteMany({ user: userId });
    
    await mongoose.disconnect();
});

describe('🛒 CART API', () => {
    it('should add a product to the cart', async () => {
        console.log('🧪 Testing ADD TO CART');
        console.log('- User ID:', userId.toString());
        console.log('- Product ID:', productId);
        
        const res = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: productId, quantity: 2 });

        console.log('Response status:', res.statusCode);
        console.log('Response body:', JSON.stringify(res.body, null, 2));

        expect(res.statusCode).toBe(200);
        expect(res.body.items).toBeDefined();
        expect(res.body.items.length).toBe(1);
        expect(res.body.items[0].product).toBeDefined();
        expect(res.body.items[0].quantity).toBe(2);
    });

    it('should update the quantity if product already exists in cart', async () => {
        console.log('🧪 Testing UPDATE CART QUANTITY');
        
        const res = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: productId, quantity: 1 });

        console.log('Update response status:', res.statusCode);
        console.log('Update response quantity:', res.body.items?.[0]?.quantity);

        expect(res.statusCode).toBe(200);
        expect(res.body.items[0].quantity).toBe(3); // 2 + 1
    });

    it('should retrieve the user\'s cart', async () => {
        console.log('🧪 Testing GET CART');
        
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);

        console.log('Get cart status:', res.statusCode);
        console.log('Cart items count:', res.body.items?.length);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBeGreaterThan(0);
    });

    it('should remove a product from the cart', async () => {
        console.log('🧪 Testing REMOVE FROM CART');
        
        const res = await request(app)
            .delete(`/api/cart/${productId}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('Remove response status:', res.statusCode);
        console.log('Remaining items:', res.body.items?.length);

        expect(res.statusCode).toBe(200);
        expect(res.body.items.length).toBe(0);
    });

    it('should return 401 for unauthenticated requests', async () => {
        const res = await request(app).get('/api/cart');
        expect(res.statusCode).toBe(401);
    });

    it('should return 404 for non-existent product', async () => {
        const fakeProductId = new mongoose.Types.ObjectId();
        
        console.log('🧪 Testing non-existent product:', fakeProductId.toString());
        
        const res = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: fakeProductId.toString(), quantity: 1 });

        console.log('Non-existent product response:', res.statusCode, res.body.message);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Product not found');
    });
});

// Export for other tests
module.exports = { token, productId, userId };