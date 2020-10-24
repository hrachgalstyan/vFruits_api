const mongoose = require('mongoose');
const helpers = require('../helpers');
const Users = require('./Users');
const ChangeLogs = require('./ChangeLogs');

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
    enum: Object.values(helpers.DELIVERY_TIMES),
    required: true
  },

  deliveryDate: {
    type: String,
    required: [true, "Please provide a delivery date"]
  },
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
    quantity: { type: Number, default: 0 }
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

shopOrdersSchema.pre(/^save/, async function(next) {
  this.bonus = this.price * 0.02;
  await Users.findByIdAndUpdate(this.user, {$inc: {bonus: this.bonus, orderCount: 1}}, {useFindAndModify: false});
  next();
});

shopOrdersSchema.pre(/^save/, function(next) {
  helpers.sendToTelegram(`New Order\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍`);
  next();
})

shopOrdersSchema.pre('findOneAndUpdate', function(next) {
  const {price} = this.getUpdate();
  if(price){
    this.update({bonus: price * 0.02});
    return next();
  }
  next();
});

shopOrdersSchema.pre(/^findOneAndUpdate/, async function(next) {
  const doc = await this.model.findOne(this.getQuery());
  const options = await this.getUpdate();
  const docName = Object.keys(options);
  if(doc || options){
    await ChangeLogs.create({
      admin: "5f8a0a8cb68b0e012ce2c846",
      target_model: helpers.CHANGE_LOGS_TARGETS.SHOP_ORDER,
      action_type: helpers.ACTIVITY_LOGS_STATUS_TYPES.ORDER_UPDATE,
      description: `Order ${doc.phoneNumber} updated! ${docName[0]} changed from "${doc[docName[0]]}" to "${options[docName[0]]}".`
    });
    helpers.sendToTelegram(`Order <b>${doc.phoneNumber}</b> updated!\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍\n\n${docName[0].toUpperCase()} changed from: <strike>${doc[docName[0]]}</strike> to: <i>${options[docName[0]]}</i>.`);
  }
  next();
});

const ShopOrders = mongoose.model('ShopOrders', shopOrdersSchema);

module.exports = ShopOrders;
