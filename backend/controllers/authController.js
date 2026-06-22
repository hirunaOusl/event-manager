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
    const { 
      businessName, 
      businessAddress, 
      phone, 
      category, 
      description, 
      city, 
      taxNumber, 
      nicNumber, 
      whatsappNumber 
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate if they are already a seller
    if (user.role === 'seller') {
      return res.status(400).json({ message: 'You already have a business account' });
    }

    const taxFile = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";

    // Upgrade user structural parameters
    user.role = 'seller';
    user.businessDetails = {
      businessName,
      businessAddress,
      phone,
      category,
      description,
      city,
      taxFile,
      taxNumber,
      nicNumber,
      whatsappNumber
    };
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
    const hasBusinessUpdate = req.body.businessDetails || req.body.businessName || req.body.businessAddress || req.body.phone || req.body.category || req.body.description || req.body.city || req.body.taxNumber || req.body.nicNumber || req.body.whatsappNumber || req.file || req.files;

    if (hasBusinessUpdate && user.role === 'seller') {
      const details = req.body.businessDetails 
        ? (typeof req.body.businessDetails === 'string' ? JSON.parse(req.body.businessDetails) : req.body.businessDetails)
        : req.body;

      let taxFileUrl = details.taxFile !== undefined ? details.taxFile : user.businessDetails?.taxFile;
      let profileImageUrl = details.profileImage !== undefined ? details.profileImage : user.businessDetails?.profileImage;
      let coverImageUrl = details.coverImage !== undefined ? details.coverImage : user.businessDetails?.coverImage;

      if (req.files) {
        if (req.files.taxFile && req.files.taxFile[0]) {
          taxFileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.taxFile[0].filename}`;
        }
        if (req.files.profileImage && req.files.profileImage[0]) {
          profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.profileImage[0].filename}`;
        }
        if (req.files.coverImage && req.files.coverImage[0]) {
          coverImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.coverImage[0].filename}`;
        }
      } else if (req.file) {
        taxFileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }

      user.businessDetails = {
        businessName: details.businessName !== undefined ? details.businessName : user.businessDetails?.businessName,
        businessAddress: details.businessAddress !== undefined ? details.businessAddress : user.businessDetails?.businessAddress,
        phone: details.phone !== undefined ? details.phone : user.businessDetails?.phone,
        category: details.category !== undefined ? details.category : user.businessDetails?.category,
        description: details.description !== undefined ? details.description : user.businessDetails?.description,
        city: details.city !== undefined ? details.city : user.businessDetails?.city,
        taxNumber: details.taxNumber !== undefined ? details.taxNumber : user.businessDetails?.taxNumber,
        nicNumber: details.nicNumber !== undefined ? details.nicNumber : user.businessDetails?.nicNumber,
        whatsappNumber: details.whatsappNumber !== undefined ? details.whatsappNumber : user.businessDetails?.whatsappNumber,
        taxFile: taxFileUrl,
        profileImage: profileImageUrl,
        coverImage: coverImageUrl
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

// 7. GET ALL SELLERS
exports.getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};