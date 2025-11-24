const express = require('express');
const {
  subscribe,
  unsubscribe,
  getAllSubscriptions,
  deleteSubscription
} = require('../controllers/newsletterController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

module.exports = router;

