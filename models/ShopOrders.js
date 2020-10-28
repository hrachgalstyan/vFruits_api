const mongoose = require('mongoose');
const helpers = require('../helpers');

const shopOrdersSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'Users',
    required: [true, "You are not logged in"]
  },

  paymentMethod: { 
    type: String, 
    enum: Object.values(helpers.PAYMENT_METHODS), 
    default: helpers.PAYMENT_METHODS.CASH 
  },

  phoneNumber: {
    type: String,
    required: [true, "Please provide a phone number"]
  },

  address: {
    type: String,
    required: [true, "Please provide an delivery address"]
  },

  notes: {
    type: String,
    default: ""
  },

  price: { 
    type: Number, 
    min: helpers.MIN_ORDER_PRICE,
    required: true
  },

  bonus: { 
    type: Number, 
    default: 0 
  },

  deliveryTime: { 
    type: String,
    enum: Object.values(helpers.DELIVERY_TIMES)
  },

  deliveryDate: {type: String},
  deliverToday: { 
    type: Boolean, 
    default: false 
  },
  fromMobile: { type: Boolean, default: false },

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
    quantity: { type: Number, default: 0, required: [true, "Quantity can not be 0."] }
  }],

  status: { type: String, default: helpers.ORDER_STATUS.PENDING, enum: Object.values(helpers.ORDER_STATUS) },
  updated_by_admin: { type: mongoose.Schema.ObjectId, ref: 'Admins' },
  updated_at: { type: Date, default: new Date(Date.now() + 14400000)},
  created_at: { type: Date, default: new Date(Date.now() + 14400000)},
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
shopOrdersSchema.virtual('users', {
  ref: 'ShopOrder',
  foreignField: 'orders',
  localField: '_id'
});

const ShopOrders = mongoose.model('ShopOrders', shopOrdersSchema);

module.exports = ShopOrders;
