const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'seller', 'admin'], 
    default: 'user' 
  },
  businessDetails: {
    businessName: { type: String },
    businessAddress: { type: String },
    phone: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);