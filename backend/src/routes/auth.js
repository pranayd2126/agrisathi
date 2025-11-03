const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// Helper to sign JWT
function signToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  const secret = process.env.JWT_SECRET || 'secret_dev_key';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'name, email, phone and password are required' });
    }

    // Create user
    const user = new User({ name, email, phone, password });
    await user.save();

    const token = signToken(user);
    const userObj = user.toJSON ? user.toJSON() : user;
    return res.json({ token, user: userObj });
  } catch (err) {
    // Duplicate key
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0] || 'field';
      return res.status(409).json({ error: `${field} already exists` });
    }
    console.error('Signup error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user);
    const userObj = user.toJSON ? user.toJSON() : user;
    return res.json({ token, user: userObj });
  } catch (err) {
    console.error('Signin error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Keep legacy /login for backward compatibility
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = { id: 'user_' + Date.now(), email, role: 'farmer' };
      const token = jwt.sign(user, process.env.JWT_SECRET || 'secret_dev_key', { expiresIn: '7d' });
      return res.json({ token, user });
    }
    return res.status(400).json({ error: 'Missing credentials' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const secret = process.env.JWT_SECRET || 'secret_dev_key';
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GET /profile - Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const userObj = user.toJSON ? user.toJSON() : user;
    return res.json(userObj);
  } catch (err) {
    console.error('Get profile error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /profile - Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, location, soilType, crop, landSize, waterResource, avatar } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (soilType !== undefined) updateData.soilType = soilType;
    if (crop !== undefined) updateData.crop = crop;
    if (landSize !== undefined) updateData.landSize = landSize;
    if (waterResource !== undefined) updateData.waterResource = waterResource;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.userId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const userObj = user.toJSON ? user.toJSON() : user;
    return res.json(userObj);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0] || 'field';
      return res.status(409).json({ error: `${field} already exists` });
    }
    console.error('Update profile error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
