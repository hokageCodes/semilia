// Test setup file to configure test environment
require('dotenv').config();

// Disable rate limiting in test environment
process.env.NODE_ENV = 'test';

// Mock rate limiting for tests
jest.mock('express-rate-limit', () => {
  return jest.fn(() => (req, res, next) => next());
});

// Increase timeout for all tests
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
  // Helper to create test user data
  createTestUser: (overrides = {}) => ({
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPass123',
    phone: '+2348012345678',
    ...overrides
  }),

  // Helper to create test admin data
  createTestAdmin: (overrides = {}) => ({
    name: 'Test Admin',
    email: `admin-${Date.now()}@example.com`,
    password: 'AdminPass123',
    adminSecret: process.env.ADMIN_SECRET || 'test-admin-secret',
    ...overrides
  }),

  // Helper to create test product data
  createTestProduct: (overrides = {}) => ({
    name: 'Test Product',
    description: 'Test product description',
    price: 100,
    countInStock: 10,
    category: {
      main: 'Women',
      sub: 'Dresses'
    },
    brand: 'Test Brand',
    isFeatured: false,
    ...overrides
  }),

  // Helper to create test order data
  createTestOrder: (userId, productId, overrides = {}) => ({
    user: userId,
    orderItems: [{
      name: 'Test Product',
      qty: 1,
      price: 100,
      product: productId
    }],
    shippingInfo: {
      fullName: 'Test User',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      country: 'Nigeria',
      postalCode: '12345',
      phone: '+2348012345678'
    },
    paymentMethod: 'Cash on Delivery',
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 100,
    ...overrides
  })
};

// Clean up console logs in tests (optional)
if (process.env.SILENT_TESTS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}
