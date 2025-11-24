// src/routes/adminRoutes.js

const express = require('express');
const { 
  getAdminStats, 
  getAllUsers, 
  updateUserStatus,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const {
  getAllSubscriptions,
  deleteSubscription
} = require('../controllers/newsletterController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

// Order management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Newsletter management
router.get('/newsletter', getAllSubscriptions);
router.delete('/newsletter/:id', deleteSubscription);

module.exports = router;
