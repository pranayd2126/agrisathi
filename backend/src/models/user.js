const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple validation regexes
const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [phoneRegex, 'Please fill a valid phone number'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'vendor'],
    default: 'user',
  },
  avatar: { type: String, trim: true },
  cartData: { type: Object, default: {} },
  // Farming profile fields
  location: { type: String, trim: true },
  soilType: { type: String, trim: true },
  crop: { type: String, trim: true },
  landSize: { type: Number }, // in acres or hectares
  waterResource: { 
    type: String, 
    enum: ['Low', 'Medium', 'Full', ''],
    default: ''
  },
}, {
  timestamps: true,
  minimize: false
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// toJSON transform to hide sensitive fields
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);