import api from './axios';

// ==================== AUTH API ====================

export const authAPI = {
  // Register new user
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Verify email with code
  verifyEmail: async (email, code) => {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  },

  // Resend verification code
  resendVerificationCode: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
};

// ==================== PRODUCTS API ====================

export const productsAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  // Get best selling products
  getBestSellers: async (limit = 8) => {
    const response = await api.get('/products/bestsellers', { params: { limit } });
    return response.data;
  },

  // Get products on sale
  getSaleProducts: async (limit = 8) => {
    const response = await api.get('/products/sale', { params: { limit } });
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (id, limit = 4) => {
    const response = await api.get(`/products/${id}/related`, { params: { limit } });
    return response.data;
  },

  // Increment view count
  incrementView: async (id) => {
    const response = await api.patch(`/products/${id}/view`);
    return response.data;
  },

  // Add product review
  addReview: async (id, review) => {
    const response = await api.post(`/products/${id}/reviews`, review);
    return response.data;
  },
};

// ==================== CART API ====================

export const cartAPI = {
  // Get user cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (productId, quantity) => {
    const response = await api.patch(`/cart/${productId}`, { quantity });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

// ==================== ORDERS API ====================

export const ordersAPI = {
  // Create order (supports guest and authenticated)
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  getMyOrders: async () => {
    const response = await api.get('/orders/my');
    return response.data;
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Track order by order number (public)
  trackOrder: async (orderNumber) => {
    const response = await api.get(`/orders/track/${orderNumber}`);
    return response.data;
  },

  // Mark order as paid
  markAsPaid: async (id, paymentResult) => {
    const response = await api.put(`/orders/${id}/pay`, paymentResult);
    return response.data;
  },
};

// ==================== ADMIN API ====================

export const adminAPI = {
  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId, data) => {
    const response = await api.patch(`/admin/users/${userId}/status`, data);
    return response.data;
  },

  // Get all orders
  getOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, data) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, data);
    return response.data;
  },

  // Confirm payment (admin only)
  confirmPayment: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/confirm-payment`);
    return response.data;
  },

  // Get order by ID (admin view)
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Create product
  createProduct: async (formData) => {
    const response = await api.post('/products', formData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    const response = await api.patch(`/products/${id}/featured`);
    return response.data;
  },

  // Get newsletter subscriptions
  getNewsletterSubscriptions: async (params = {}) => {
    const response = await api.get('/admin/newsletter', { params });
    return response.data;
  },

  // Delete newsletter subscription
  deleteNewsletterSubscription: async (id) => {
    const response = await api.delete(`/admin/newsletter/${id}`);
    return response.data;
  },
};

// ==================== NEWSLETTER API ====================

export const newsletterAPI = {
  // Subscribe to newsletter
  subscribe: async (email, source = 'homepage') => {
    const response = await api.post('/newsletter/subscribe', { email, source });
    return response.data;
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email) => {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  },
};

// ==================== CATEGORIES API ====================

export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};

export default api;

