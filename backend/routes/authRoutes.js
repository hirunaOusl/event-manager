const express = require('express');
const router = express.Router();
const { register, login, registerSeller, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/register-seller', protect, registerSeller);
router.get('/profile', protect, getProfile);

module.exports = router;