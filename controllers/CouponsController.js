const Coupons = require('../models/Coupons');
const Factory = require('./HandlerFactory');

exports.getAll = Factory.getAll(Coupons);
exports.createCoupon = Factory.createOne(Coupons);
exports.getCoupon = Factory.getOne(Coupons);
exports.updateCoupon = Factory.updateOne(Coupons);
exports.deleteCoupon = Factory.deleteOne(Coupons);