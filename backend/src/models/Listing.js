const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
  sellerId: String,
  crop: String,
  qty: Number,
  price: Number,
  image: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Listing', Schema);
