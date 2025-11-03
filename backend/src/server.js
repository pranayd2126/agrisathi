require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const mlRoutes = require('./routes/ml');
const marketplaceRoutes = require('./routes/marketplace');
const utilsRoutes = require('./routes/utils');

app.use('/api/auth', authRoutes);
app.use('/api/ml', mlRoutes); // ✅ Make sure this is here
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/utils', utilsRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/agri1')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



