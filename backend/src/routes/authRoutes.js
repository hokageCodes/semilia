const express = require('express');
const { register, registerAdmin, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/register-admin', registerAdmin); // New admin registration endpoint
router.post('/login', login);

module.exports = router;