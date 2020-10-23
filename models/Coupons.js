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

couponsSchema.pre(/^save/, async function(next) {
  await ActivityLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    type: helpers.ACTIVITY_LOGS_STATUS_TYPES.COUPON_CREATE,
    description: `Coupon "${this.name}" created!`
  });
  helpers.sendToTelegram(`Coupon "${this.name}" created! 💵`);
  next();
});

couponsSchema.pre(/^findOneAndUpdate/, async function(next) {
  const {name} = await this.model.findOne(this.getQuery());
  if(name){
    await ActivityLogs.create({
      admin: "5f8a0a8cb68b0e012ce2c846",
      type: helpers.ACTIVITY_LOGS_STATUS_TYPES.COUPON_UPDATE,
      description: `Coupon "${name}" updated!`
    });
    helpers.sendToTelegram(`Coupon "${name}" updated! 💵`);
  }
  next();
});

const Coupons = mongoose.model('Coupons', couponsSchema);

module.exports = Coupons;
