const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// 1. REGISTER (User/Seller default)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists || email === process.env.ADMIN_EMAIL) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user' // Default role
    });

    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. LOGIN (Handles User, Seller, and Admin)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Check if it is the Admin trying to log in
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({
          token: generateToken('ADMIN_ID', 'admin'),
          user: { id: 'ADMIN_ID', username: 'System Admin', email, role: 'admin' }
        });
      } else {
        return res.status(400).json({ message: 'Invalid Admin credentials' });
      }
    }

    // B. Check standard User/Seller accounts in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. UPGRADE TO SELLER (One-time business registration)
exports.registerSeller = async (req, res) => {
  try {
    const { businessName, businessAddress, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate if they are already a seller
    if (user.role === 'seller') {
      return res.status(400).json({ message: 'You already have a business account' });
    }

    // Upgrade user structural parameters
    user.role = 'seller';
    user.businessDetails = { businessName, businessAddress, phone };
    await user.save();

    // Issue a fresh token reflecting their new 'seller' role
    res.status(200).json({
      message: 'Business account created successfully!',
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessDetails: user.businessDetails
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. GET CURRENT USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({ id: 'ADMIN_ID', username: 'System Admin', email: process.env.ADMIN_EMAIL, role: 'admin' });
    }

    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. GET USER BY ID (Public Profile)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 6. UPDATE PROFILE (Self)
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, businessDetails, currentPassword, newPassword } = req.body;
    
    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'Admin profile cannot be modified via this endpoint' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update email (checking for uniqueness if changed)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists || email === process.env.ADMIN_EMAIL) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      user.email = email;
    }

    // Update username
    if (username) user.username = username;

    // Update business details
    if (businessDetails) {
      user.businessDetails = {
        businessName: businessDetails.businessName !== undefined ? businessDetails.businessName : user.businessDetails?.businessName,
        businessAddress: businessDetails.businessAddress !== undefined ? businessDetails.businessAddress : user.businessDetails?.businessAddress,
        phone: businessDetails.phone !== undefined ? businessDetails.phone : user.businessDetails?.phone
      };
    }

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessDetails: user.businessDetails
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};