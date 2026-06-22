const express = require('express');
const router = express.Router();
const { register, login, registerSeller, getProfile, getUserById, updateProfile, getSellers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.post('/register-seller', protect, upload.single('taxFile'), registerSeller);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.fields([
  { name: 'taxFile', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), updateProfile);
router.get('/users/:id', getUserById);
router.get('/sellers', getSellers);

module.exports = router;