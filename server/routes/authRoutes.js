const express = require('express');
const router = express.Router();
const { login, refresh, logout, me, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes — no JWT needed
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes — need valid JWT
router.get('/me', protect, me);
router.put('/change-password', protect, changePassword);

module.exports = router;
