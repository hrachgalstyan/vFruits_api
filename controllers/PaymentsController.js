const Payments = require('../models/Payments');
const Factory = require('./HandlerFactory');

exports.getAll = Factory.getAll(Payments);
exports.createPayment = Factory.createOne(Payments);
exports.getPayment = Factory.getOne(Payments);
exports.updatePayment = Factory.updateOne(Payments);;
exports.deletePayment = Factory.deleteOne(Payments);