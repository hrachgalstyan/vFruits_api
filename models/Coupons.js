const mongoose = require('mongoose');
const helpers = require('../helpers');
const ActivityLogs = require('./ActivityLogs');

const couponsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: { type: String, unique: true, index: true, required: true },
  discount: { type: Number, default: 0, required: true },
  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date(Date.now() + 14400000) },
  updated_at: { type: Date, default: new Date(Date.now() + 14400000) },
});

const Coupons = mongoose.model('Coupons', couponsSchema);

module.exports = Coupons;
