const mongoose = require('mongoose');
const helpers = require('../helpers');

const dailySchema = new mongoose.Schema({
  orders: [{
    type: mongoose.Schema.ObjectId,
    ref: 'ShopOrders',
  }],

  // Snapshot of products with current state during ordering time
  products: [{
    // product ID
    _id: { type: mongoose.Schema.ObjectId, index: true },
    nameAm: String,
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    unit: { type: String, enum: helpers.UNIT_TYPES },
    maxOrder: { type: Number, default: 20 },
    minOrder: { type: Number, default: 0.5 },
    photo: String,
    quantity: { type: Number, default: 0 },
  }],

  dateString: { type: String, index: true },
  created_at: { type: Date, default: new Date(Date.now() + 14400000) },
});

const DailyTotals = mongoose.model('DailyTotals', dailySchema);

module.exports = DailyTotals;