const express = require('express');
const router = express.Router();
const { register, login, registerSeller, getProfile, getUserById, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/register-seller', protect, registerSeller);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users/:id', getUserById);

module.exports = router;